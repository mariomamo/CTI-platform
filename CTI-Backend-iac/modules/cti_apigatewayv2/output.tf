output "apigateway_id" {
  value = aws_apigatewayv2_api.CTI_apigateway.id
}

output "apigateway_api_endpoint" {
  value = aws_apigatewayv2_api.CTI_apigateway.api_endpoint
}

output "apigateway_execution_arn" {
  value = aws_apigatewayv2_api.CTI_apigateway.execution_arn
}

output "apigateway_stage_name" {
  value = aws_apigatewayv2_stage.default_stage.name
}

output "apigateway_role_arn" {
  value = aws_iam_role.cti_apigateway_iam_role.arn
}