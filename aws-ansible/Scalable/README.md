# Deploy AWS infrastructure using Ansible.

This infrastructure will host the jhipster java/javascript web application. The packaged application will
then be deployed to the stack using a Jenkins pipeline.

## Requirements for the Ansible host executing the playbooks:

1. Install Ansible v2.7.1 or greater:
```
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo apt-add-repository ppa:ansible/ansible
```	
Press ENTER to accept the PPA addition.
Next, refresh your system's package index once again so that it is aware of the packages available in the PPA:
```
$ sudo apt update
$ sudo apt install ansible
```
2. Install PIP
```
$ sudo apt-get install python-pip python-dev build-essential		
$ sudo pip install --upgrade pip 
```
3. Install boto3
```
$ sudo pip install boto3
```

## Provision AWS Stack

The following command:
```
$ ansible-playbook bootstrap.yaml
```
Will provision an AWS stack consisting of the following:
- An AWS EC2 instance in the default VPC
- Three security groups (ssh access, web access and 3306 tcp from ec2 to rds instance)
- An Elastic Load Balancer
- An Auto Scaling Group

TODO:

- [ ] Bootstrap AWS environment in Default VPC and create corresponding security groups.
- [x] Add EC2 instance(with python minimal) and RDS steps to bootstrap playbook
- [x] Add Tomcat, Java and Node installation steps to site.yaml
- [ ] Add an Elastic Load Balancer
- [ ] Add Auto-Scaling group