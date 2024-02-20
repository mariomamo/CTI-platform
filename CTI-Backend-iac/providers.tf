terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.region

  assume_role {
    role_arn = "arn:aws:iam::309894455681:role/CTI-AWS-Lambda-Managing"
  }
}