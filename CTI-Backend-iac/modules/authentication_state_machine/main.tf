resource "aws_iam_role" "authentication_blockchain_state_machine_role" {
  name               = "authentication-blockchain-state-machine-role"
  assume_role_policy = data.aws_iam_policy_document.state_machine_assume_role_policy.json
}

resource "aws_iam_role_policy" "authentication_blockchain_state_machine_policy" {
  role   = aws_iam_role.authentication_blockchain_state_machine_role.id
  policy = data.aws_iam_policy_document.state_machine_role_policy.json
}

resource "aws_sfn_state_machine" "authentication_blockchain_state_machine" {
  name       = "authentication-blockchain-state-machine"
  role_arn   = aws_iam_role.authentication_blockchain_state_machine_role.arn
  type       = "EXPRESS"
  publish    = true
  definition = templatefile("${path.module}/step_function_config.asl.json", {
    Region = var.region
    Api-id = var.apigateway_id
  })

  logging_configuration {
    include_execution_data = true
    level                  = "ALL"
    log_destination        = "${aws_cloudwatch_log_group.authentication_blockchain_state_machine_log_group.arn}:*"
  }
}

resource "aws_cloudwatch_log_group" "authentication_blockchain_state_machine_log_group" {
  name_prefix       = "/aws/vendedlogs/states/authentication-blockchain-state-machine"
  retention_in_days = 1
}

resource "aws_apigatewayv2_integration" "authentication_blockchain_state_machine_integration" {
  api_id                 = var.apigateway_id
  description            = "Integration for authentication blockchain state machine invocation"
  integration_type       = "AWS_PROXY"
  integration_subtype    = "StepFunctions-StartSyncExecution"
  payload_format_version = "1.0"
  credentials_arn        = var.apigateway_role_arn

  request_parameters = {
    StateMachineArn = aws_sfn_state_machine.authentication_blockchain_state_machine.arn
    Input           = "$request.body"
  }
}

resource "aws_apigatewayv2_route" "authentication_lambda_configuration_route" {
  api_id    = var.apigateway_id
  route_key = "POST /blockchain/login"
  target    = "integrations/${aws_apigatewayv2_integration.authentication_blockchain_state_machine_integration.id}"
}