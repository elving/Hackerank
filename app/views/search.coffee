module.exports = class SearchView extends Backbone.View
    el: 'section.search'

    events:
        'click a.search-button': 'search'
        'keyup input.search-input': (e) ->
            @search() if e.keyCode is 13

    initialize: ->
        Search = require 'models/search'
        @model = new Search()

    search: (e) ->
        e?.preventDefault()
        Backbone.Events.trigger 'search:new'
        @model.set query: $.trim @$el.find('input.search-input').val()



