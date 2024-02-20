resource "aws_iam_role" "cti_apigateway_iam_role" {
  name               = "cti-apigateway-iam-role"
  assume_role_policy = data.aws_iam_policy_document.authentication-lambda-assume-role.json
}

resource "aws_apigatewayv2_api" "CTI_apigateway" {
  name          = "CTI-apigateway-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT"]
    allow_headers = ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
  }
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.CTI_apigateway.id
  name        = "default"
  auto_deploy = true
}

resource "aws_iam_role_policy_attachment" "authentication_lambda_policy_attachment" {
  role       = aws_iam_role.cti_apigateway_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSStepFunctionsFullAccess"
}