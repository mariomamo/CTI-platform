output "subnet_ids" {
  value = [aws_subnet.subnet_private_az1.id, aws_subnet.subnet_private_az2.id]
}

output "security_group_id" {
  value = aws_security_group.security_group_1.id
}

output "vpc_id" {
  value = aws_vpc.vpc.id
}