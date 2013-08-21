module.exports = class HackersView extends Backbone.View
    el: 'section.hackers'

    initialize: ->
        Hackers = require 'collections/hackers'
        @collection = new Hackers()

        @listenTo @collection, 'add', @addHacker
        @listenTo Backbone.Events, 'search:new', @cleanResults

    cleanResults: ->
        @collection.reset()
        @$el.find('ol.hackers-list')
            .empty()
            .attr 'data-state', 'loading'

    addHacker: (hacker) ->
        Hacker = require 'views/hacker'
        HackerView = new Hacker model: hacker

        @$el.find('ol.hackers-list')
            .attr('data-state', 'default')
            .append HackerView.render().el

