# How to create resources on AWS
Move to environments/testenv folder
```shell
cd environments/testenv
```

Install needed terraform libraries
```shell
terraform init
```

Run terraform apply command
```shell
terraform apply --auto-approve
```

# Test in local
Go to the lambda folder
```bash
cd modules\<lambda_folder>\src
```

and run these commands
```bash
docker build --platform linux/amd64 -t <image_name> .
```

```bash
docker run -d --platform linux/amd64 -p <external_port>:8080 --name <container_name> <image_name>
```

### CTI access lambda
```bash
cd modules\cti_access_lambda\src
```

```bash
docker build --platform linux/amd64 -t cti_access_lambda .
```

```bash
docker run -d --platform linux/amd64 -p 7000:8080 --name cti_access_lambda cti_access_lambda
```

### Authentication blockchain lambda
```bash
cd modules\authentication_blockchain_lambda\src
```

```bash
docker build --platform linux/amd64 -t authentication_blockchain_lambda .
```

```bash
docker run -d --platform linux/amd64 -p 7001:8080 --name authentication_blockchain_lambda authentication_blockchain_lambda
```

### Authentication lambda
```bash
cd modules\authentication_lambda\src
```

```bash
docker build --platform linux/amd64 -t authentication_lambda .
```

```bash
docker run -d --platform linux/amd64 -p 7002:8080 --name authentication_lambda authentication_lambda
```

# Invoke lambdas
Invoke this url to add a new cti
```bash
http://localhost:9000/2015-03-31/functions/function/invocations
```

Use this body to add a new cti
```bash
{
    "httpMethod": "PUT",
    "path": "/localhost/cti",
    "queryStringParameters": {"id": "example--156487987984", "name": "My Fourth vulnerability"},
    "body": "{\"cti\": {\"type\": \"example\",\"id\": \"example--156487987986\",\"name\": \"My Fourth vulnerability\",\"description\": \"this is the description\"}, \"proposer_address\":\"0x7329159397320e68600F2EdD24852172BEa43226\"}"
}
```

# Local api GW
You can found a local API gw inside the folder `local mocks`. It is a simple server that translate e a normal HTTP request in the format expected by the aws lambda container and return the response as is.

Just install the requirements

```python
pip install -m requirements.txt
```

And run the server
```python
python -m main.py
```

# Build image for production
```bash
cd modules/cti_access_lambda/src/docker-build
```

```bash
docker build -t lambda_build .
```

```bash
cd ../code
```

Note: in the root folder must be the requirements.txt file
```bash
docker run --rm -v <full_path_to_root_folder>:/code --name lambda_name lambda_build
```