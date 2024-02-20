data "archive_file" "cti_access_lambda_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/code/"
  output_path = "cti-access-lambda-archive.zip"
}

data "archive_file" "access_lambda_dependencies_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/dependencies"
  output_path = "access-lambda-dependencies-archive.zip"
}

data "archive_file" "access_lambda_abi_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/contracts"
  output_path = "access-lambda-abi-archive.zip"
}

data "aws_iam_policy_document" "cti_access_lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}