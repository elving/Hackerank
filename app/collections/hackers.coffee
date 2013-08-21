module.exports = class HackerCollection extends Backbone.Collection
    initialize: ->
        @listenTo Backbone.Events, 'hacker:added', @add
