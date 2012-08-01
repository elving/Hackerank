module.exports = class AppView extends Backbone.View
    el: 'body.application'

    initialize: ->
        require '../lib/app_helpers'
        Hackerank.Routers.AppRouter = new AppRouter = require '../routers/app_router'
        Hackerank.Views.SearchView = new SearchView = require './search_view'
        Hackerank.Views.HackersView = new HackersView = require './hackers_view'

