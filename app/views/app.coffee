module.exports = class AppView extends Backbone.View
    el: 'body.application'

    initialize: ->
        Search = require 'views/search'
        @SearchView = new Search()

        Hackers = require 'views/hackers'
        @HackersView = new Hackers()

