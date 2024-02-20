resource "aws_vpc" "vpc" {
  cidr_block           = "192.168.0.0/22"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.vpc.id
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

}
resource "aws_route" "public_route_to_igw" {
  route_table_id         = aws_route_table.public_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.internet_gateway.id
}

resource "aws_route" "private_nat_gateway" {
  route_table_id         = aws_route_table.private_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat_gateway.id
}

resource "aws_route_table_association" "private_subnet_1_route_table_association" {
  subnet_id      = aws_subnet.subnet_private_az1.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_subnet_2_route_table_association" {
  subnet_id      = aws_subnet.subnet_private_az2.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "public_subnet_route_table_association" {
  subnet_id      = aws_subnet.subnet_public_az2.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_eip" "elastic_ip" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id     = aws_eip.elastic_ip.id
  subnet_id         = aws_subnet.subnet_public_az2.id
  connectivity_type = "public"
  depends_on        = [aws_internet_gateway.internet_gateway]
}

resource "aws_subnet" "subnet_private_az1" {
  availability_zone = "${var.region}a"
  cidr_block        = "192.168.0.0/24"
  vpc_id            = aws_vpc.vpc.id
}

resource "aws_subnet" "subnet_private_az2" {
  availability_zone = "${var.region}b"
  cidr_block        = "192.168.1.0/24"
  vpc_id            = aws_vpc.vpc.id
}

resource "aws_subnet" "subnet_public_az2" {
  availability_zone       = "${var.region}b"
  cidr_block              = "192.168.2.0/24"
  map_public_ip_on_launch = true
  vpc_id                  = aws_vpc.vpc.id
}

resource "aws_security_group" "security_group_1" {
  vpc_id = aws_vpc.vpc.id
}

resource "aws_security_group_rule" "all_from_self_ingress" {
  from_port         = 0
  protocol          = "-1"
  security_group_id = aws_security_group.security_group_1.id
  to_port           = 0
  self              = true
  type              = "ingress"
}

resource "aws_security_group_rule" "all_from_self_egress" {
  from_port         = 0
  protocol          = "-1"
  security_group_id = aws_security_group.security_group_1.id
  to_port           = 0
  self              = true
  type              = "egress"
}

resource "aws_security_group_rule" "all_from_egress" {
  from_port         = 0
  protocol          = "-1"
  security_group_id = aws_security_group.security_group_1.id
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
  type              = "egress"
}