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
Will provision the basic infrastructure AWS stack consisting of the following:
- Two AWS EC2 instances in the default VPC, one for the webapp, one for Jenkins
- Three security groups (ssh access, web access and 3306 tcp from ec2 to rds instance)
- RDS Mysql Instance

At this point the hosts file can be populated with the public dns name of the instances.

The following commands:
```
$ ansible-playbook site.yaml
$ ansible-playbook jenkins.yaml
```
Will do the following tasks:
- Install prerequisites for the EC2 instance to host the webapp
- Install prerequisites for Jenkins
- Install Jenkins

TODO:

- [x] Bootstrap AWS environment in Default VPC and create corresponding security groups.
- [x] Add two EC2 instances, one for the webapp and one for Jenkins to bootstrap playbook
- [x] Add RDS instance.
- [x] Add Tomcat, Java and Node installation steps to site.yaml(web-app)
- [x] Add prerequisites for Jenkins in jenkis.yml and install Jenkins on ec2 instance
