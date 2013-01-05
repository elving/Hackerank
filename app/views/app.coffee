View        = require 'lib/view'
SearchView  = require 'views/search'
HackersView = require 'views/hackers'

module.exports = class AppView extends View
    el: 'body.application'

    initialize: ->
        Hackerank.Views.Search  = new SearchView()
        Hackerank.Views.Hackers = new HackersView()

