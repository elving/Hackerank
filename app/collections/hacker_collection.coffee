module.exports = class HackerCollection extends Backbone.Collection
    initialize: ->
        Backbone.Mediator.subscribe 'hacker:added', (hacker) => @add hacker
