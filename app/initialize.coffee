# App Namespace
@Hackerank ?= {}
Hackerank.Routers ?= {}
Hackerank.Views ?= {}
Hackerank.Models ?= {}
Hackerank.Collections ?= {}

# Load App Helpers
require 'lib/app_helpers'

$ ->
    AppView = require 'views/app'

    # Initialize App
    Hackerank.Views.App = new AppView()
