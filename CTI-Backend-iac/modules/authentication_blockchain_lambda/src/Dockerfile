FROM public.ecr.aws/lambda/python:3.11

COPY code/requirements.txt ${LAMBDA_TASK_ROOT}

RUN pip install -r requirements.txt

COPY code ${LAMBDA_TASK_ROOT}
COPY contracts /opt

ENV AWS_LAMBDA_FUNCTION_NAME=authentication_blockchain_lambda

ENV PROD_ENDPOINT=localhost
ENV DOCUMENTDB_CONNECTION_STRING=mongodb://host.docker.internal:27017
ENV COLLECTION_NAME=Nonce
ENV DB_NAME=CTIDao
ENV ETHEREUM_NODE_URL=http://host.docker.internal:7545
ENV CTI_USER_ADDRESS=0xBaef545AA7032dA5a16Aa47106F573dF76E7Ceea

CMD [ "authentication_blockchain_lambda.handler" ]