module "cti_vpc" {
  source = "./modules/cti_vpc"
  region = var.region
}

module "cti_apigatewayv2" {
  source = "./modules/cti_apigatewayv2"
}

module "cti_document_db" {
  source               = "./modules/cti_documentdb"
  document_db_username = var.document_db_username
  document_db_password = var.document_db_password
  subnet_ids_list      = module.cti_vpc.subnet_ids
  security_group_id    = module.cti_vpc.security_group_id
}

module "cti_msk" {
  source            = "./modules/cti_msk"
  subnet_ids_list   = module.cti_vpc.subnet_ids
  vpc_id            = module.cti_vpc.vpc_id
  region            = var.region
  security_group_id = module.cti_vpc.security_group_id
}

module "authentication_blockchain_lambda" {
  source                       = "./modules/authentication_blockchain_lambda"
  apigateway_id                = module.cti_apigatewayv2.apigateway_id
  documentdb_connection_string = module.cti_document_db.cti_document_db_connection_string
  apigateway_stage_name        = module.cti_apigatewayv2.apigateway_stage_name
  subnet_ids_list              = module.cti_vpc.subnet_ids
  security_group_id            = module.cti_vpc.security_group_id
  apigateway_execution_arn     = module.cti_apigatewayv2.apigateway_execution_arn
}

module "authentication_lambda" {
  source                   = "./modules/authentication_lambda"
  region                   = var.region
  apigateway_id            = module.cti_apigatewayv2.apigateway_id
  apigateway_api_endpoint  = module.cti_apigatewayv2.apigateway_api_endpoint
  apigateway_execution_arn = module.cti_apigatewayv2.apigateway_execution_arn
  apigateway_stage_name    = module.cti_apigatewayv2.apigateway_stage_name
  documentdb_connection_string = module.cti_document_db.cti_document_db_connection_string
  subnet_ids_list = module.cti_vpc.subnet_ids
  security_group_id = module.cti_vpc.security_group_id
}

module "cti_access_lambda" {
  source                       = "./modules/cti_access_lambda"
  apigateway_id                = module.cti_apigatewayv2.apigateway_id
  authorizer_id                = module.authentication_lambda.authorizer_id
  documentdb_connection_string = module.cti_document_db.cti_document_db_connection_string
  apigateway_stage_name        = module.cti_apigatewayv2.apigateway_stage_name
  subnet_ids_list              = module.cti_vpc.subnet_ids
  security_group_id            = module.cti_vpc.security_group_id
  apigateway_execution_arn     = module.cti_apigatewayv2.apigateway_execution_arn
  kafka_bootstrap_brokers      = module.cti_msk.bootstrap_brokers
}

module "authentication_state_machine" {
  source                  = "./modules/authentication_state_machine"
  apigateway_id           = module.cti_apigatewayv2.apigateway_id
  apigateway_role_arn     = module.cti_apigatewayv2.apigateway_role_arn
  apigateway_api_endpoint = module.cti_apigatewayv2.apigateway_api_endpoint
  region                  = var.region
  account_id              = data.aws_caller_identity.current.account_id
  apigateway_stage_name   = module.cti_apigatewayv2.apigateway_stage_name
}

module "cti_events_store_lambda" {
  source                       = "./modules/cti_events_store_lambda"
  apigateway_api_endpoint      = module.cti_apigatewayv2.apigateway_api_endpoint
  apigateway_execution_arn     = module.cti_apigatewayv2.apigateway_execution_arn
  apigateway_id                = module.cti_apigatewayv2.apigateway_id
  apigateway_stage_name        = module.cti_apigatewayv2.apigateway_stage_name
  documentdb_connection_string = module.cti_document_db.cti_document_db_connection_string
  subnet_ids_list              = module.cti_vpc.subnet_ids
  security_group_id            = module.cti_vpc.security_group_id
}

module "cti_poll_ender_lambda" {
  source = "./modules/cti_poll_ender_scheduled_lambda"
  documentdb_connection_string = module.cti_document_db.cti_document_db_connection_string
  subnet_ids_list              = module.cti_vpc.subnet_ids
  security_group_id            = module.cti_vpc.security_group_id
}

