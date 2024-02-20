resource "aws_iam_role" "cti_access_lambda_iam_role" {
  name               = "cti-access-lambda-iam-role"
  assume_role_policy = data.aws_iam_policy_document.cti_access_lambda_assume_role.json
}

resource "aws_lambda_layer_version" "access_lambda_dependencies_layer" {
  filename   = "access-lambda-dependencies-archive.zip"
  layer_name = "access-lambda-dependencies"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_layer_version" "access_lambda_abi_layer" {
  filename   = "access-lambda-abi-archive.zip"
  layer_name = "access-lambda-abi"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}


resource "aws_lambda_function" "cti_access_lambda" {
  filename         = "cti-access-lambda-archive.zip"
  function_name    = "cti-access-lambda"
  role             = aws_iam_role.cti_access_lambda_iam_role.arn
  handler          = "cti_access_lambda.handler"
  package_type     = "Zip"
  source_code_hash = data.archive_file.cti_access_lambda_archive.output_base64sha256

  runtime       = "python3.11"
  architectures = ["x86_64"]
  timeout       = 60

  vpc_config {
    security_group_ids = [var.security_group_id]
    subnet_ids         = var.subnet_ids_list
  }

  layers = [
    aws_lambda_layer_version.access_lambda_dependencies_layer.arn,
    aws_lambda_layer_version.access_lambda_abi_layer.arn
  ]

  environment {
    variables = {
      COLLECTION_NAME              = "CTIData"
      DB_NAME                      = "CTIDao"
      DOCUMENTDB_CONNECTION_STRING = "${var.documentdb_connection_string}/?tls=true&tlsCAFile=global-bundle.pem&authSource=admin&retryWrites=false"
      ETHEREUM_NODE_URL            = "https://9c11-79-46-52-108.ngrok-free.app"
      PROD_ENDPOINT                = var.apigateway_stage_name
      KAFKA_BOOTSTRAP_SERVER       = var.kafka_bootstrap_brokers
      NOTIFICATION_TOPIC           = "cti.notification.events"
      CTI_FACTORY_ADDRESS          = "0xed47A97C09AB99a57140f45beA86A985AB2b5843"
      CTI_USER_ADDRESS             = "0xaA745EFDaf0C2eA6b74243D7b45fA4031Cd6581C"
      CTI_ORACLE_ADDRESS           = "0x031F991B02d31D813039D4766850a8ac1a0F2d11"
      CTI_TOKEN_ADDRESS            = "0x861d96eaB549102C67470ba8e324482025796483"
      WALLET_PRIVATE_KEY           = "0x47733e072182f21edca0eaafa05d03566847e7af70dba0b67d79744bc41d3b4a"
    }
  }
}

resource "aws_iam_role_policy_attachment" "cti_access_lambda_policy_attachment" {
  role       = aws_iam_role.cti_access_lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_apigatewayv2_integration" "cti_access_lambda_integration" {
  api_id           = var.apigateway_id
  description      = "Integration for cti access lambda invocation"
  integration_uri  = aws_lambda_function.cti_access_lambda.invoke_arn
  integration_type = "AWS_PROXY"
}

resource "aws_apigatewayv2_route" "cti_read_lambda_route" {
  api_id             = var.apigateway_id
  route_key          = "GET /cti"
  target             = "integrations/${aws_apigatewayv2_integration.cti_access_lambda_integration.id}"
#  authorization_type = "JWT"
#  authorizer_id      = var.authorizer_id
}

resource "aws_apigatewayv2_route" "cti_insert_lambda_route" {
  api_id             = var.apigateway_id
  route_key          = "PUT /cti"
  target             = "integrations/${aws_apigatewayv2_integration.cti_access_lambda_integration.id}"
#  authorization_type = "JWT"
#  authorizer_id      = var.authorizer_id
}

resource "aws_lambda_permission" "allow_api_gateway_lambda_permission" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cti_access_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.apigateway_execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "cti_access_lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.cti_access_lambda.function_name}"
  retention_in_days = 1
}

