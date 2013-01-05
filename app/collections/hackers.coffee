module.exports = class HackerCollection extends Backbone.Collection
    initialize: ->
        Backbone.Events.on 'hacker:added', (hacker) => @add hacker
