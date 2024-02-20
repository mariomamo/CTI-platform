data "archive_file" "cti_events_store_lambda_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/code"
  output_path = "cti-events-store-lambda-archive.zip"
}

data "archive_file" "cti_events_store_lambda_dependencies_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/dependencies"
  output_path = "cti-events-store-lambda-dependencies-archive.zip"
}

data "aws_iam_policy_document" "cti_events_store_lambda-assume-role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}