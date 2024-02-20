module "cti-backend-testenv-iac" {
  source               = "../../"
  region               = var.region
  document_db_username = var.document_db_username
  document_db_password = var.document_db_password
}