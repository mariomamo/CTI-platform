data "archive_file" "authentication_lambda_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/code"
  output_path = "authentication-lambda-archive.zip"
}

data "archive_file" "authentication_lambda_dependencies_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/dependencies"
  output_path = "authentication-lambda-dependencies-archive.zip"
}

data "archive_file" "authentication_lambda_keys_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/lambda_keys"
  output_path = "authentication-lambda-keys-archive.zip"
}

data "aws_iam_policy_document" "authentication-lambda-assume-role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}