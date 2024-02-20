data "archive_file" "cti_poll_ender_lambda_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/code"
  output_path = "cti-poll-ender-lambda-archive.zip"
}

data "archive_file" "cti_poll_ender_lambda_dependencies_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/dependencies"
  output_path = "cti-poll-ender-lambda-dependencies-archive.zip"
}

data "archive_file" "cti_poll_ender_lambda_abi_archive" {
  type        = "zip"
  source_dir  = "${path.module}/src/contracts"
  output_path = "cti-poll-ender-lambda-abi-archive.zip"
}

data "aws_iam_policy_document" "cti_poll_ender_lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "cti_poll_ender_events_scheduler_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}