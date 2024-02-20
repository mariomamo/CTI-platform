FROM public.ecr.aws/lambda/python:3.11

COPY code/requirements.txt ${LAMBDA_TASK_ROOT}

RUN pip install -r requirements.txt

COPY code ${LAMBDA_TASK_ROOT}
COPY lambda_keys /opt

ENV AWS_LAMBDA_FUNCTION_NAME=authentication_lambda

ENV PROD_ENDPOINT=localhost
ENV API_GW_ENDPOINT=localhost://5000
ENV DOCUMENTDB_CONNECTION_STRING=mongodb://host.docker.internal:27017
ENV COLLECTION_NAME=RefreshToken
ENV DB_NAME=CTIDao

CMD [ "authentication_lambda.handler" ]