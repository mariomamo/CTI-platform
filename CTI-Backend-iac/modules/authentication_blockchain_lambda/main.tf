resource "aws_iam_role" "authentication_blockchain_lambda_iam_role" {
  name               = "authentication-blockchain-lambda-iam-role"
  assume_role_policy = data.aws_iam_policy_document.authentication-blockchain-lambda-assume-role.json
}

resource "aws_lambda_layer_version" "authentication_blockchain_lambda_dependencies_layer" {
  filename   = "authentication-blockchain-lambda-dependencies-archive.zip"
  layer_name = "authentication-blockchain-lambda-dependencies"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_layer_version" "authentication_blockchain_lambda_abi_layer" {
  filename   = "authentication-blockchain-lambda-abi-archive.zip"
  layer_name = "authentication-blockchain-lambda"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_function" "authentication_blockchian_lambda" {
  filename      = "authentication-blockchain-lambda-archive.zip"
  function_name = "authentication-blockchain-lambda"
  role          = aws_iam_role.authentication_blockchain_lambda_iam_role.arn
  handler       = "authentication_blockchain_lambda.handler"
  package_type  = "Zip"
  source_code_hash = data.archive_file.authentication_blockchain_lambda_archive.output_base64sha256

  runtime       = "python3.11"
  architectures = ["x86_64"]
  timeout       = 60

  layers = [
    aws_lambda_layer_version.authentication_blockchain_lambda_dependencies_layer.arn,
    aws_lambda_layer_version.authentication_blockchain_lambda_abi_layer.arn
  ]

  vpc_config {
    security_group_ids = [var.security_group_id]
    subnet_ids         = var.subnet_ids_list
  }

  environment {
    variables = {
      DOCUMENTDB_CONNECTION_STRING = "${var.documentdb_connection_string}/?tls=true&tlsCAFile=global-bundle.pem&authSource=admin&retryWrites=false"
      PROD_ENDPOINT                = var.apigateway_stage_name
      COLLECTION_NAME              = "Nonce"
      DB_NAME                      = "CTIDao"
      ETHEREUM_NODE_URL            = "https://9c11-79-46-52-108.ngrok-free.app"
      CTI_USER_ADDRESS             = "0xaA745EFDaf0C2eA6b74243D7b45fA4031Cd6581C"
    }
  }
}

resource "aws_iam_role_policy_attachment" "authentication_blockchain_lambda_policy_attachment" {
  role       = aws_iam_role.authentication_blockchain_lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_cloudwatch_log_group" "authentication_blockchian_lambda_log_group" {
  retention_in_days = 1
  name              = "/aws/lambda/${aws_lambda_function.authentication_blockchian_lambda.function_name}"
}

resource "aws_apigatewayv2_integration" "authentication_blockchain_lambda_integration" {
  api_id      = var.apigateway_id
  description = "Integration for blockchain login"

  integration_uri  = aws_lambda_function.authentication_blockchian_lambda.invoke_arn
  integration_type = "AWS_PROXY"
}

resource "aws_apigatewayv2_route" "authentication_blockchain_lambda_nonce_route" {
  api_id    = var.apigateway_id
  route_key = "GET /blockchain/nonce/{address}"
  target    = "integrations/${aws_apigatewayv2_integration.authentication_blockchain_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "authentication_blockchain_lambda_signature_route" {
  api_id             = var.apigateway_id
  route_key          = "POST /blockchain/verify-signature"
  target             = "integrations/${aws_apigatewayv2_integration.authentication_blockchain_lambda_integration.id}"
  authorization_type = "AWS_IAM"
}

resource "aws_lambda_permission" "allow_api_gateway_lambda_permission" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authentication_blockchian_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.apigateway_execution_arn}/*/*"
}