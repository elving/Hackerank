module.exports = class HackersView extends Backbone.View
    el: 'section.hackers'

    subscriptions:
        'search:new': 'cleanResults'

    initialize: ->
        @collection = Hackerank.Collections.HackerCollection = new HackerCollection = require '../collections/hacker_collection'
        @collection.on 'add', @addHacker, @

    cleanResults: ->
        @collection.reset()
        @$el.find('ol.hackers-list').empty().attr 'data-state', 'loading'

    addHacker: (hacker) ->
        @$el.find('ol.hackers-list').attr 'data-state', 'default'
        view = require './hacker_view'
        HackerView = new view model: hacker
        @$el.find('ol.hackers-list').append HackerView.render().el

