resource "aws_iam_role" "cti_events_store_lambda_iam_role" {
  name               = "cti-events-store-lambda-iam-role"
  assume_role_policy = data.aws_iam_policy_document.cti_events_store_lambda-assume-role.json
}

resource "aws_lambda_layer_version" "cti_events_store_lambda_dependencies_layer" {
  filename   = "cti-events-store-lambda-dependencies-archive.zip"
  layer_name = "cti-events-store-lambda-dependencies"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}


resource "aws_lambda_function" "cti_events_store_lambda" {
  filename         = "cti-events-store-lambda-archive.zip"
  function_name    = "cti-events-store-lambda"
  role             = aws_iam_role.cti_events_store_lambda_iam_role.arn
  handler          = "cti_events_store_lambda.handler"
  package_type     = "Zip"
  source_code_hash = data.archive_file.cti_events_store_lambda_archive.output_base64sha256

  runtime       = "python3.11"
  architectures = ["x86_64"]
  timeout       = 60

  layers = [
    aws_lambda_layer_version.cti_events_store_lambda_dependencies_layer.arn
  ]

  vpc_config {
    security_group_ids = [var.security_group_id]
    subnet_ids         = var.subnet_ids_list
  }

  environment {
    variables = {
      PROD_ENDPOINT                = var.apigateway_stage_name
      COLLECTION_NAME              = "BlockchainEvents"
      DB_NAME                      = "CTIEvents"
      DOCUMENTDB_CONNECTION_STRING = "${var.documentdb_connection_string}/?tls=true&tlsCAFile=global-bundle.pem&authSource=admin&retryWrites=false"
    }
  }
}

resource "aws_iam_role_policy_attachment" "cti_events_store_lambda_policy_attachment" {
  role       = aws_iam_role.cti_events_store_lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_apigatewayv2_integration" "cti_events_store_lambda_integration" {
  api_id      = var.apigateway_id
  description = "Integration for cti events store lambda invocation"

  integration_uri  = aws_lambda_function.cti_events_store_lambda.invoke_arn
  integration_type = "AWS_PROXY"

}

resource "aws_apigatewayv2_route" "cti_events_store_lambda_insert_route" {
  api_id             = var.apigateway_id
  route_key          = "PUT /events/{event}"
  target             = "integrations/${aws_apigatewayv2_integration.cti_events_store_lambda_integration.id}"
  authorization_type = "AWS_IAM"
}

resource "aws_apigatewayv2_route" "cti_events_store_lambda_get_route" {
  api_id             = var.apigateway_id
  route_key          = "GET /events/{event}"
  target             = "integrations/${aws_apigatewayv2_integration.cti_events_store_lambda_integration.id}"
  authorization_type = "AWS_IAM"
}

resource "aws_lambda_permission" "allow_api_gateway_lambda_permission" {
  statement_id  = "AllowExecutionFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cti_events_store_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.apigateway_execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "cti_events_store_lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.cti_events_store_lambda.function_name}"
  retention_in_days = 1
}
