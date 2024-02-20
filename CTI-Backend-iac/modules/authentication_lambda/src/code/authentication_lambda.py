import jwt
import os
import hashlib
import random
import uuid
import base64
from aws_lambda_powertools.event_handler import ApiGatewayResolver
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from datetime import timedelta
from datetime import datetime
from datetime import timezone
from database import DocumentDb

def encode_to_base64url_uint(number):
    byte_representation = number.to_bytes((number.bit_length() + 7) // 8, byteorder='big', signed=False)
    encoded_str = base64.urlsafe_b64encode(byte_representation).decode('utf-8').rstrip("=")

    return encoded_str

def get_file_bytes(file_path):
    with open(file_path, "rb") as privatefile:
        private_key_data = privatefile.read()
    return private_key_data


def load_keys_dict():
    keys_dict = dict()
    jwks_uri_dict = {"keys": []}
    for root, dirs, _ in os.walk("/opt/keys"):
        for directory in dirs:
            subfolder_path = os.path.join(root, directory)
            kid = hashlib.sha256(bytes(subfolder_path, "UTF-8")).hexdigest()
            entry_dict = dict()
            for file in os.listdir(subfolder_path):
                file_bytes = get_file_bytes(os.path.join(subfolder_path, file))
                if "private" in file:
                    entry_dict.update({'private': file_bytes})
                elif "public" in file:
                    entry_dict.update({'public': file_bytes})
                    public_key = serialization.load_pem_public_key(file_bytes)
                    jwks = {
                        "kty": "RSA",
                        "n": encode_to_base64url_uint(public_key.public_numbers().n),
                        "e": encode_to_base64url_uint(public_key.public_numbers().e),
                        "kid": kid,
                        "alg": "RS512",
                        "use": "sig"
                    }
                    jwks_uri_dict["keys"].append(jwks)
            keys_dict.update({kid: entry_dict})
    return keys_dict, jwks_uri_dict


def generate_new_refresh_token_and_expiration_time():
    expiration_date = datetime.now(timezone.utc) + timedelta(minutes=60)
    refresh_token = str(uuid.uuid4())

    return refresh_token, int(expiration_date.timestamp())


def generate_headers_and_payload(kid, id):
    issuer = f"{api_gw_endpoint}/{prod_endpoint}/auth/"
    issued_at_time = datetime.now(timezone.utc)
    expiration_date = issued_at_time + timedelta(minutes=10)
    expiry = int(expiration_date.timestamp())

    headers = {"kid": kid}
    payload = {"iss": issuer, "exp": expiry, "aud": ["CTI-backend"], "iat": issued_at_time, "nbf": issued_at_time, "id": id}
    return headers, payload


app = ApiGatewayResolver()
prod_endpoint = os.getenv('PROD_ENDPOINT')
api_gw_endpoint = os.getenv('API_GW_ENDPOINT')
keys_dict, jwks_uri_dict = load_keys_dict()
documentdb_connection_string = os.getenv("DOCUMENTDB_CONNECTION_STRING")
db_name = os.getenv('DB_NAME')
collection_name = os.getenv('COLLECTION_NAME')
document_db_client = DocumentDb(documentdb_connection_string, db_name, collection_name)


def generate_jwt(id: str):
    kid, keys = random.choice(list(keys_dict.items()))
    jwt_algorithm = "RS512"
    headers, payload = generate_headers_and_payload(kid, id)
    priv_rsakey = serialization.load_pem_private_key(keys['private'], password=None, backend=default_backend())
    jwt_token = jwt.encode(payload=payload, headers=headers, algorithm=jwt_algorithm, key=priv_rsakey)
    return jwt_token


def get_and_validate_refresh_token_document(id: str):
    refresh_token_document = document_db_client.get_refresh_token_document_by_id(id)
    if not refresh_token_document or refresh_token_document['expiration_time'] < int(datetime.now(timezone.utc).timestamp()):
        raise ValueError(f"The id {id} has not a refresh token registered.")

    return refresh_token_document


def generate_jwt_and_refresh_token_with_database_update(id: str):
    refresh_token, expiration_date = generate_new_refresh_token_and_expiration_time()
    document_db_client.update_refresh_token_by_id(id, refresh_token, expiration_date)
    return {"jwt": generate_jwt(id), "refresh_token": refresh_token}


@app.get(f"/{prod_endpoint}/auth/.well-known/openid-configuration")
def get_openid_configuration():
    return {"jwks_uri": f"{api_gw_endpoint}/{prod_endpoint}/auth/keys", "issuer": f"{api_gw_endpoint}/{prod_endpoint}/auth/"}


@app.get(f"/{prod_endpoint}/auth/keys")
def get_keys_in_jwks_format():
    return jwks_uri_dict


@app.post(f"/{prod_endpoint}/auth/refresh-jwt")
def post_refresh_jwt():
    try:
        body = app.current_event.json_body
        refresh_token_document = get_and_validate_refresh_token_document(body['id'])
        if body['refresh_token'] == refresh_token_document['refresh_token']:
            return generate_jwt_and_refresh_token_with_database_update(body['id'])
    except Exception as e:
        return {"error": str(e)}


@app.post(f"/{prod_endpoint}/auth/generate-jwt")
def post_generate_jwt():
    try:
        body = app.current_event.json_body
        return generate_jwt_and_refresh_token_with_database_update(body['id'])
    except Exception:
        return {"error": "There was an error when generating the JWT"}


def handler(event, context):
    return app.resolve(event, context)


if __name__ == '__main__':
    print(post_generate_jwt())
