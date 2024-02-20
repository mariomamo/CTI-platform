data "archive_file" "authentication_lambda_dependencies_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/dependencies"
  output_path = "authentication-blockchain-lambda-dependencies-archive.zip"
}

data "archive_file" "authentication_blockchain_lambda_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/code"
  output_path = "authentication-blockchain-lambda-archive.zip"
}

data "archive_file" "authentication_blockchain_lambda_abi_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/contracts"
  output_path = "authentication-blockchain-lambda-abi-archive.zip"
}

data "aws_iam_policy_document" "authentication-blockchain-lambda-assume-role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}