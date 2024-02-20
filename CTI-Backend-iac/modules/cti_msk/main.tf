resource "aws_kms_key" "msk_kms_key" {
  description = "msk-kms-key"
}

resource "aws_msk_configuration" "msk_cluster_configuration" {
  kafka_versions = ["3.2.0"]
  name           = "msk-cluster-configuration"

  server_properties = <<PROPERTIES
    auto.create.topics.enable=true
    default.replication.factor=1
    min.insync.replicas=2
    num.io.threads=8
    num.network.threads=5
    num.partitions=1
    num.replica.fetchers=2
    replica.lag.time.max.ms=30000
    socket.receive.buffer.bytes=102400
    socket.request.max.bytes=104857600
    socket.send.buffer.bytes=102400
    unclean.leader.election.enable=true
    zookeeper.session.timeout.ms=18000
PROPERTIES
}

resource "aws_msk_cluster" "msk_cluster" {
  cluster_name           = "mskCluster"
  kafka_version          = "3.2.0"
  number_of_broker_nodes = 2

  configuration_info {
    arn      = aws_msk_configuration.msk_cluster_configuration.arn
    revision = aws_msk_configuration.msk_cluster_configuration.latest_revision
  }

  broker_node_group_info {
    instance_type  = "kafka.t3.small"
    client_subnets = var.subnet_ids_list
    storage_info {
      ebs_storage_info {
        volume_size = 1000
      }
    }
    security_groups = [var.security_group_id]

  }

  encryption_info {
    encryption_at_rest_kms_key_arn = aws_kms_key.msk_kms_key.arn
    encryption_in_transit {
      client_broker = "PLAINTEXT"
      in_cluster    = true
    }
  }
}
