variable "region" {
  type        = string
  description = "AWS Region"
}

variable "subnet_ids_list" {
  type        = list(string)
  description = "AWS VPC subnet ids"
}

variable "vpc_id" {
  type        = string
  description = "VPC id"
}

variable "security_group_id" {
  type    = string
  default = "Security group id"
}