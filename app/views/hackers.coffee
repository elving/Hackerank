View       = require 'lib/view'
Collection = require 'collections/hackers'
HackerView = require 'views/hacker'

module.exports = class HackersView extends View
    el: 'section.hackers'

    initialize: ->
        @collection = Hackerank.Collections.Hackers = new Collection()
        @collection.on 'add', @addHacker, @

        Backbone.Events.on 'search:new', @cleanResults, @

    cleanResults: ->
        @collection.reset()
        @$el.find('ol.hackers-list').empty().attr 'data-state', 'loading'

    addHacker: (hacker) ->
        view = new HackerView model: hacker
        @$el.find('ol.hackers-list')
        .attr('data-state', 'default')
        .append(view.render().el)

