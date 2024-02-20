resource "aws_iam_role" "cti_poll_ender_lambda_iam_role" {
  name               = "cti-poll-ender-lambda-iam-role"
  assume_role_policy = data.aws_iam_policy_document.cti_poll_ender_lambda_assume_role.json
}

resource "aws_iam_role" "cti_poll_ender_events_scheduler_iam_role" {
  name               = "cti-poll-ender-events-scheduler-iam-role"
  assume_role_policy = data.aws_iam_policy_document.cti_poll_ender_events_scheduler_assume_role.json
}

resource "aws_lambda_layer_version" "cti_poll_ender_lambda_dependencies_layer" {
  filename   = "cti-poll-ender-lambda-dependencies-archive.zip"
  layer_name = "cti-poll-ender-lambda-dependencies"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_layer_version" "cti_poll_ender_lambda_abi_layer" {
  filename   = "cti-poll-ender-lambda-abi-archive.zip"
  layer_name = "cti-poll-ender-lambda-abi"

  compatible_runtimes      = ["python3.11"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_function" "cti_poll_ender_lambda" {
  filename         = "cti-poll-ender-lambda-archive.zip"
  function_name    = "cti-poll-ender-lambda"
  role             = aws_iam_role.cti_poll_ender_lambda_iam_role.arn
  handler          = "cti_poll_ender_lambda.handler"
  package_type     = "Zip"
  source_code_hash = data.archive_file.cti_poll_ender_lambda_archive.output_base64sha256

  runtime       = "python3.11"
  architectures = ["x86_64"]
  timeout       = 60

  layers = [
    aws_lambda_layer_version.cti_poll_ender_lambda_dependencies_layer.arn,
    aws_lambda_layer_version.cti_poll_ender_lambda_abi_layer.arn
  ]

  vpc_config {
    security_group_ids = [var.security_group_id]
    subnet_ids         = var.subnet_ids_list
  }

  environment {
    variables = {
      COLLECTION_NAME              = "BlockchainEvents"
      DB_NAME                      = "CTIEvents"
      DOCUMENTDB_CONNECTION_STRING = "${var.documentdb_connection_string}/?tls=true&tlsCAFile=global-bundle.pem&authSource=admin&retryWrites=false"
      ETHEREUM_NODE_URL            = "https://9c11-79-46-52-108.ngrok-free.app"
      WALLET_PRIVATE_KEY           = "0x47733e072182f21edca0eaafa05d03566847e7af70dba0b67d79744bc41d3b4a"
    }
  }
}

resource "aws_iam_role_policy_attachment" "cti_poll_ender_lambda_policy_attachment" {
  role       = aws_iam_role.cti_poll_ender_lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "cti_poll_ender_events_scheduler_policy_attachment" {
  role       = aws_iam_role.cti_poll_ender_events_scheduler_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaRole"
}

resource "aws_cloudwatch_log_group" "cti_poll_ender_lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.cti_poll_ender_lambda.function_name}"
  retention_in_days = 1
}

resource "aws_scheduler_schedule" "cti_poll_ender_lambda_trigger" {
  name = "cti-poll-ender-lambda-trigger"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "rate(1 hours)"
  group_name          = "default"

  target {
    arn      = aws_lambda_function.cti_poll_ender_lambda.arn
    role_arn = aws_iam_role.cti_poll_ender_events_scheduler_iam_role.arn

    retry_policy {
      maximum_retry_attempts       = 0
      maximum_event_age_in_seconds = 60
    }
  }
}
