variable "region" {
  type        = string
  description = "AWS Region"
  default     = "eu-central-1"
}
variable "document_db_username" {
  type        = string
  description = "Document db username"
  default     = "username"
}

variable "document_db_password" {
  type        = string
  description = "Document db password"
  default     = "password"
}