terraform {
  required_providers {
    virtualbox = {
      source  = "terra-farm/virtualbox"
      version = "0.2.2"
    }
  }
}

provider "virtualbox" {}

resource "virtualbox_vm" "ubuntu" {
  name   = "devops-vm"
  image  = "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.vdi"
  cpus   = 2
  memory = "2048 mib"

  network_adapter {
    type           = "nat"
    host_interface = "vboxnet0"
  }
}
