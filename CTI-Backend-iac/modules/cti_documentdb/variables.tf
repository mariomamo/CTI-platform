variable "document_db_username" {
  type        = string
  description = "Document db username"
}

variable "document_db_password" {
  type        = string
  description = "Document db password"
}

variable "subnet_ids_list" {
  type        = list(string)
  description = "AWS VPC subnet ids"
}

variable "security_group_id" {
  type    = string
  default = "Security group id"
}
