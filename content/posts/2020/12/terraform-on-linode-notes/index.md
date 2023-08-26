---
title: "Terraform on Linode Notes"
date: 2020-12-23T05:54:53-05:00
description: Over vacation I worked through a small project to use Terraform on Linode to provision a new webserver for my personal website. The following is a collection of notes and resources from the experience.
---

{{< vimeo 494148145 >}}

Over vacation I worked through a small project to use [Terraform](https://www.terraform.io/) on [Linode](https://www.linode.com/) to provision a new webserver for my personal website. The following is a collection of notes and resources from the experience. 

### Project Goals / Areas of Improvement:

* Since the addition of the `guildflow.com` static website, anyone who was attempting to load a HTTPS version of `mikezornek.com` would be met with a security warning as the browser was attempting to load the SSL cert for `guildflow.com` when serving up `mikezornek.com`.
* The lack of SSL to `mikezornek.com` has historically [been intentional](http://this.how/googleAndHttp/).
* The Linode serving my static sites uses Ubuntu 16.04 LTS, which is going to be [EOL on April 30, 2021](https://ubuntu.com/about/release-cycle) and so it'd be good to get one a new LTS version.
* This is a good excuse to experiment with [Terraform](https://www.terraform.io/), which is something I've been learning in support of some possible Guildflow infrastructure updates.

### Quick Review of the MikeZornek.com Infrastructure and Deployment 

* MikeZornek is a static site. I like static sites as they are cheaper to serve and easier to keep secure. I have used WordPress in the distant pass but I was lazy at keeping it updated and eventually it was hacked.
* [Hugo](https://gohugo.io/) is used to help build the static site.
* The [git repo is public](https://github.com/zorn/mikezornek.com) and hosted on GitHub.
* I've [setup CircleCI](https://github.com/zorn/mikezornek.com/blob/master/.circleci/config.yml) to detect changes on the repo's `master` branch and deploy any changes.
* The deploy is pretty basic but there are a few HTML/link checks.
* Once generated, the static files are copied to my Linode using `rsync`.
* The historic Linode was hand crafted and used Apache as it's web server.

### Learning Terraform Resources

* [Linode-specific tutorials](https://www.linode.com/docs/guides/applications/configuration-management/terraform/)
* Learn the Linode [regions](https://api.linode.com/v4/regions) or [instance types](https://api.linode.com/v4/linode/types) through it's API.
* [The Terraform Book](https://terraformbook.com/)
* [Linode Terraform provider docs.](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/instance)
* [Linode Community Questions: how to debug stack scripts](https://www.linode.com/community/questions/11369/how-to-debug-stack-scripts)
* [Certbot for Ubuntu / ngnix prefers snap now.](https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx)
* [Managing multiple SSH keys.](https://clubmate.fi/how-to-setup-and-manage-multiple-ssh-keys)

### My Terraform Script

```tf
provider "linode" {
  # API Token
  token = "abc123"
}

resource "linode_sshkey" "mikezornek_linode_ssh_key" {
  label = "mikezornek_linode_ssh_key"
  ssh_key = chomp(file("~/.ssh/id_rsa_linode_mikezornek.pub"))
}

resource "linode_stackscript" "setup_mikezornek_prod" {
  label = "setup_mikezornek_prod"
  description = "setups nginx and certbot for mikezornek"
  script = file("files/setup.sh")
  images = ["linode/ubuntu20.04"]
  is_public = false
}

resource "linode_instance" "mikezornek_prod" {
  image = "linode/ubuntu20.04"
  label = "mikezornek_prod"
  group = "mikezornek"
  region = "us-east"
  type = "g6-nanode-1"
  authorized_keys = [linode_sshkey.mikezornek_linode_ssh_key.ssh_key]
  # Leave the root password unset if want to keep it random
  root_pass = "abc123"
  backups_enabled = true
  stackscript_id = linode_stackscript.setup_mikezornek_prod.id
}

output "server_ip" {
  value = linode_instance.mikezornek_prod.ip_address
}
```

The `output` is useful if you want to ssh into your new linode instance right away with:

    $ ssh root@(terraform output server_ip)

### My setup bash script

```bash
#!/bin/bash

# strict mode
set -xeo pipefail

exec > >(tee -i /var/log/stackscript.log)

FQDN=mikezornek.com

echo Setting hostname to ${FQDN}
hostnamectl set-hostname ${FQDN}

echo Running apt-get update and upgrade
apt update && apt upgrade -y

echo Installing nginx
apt install -y nginx

echo Prep snap
snap install core; snap refresh core

echo Install certbot
snap install --classic certbot

# echo Setup certbot for nginx for the domain ${FQDN}
# we will do this manually after setup since the 
# domain should be pointing at this machine at the time of setup
# certbot --nginx --agree-tos -m zorn@zornlabs.com --verbose -d mikezornek.com

echo Starting nginx
sudo service nginx start

echo ALL DONE!
```

Observe the log file on your new server with:

    $ tail -f /var/log/stackscript.log
