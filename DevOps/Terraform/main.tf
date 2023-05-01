# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }

  required_version = ">= 1.1.0"
}

variable "appName" {
  type = string
}


provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.appName
  location = "eastus"
}

# resource "azurerm_container_registry" "cr" {
#   name                     = var.appName
#   location                 = azurerm_resource_group.rg.location
#   resource_group_name      = azurerm_resource_group.rg.name
#   sku                      = "Basic"
#   admin_enabled            = true
#   georeplication_locations = ["eastus"]
# }
# resource "azurerm_container_registry_task" "crgt" {
#   name                     = var.appName
#   container_registry_id = azurerm_container_registry.cr.id
#   platform {
#     os = "Linux"
#   }
#   docker_step {
#     dockerfile_path      = "../Dockerfile"
#     context_path         = "./"
#     image_names          = ["${var.appName}:{{.Run.ID}}"]
#   }
# }

resource "azurerm_service_plan" "sp" {
  name                = var.appName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}
resource "azurerm_linux_web_app" "wa" {
  name                = var.appName
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.sp.id
  https_only          = true

  # app_settings = {
  #   "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
  # }

  site_config {
    minimum_tls_version = "1.2"
    # application_stack {
    #   docker_image     = "jackofallops/azure-containerapps-python-acctest"
    #   docker_image_tag = "v0.0.1"
    # }
  }
}
# #  Deploy code from a public GitHub repo
# resource "azurerm_app_service_source_control" "sourcecontrol" {
#   app_id                  = azurerm_linux_web_app.wa.id
#   repo_url                = "https://github.com/Azure-Samples/nodejs-docs-hello-world"
#   branch                  = "main"
#   use_manual_integration  = true
#   use_mercurial           = false
# }
