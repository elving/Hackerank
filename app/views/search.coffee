View  = require 'lib/view'
Model = require 'models/search'

module.exports = class SearchView extends View
    el: 'section.search'

    events:
        'click a.search-button': 'search'
        'keyup input.search-input': (event) -> @search() if event.keyCode is 13

    initialize: ->
        @model = Hackerank.Models.Search = new Model()

    search: (event) ->
        event.preventDefault() if event?
        Backbone.Events.trigger 'search:new'
        @model.set query: $.trim @$el.find('input.search-input').val()



