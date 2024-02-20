resource "aws_docdb_subnet_group" "cti_document_db_subnet_group" {
  name       = "cti_document_db_subnet_group"
  subnet_ids = var.subnet_ids_list
}

resource "aws_docdb_cluster" "cti_document_db_cluster" {
  cluster_identifier      = "cti-document-db-cluster"
  engine                  = "docdb"
  master_username         = var.document_db_username
  master_password         = var.document_db_password
  backup_retention_period = 1
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_docdb_subnet_group.cti_document_db_subnet_group.name
  vpc_security_group_ids  = [var.security_group_id]
}

resource "aws_docdb_cluster_instance" "cti_document_db_cluster_instances" {
  count              = 1
  identifier         = "cti-document-db-cluster-${count.index}"
  cluster_identifier = aws_docdb_cluster.cti_document_db_cluster.id
  instance_class     = "db.t3.medium"
}


