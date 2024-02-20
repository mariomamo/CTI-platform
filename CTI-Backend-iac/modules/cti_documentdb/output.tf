output "cti_document_db_connection_string" {
  value = "mongodb://${var.document_db_username}:${var.document_db_password}@${aws_docdb_cluster.cti_document_db_cluster.endpoint}:${aws_docdb_cluster.cti_document_db_cluster.port}"
}