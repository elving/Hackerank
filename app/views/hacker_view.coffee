module.exports = class HackerView extends Backbone.View
    tagName: 'li'

    className: 'hacker clearfix'

    template: require './templates/hacker'

    getRenderData: ->
        @model.toJSON()
