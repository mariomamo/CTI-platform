variable "documentdb_connection_string" {
  type        = string
  description = "Document db connection string"
}

variable "subnet_ids_list" {
  type        = list(string)
  description = "AWS VPC subnet ids"
}

variable "security_group_id" {
  type    = string
  default = "Security group id"
}
