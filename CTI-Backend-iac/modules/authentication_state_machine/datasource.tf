data "aws_iam_policy_document" "state_machine_assume_role_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["states.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole",
    ]
  }
}

data "aws_iam_policy_document" "state_machine_role_policy" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogGroups",
      "cloudwatch:PutMetricData",
      "logs:CreateLogDelivery",
      "logs:GetLogDelivery",
      "logs:UpdateLogDelivery",
      "logs:DeleteLogDelivery",
      "logs:ListLogDeliveries",
      "logs:PutResourcePolicy",
      "logs:DescribeResourcePolicies",
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "execute-api:Invoke"
    ]

    resources = [
      "arn:aws:execute-api:${var.region}:${var.account_id}:${var.apigateway_id}/${var.apigateway_stage_name}/*/auth/*",
      "arn:aws:execute-api:${var.region}:${var.account_id}:${var.apigateway_id}/${var.apigateway_stage_name}/*/blockchain/*"
    ]
  }

}