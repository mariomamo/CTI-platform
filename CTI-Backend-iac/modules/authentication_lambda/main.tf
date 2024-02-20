resource "aws_iam_role" "authentication_lambda_iam_role" {
  name               = "authentication-lambda-iam-role"
  assume_role_policy = data.aws_iam_policy_document.authentication-lambda-assume-role.json
}

resource "aws_lambda_layer_version" "authentication_lambda_dependencies_layer" {
  filename   = "authentication-lambda-dependencies-archive.zip"
  layer_name = "authentication-lambda-dependencies"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_layer_version" "authentication_lambda_keys_layer" {
  filename   = "authentication-lambda-keys-archive.zip"
  layer_name = "authentication-lambda-keys"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_function" "authentication_lambda" {
  filename      = "authentication-lambda-archive.zip"
  function_name = "authentication-lambda"
  role          = aws_iam_role.authentication_lambda_iam_role.arn
  handler       = "authentication_lambda.handler"
  package_type  = "Zip"
  source_code_hash = data.archive_file.authentication_lambda_archive.output_base64sha256

  runtime       = "python3.11"
  architectures = ["x86_64"]
  timeout       = 60

  layers = [
    aws_lambda_layer_version.authentication_lambda_dependencies_layer.arn,
    aws_lambda_layer_version.authentication_lambda_keys_layer.arn
  ]

  vpc_config {
    security_group_ids = [var.security_group_id]
    subnet_ids         = var.subnet_ids_list
  }

  environment {
    variables = {
      API_GW_ENDPOINT = var.apigateway_api_endpoint
      PROD_ENDPOINT   = var.apigateway_stage_name
      COLLECTION_NAME = "RefreshToken"
      DB_NAME         = "CTIDao"
      DOCUMENTDB_CONNECTION_STRING = "${var.documentdb_connection_string}/?tls=true&tlsCAFile=global-bundle.pem&authSource=admin&retryWrites=false"
    }
  }
}

resource "aws_iam_role_policy_attachment" "authentication_lambda_policy_attachment" {
  role       = aws_iam_role.authentication_lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_apigatewayv2_integration" "authentication_lambda_integration" {
  api_id      = var.apigateway_id
  description = "Integration for cti access lambda invocation"

  integration_uri  = aws_lambda_function.authentication_lambda.invoke_arn
  integration_type = "AWS_PROXY"

}

resource "aws_apigatewayv2_route" "authentication_lambda_configuration_route" {
  api_id    = var.apigateway_id
  route_key = "GET /auth/.well-known/openid-configuration"
  target    = "integrations/${aws_apigatewayv2_integration.authentication_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "authentication_lambda_keys_route" {
  api_id    = var.apigateway_id
  route_key = "GET /auth/keys"
  target    = "integrations/${aws_apigatewayv2_integration.authentication_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "authentication_lambda_gen_route" {
  api_id             = var.apigateway_id
  route_key          = "POST /auth/generate-jwt"
  target             = "integrations/${aws_apigatewayv2_integration.authentication_lambda_integration.id}"
  authorization_type = "AWS_IAM"
}

resource "aws_apigatewayv2_route" "authentication_lambda_refresh_route" {
  api_id    = var.apigateway_id
  route_key = "POST /auth/refresh-jwt"
  target    = "integrations/${aws_apigatewayv2_integration.authentication_lambda_integration.id}"
}

resource "time_sleep" "wait_30_seconds" {
  create_duration = "30s"
  depends_on      = [aws_apigatewayv2_route.authentication_lambda_configuration_route]
}

resource "aws_apigatewayv2_authorizer" "authentication_lambda_authorizer" {
  api_id           = var.apigateway_id
  name             = "AuthenticationLambdaAuthorizer"
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    issuer   = "${var.apigateway_api_endpoint}/${var.apigateway_stage_name}/auth/"
    audience = ["CTI-backend"]
  }

  depends_on = [time_sleep.wait_30_seconds]
}

resource "aws_lambda_permission" "allow_api_gateway_lambda_permission" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authentication_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.apigateway_execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "authentication_lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.authentication_lambda.function_name}"
  retention_in_days = 1
}
