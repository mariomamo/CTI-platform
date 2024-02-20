output "authorizer_id" {
  value = aws_apigatewayv2_authorizer.authentication_lambda_authorizer.id
}

output "authentication_lambda_arn" {
  value = aws_lambda_function.authentication_lambda.arn
}