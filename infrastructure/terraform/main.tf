terraform {
  required_providers {
    twc = {
      source = "tf.timeweb.cloud/timeweb-cloud/timeweb-cloud"
    }
  }
  required_version = ">= 0.13"
}

# токен можно задать через переменную окружения TWC_TOKEN или в провайдере
provider "twc" {
   token = ""
}

data "twc_configurator" "this" {
  location    = "ru-1"
  preset_type = "standard"
}

data "twc_os" "ubuntu" {
  family  = "linux"
  name    = "ubuntu"
  version = "22.04"
}

resource "twc_ssh_key" "my_key" {
  name      = "my-ssh-key"
  body = file("C:\\Users\\Jenya\\.ssh\\id_rsa.pub")
}

resource "twc_server" "my_server" {
  name       = "devops-server"
  os_id      = data.twc_os.ubuntu.id
  ssh_keys_ids = [twc_ssh_key.my_key.id]

  configuration {
    configurator_id = data.twc_configurator.this.id
    cpu             = 2
    ram             = 2048
    disk            = 1024 * 25
  }
  
}

resource "twc_server_ip" "my_server" {
  source_server_id = twc_server.my_server.id

  type = "ipv4"
}

output "server_ip" {
  description = "Публичный IP-адрес сервера"
  value       = twc_server_ip.my_server.ip
}

# Пароль от сервера должен прийти на почту