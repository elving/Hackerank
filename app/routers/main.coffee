class AppRouter extends Backbone.Router
    routes:
        '': 'index'

    index: ->
        App = require 'views/app'
        @AppView = new App()

AppRouter = new AppRouter()
module.exports =  AppRouter
