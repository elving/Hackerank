# App Namespace
@Hackerank ?= {}
Hackerank.Routers ?= {}
Hackerank.Views ?= {}
Hackerank.Models ?= {}
Hackerank.Collections ?= {}

$ ->
    # Initialize App
    Hackerank.Views.AppView = new AppView = require 'views/app_view'
