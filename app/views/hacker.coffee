module.exports = class HackerView extends Backbone.View
    tagName: 'li'

    className: 'hacker clearfix'

    template: require 'views/templates/hacker'

    render: ->
        @$el.html @template @model.toJSON()
        this
