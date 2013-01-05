View = require 'lib/view'

module.exports = class HackerView extends View
    tagName: 'li'

    className: 'hacker clearfix'

    template: require 'views/templates/hacker'

    getRenderData: ->
        @model.toJSON()
