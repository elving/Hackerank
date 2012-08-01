module.exports = class SearchView extends Backbone.View
    el: 'section.search'

    events:
        'click a.search-button': 'search'
        'keyup input.search-input': (event) -> @search() if event.keyCode is 13

    initialize: ->
        @model = Hackerank.Models.SearchModel = new SearchModel = require '../models/search_model'

    search: (event) ->
        event.preventDefault() if event?
        Backbone.Mediator.publish 'search:new'
        @model.set query: $.trim @$el.find('input.search-input').val()

