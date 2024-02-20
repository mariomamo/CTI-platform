import json
import traceback

import requests
from flask import Flask, request
from flask_cors import CORS, cross_origin

PORT = 5000

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

routes = {
    "cti": "http://localhost:7000/2015-03-31/functions/function/invocations",
    "blockchain/nonce": "http://localhost:7001/2015-03-31/functions/function/invocations",
    "blockchain/verify-signature": "http://localhost:7001/2015-03-31/functions/function/invocations",
    "blockchain/login": "http://localhost:5000/login",
    "auth/generate-jwt": "http://localhost:7002/2015-03-31/functions/function/invocations",
    "auth/refresh-jwt": "http://localhost:7002/2015-03-31/functions/function/invocations",
}


@app.route('/<path:path>', methods=["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "CONNECT", "TRACE", "PATH"])
@cross_origin()
def index(path):
    print(f"method: {request.method}")
    # print(f"input headers: {request.headers}")
    headers = get_headers(request)
    print(f"headers: {headers}")
    id = request.args.get('id')
    payload = {
        "httpMethod": request.method,
        "path": f"/localhost/{path}",
        "queryStringParameters": {"id": id},
        "headers": headers,
        "body": request.data.decode()
    }
    print(f"payload: {json.dumps(payload)}")
    lambda_url = get_route(routes, path)
    if not lambda_url:
        return {"message": "route not found"}, 404

    print(f"lambda url: {path} -> {lambda_url}")
    try:
        response = requests.request(request.method, '%s' % lambda_url, data=json.dumps(payload),
                                    headers=request.headers)
        print(f">>> response [{path}]: {response}")
        response = response.json()
        print(f"json response: {response}")
        if "body" in response:
            body = response["body"]
            headers = response["multiValueHeaders"]
            status_code = response["statusCode"]
        else:
            body = response
            headers = {"Content-Type": "application/json"}
            status_code = 500
    except Exception:
        traceback.print_exc()
        status_code = 500
        body = {"message": "Internal server error"}
        headers = {"Content-Type": "application/json"}

    return body, status_code, headers


# login -> verify_signature -> generate_jwt
@app.post("/login")
def login():
    print("/login")
    input_payload = json.loads(request.data.decode())
    print(f"received payload: {input_payload}")

    if "body" not in input_payload:
        status_code = 500
        body = {"message": "Internal server error"}
        headers = {"Content-Type": "application/json"}
        return body, status_code, headers

    input_payload = input_payload["body"]
    print(f"input_payload: {input_payload}")

    print(input_payload)
    response = requests.post(f"http://localhost:{PORT}/blockchain/verify-signature", data=input_payload)
    response = response.json()
    print(f"/verify-signature response: {response}")

    input_payload = json.loads(input_payload)
    print({"address": input_payload["address"]})
    response = requests.post(f"http://localhost:{PORT}/auth/generate-jwt", data=json.dumps({"id": input_payload["address"]}))
    response = response.json()
    print(f"/generate-jwt response: {response}")

    if "jwt" in response:
        status_code = 200
        body = {"body": {"output": json.dumps({"jwt": response["jwt"], "refresh_token": response["refresh_token"]})}}
    else:
        status_code = 500
        body = {"message": "Internal server error"}

    headers = {"Content-Type": "application/json"}
    body["multiValueHeaders"] = {"Content-Type": ["application/json"]}
    body["statusCode"] = status_code
    return body, status_code, headers


def get_headers(request):
    headers = {}
    for tuple in request.args.lists():
        headers[tuple[0]] = tuple[1][0]
    for header in request.headers:
        headers[header[0]] = header[1]
    return headers


def get_route(routes, path):
    if path not in routes:
        while "/" in path:
            path = path.rpartition("/")[0]
            if path in routes:
                return routes[path]
        return None
    return routes[path]


# @app.put('/cti')
# @cross_origin()
# def put_index():
#     data = request.data.decode()
#     headers = {
#         "referer": "http://localhost:5173/"
#     }
#     payload = {
#         "httpMethod": "PUT",
#         "path": "/localhost/cti",
#         "body": data
#     }
#     print(f"payload {json.dumps(payload)}")
#     r = requests.put('http://localhost:9000/2015-03-31/functions/function/invocations', data=json.dumps(payload),
#                      headers=request.headers)
#     response = r.json()
#     print(response)
#     return response["body"], response["statusCode"]
#     # return {"message":"CTI successfully added"}


if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0", port=PORT)  # go to http://localhost:5000/ to view the page.
