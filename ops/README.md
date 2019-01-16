# Deploy the app to AWS EC2 instance via ansible

Requirements:
- Ansible: v2.7.1 or greater
- SSH into the host and add your public key to ~/.ssh/authorized_hosts or add reference to key in `hosts`

Configure the launched host using `site.yaml` playbook:

```
ansible-playbook -i hosts site.yaml
```

The above installs and configures the following:

- build-essential (gcc and friends)
- Python 2
- Docker-ce
- Java (Oracle java 8)
- NodeJS (v10-LTS via nodesource)

TODO:

- [ ] Bootstrap AWS environment with VPC, Public/Private Subnets and Route Tables.
- [ ] EC2 AG for persistent spot instance request
- [ ] RDS
- [ ] Dynamo tables
- [ ] Elasticsearch
