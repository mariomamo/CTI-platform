variable "documentdb_connection_string" {
  type        = string
  description = "Document db connection string"
}

variable "apigateway_stage_name" {
  type        = string
  description = "Apigateway stage name"
}

variable "apigateway_id" {
  type        = string
  description = "Apigateway resource id"
}

variable "subnet_ids_list" {
  type        = list(string)
  description = "AWS VPC subnet ids"
}

variable "security_group_id" {
  type    = string
  default = "Security group id"
}

variable "apigateway_execution_arn" {
  type        = string
  description = "Apigateway execution arn"
}

