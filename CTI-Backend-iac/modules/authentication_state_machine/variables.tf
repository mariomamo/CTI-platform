variable "apigateway_id" {
  type        = string
  description = "Apigateway resource id"
}

variable "apigateway_role_arn" {
  type        = string
  description = "Apigateway role arn"
}

variable "apigateway_api_endpoint" {
  type        = string
  description = "Apigateway api endpoint"
}

variable "region" {
  type        = string
  description = "AWS Region"
}

variable "account_id" {
  type        = number
  description = "AWS account id"
}

variable "apigateway_stage_name" {
  type        = string
  description = "Apigateway stage name"
}
