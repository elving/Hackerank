module.exports = class SearchModel extends Backbone.Model
    defaults:
        query: ''

    validate: (attrs) ->
        return 'Query can\'t be empty' unless attrs.query

    initialize: ->
        @on 'change:query', @search

    search: ->
        $.getJSON("https://api.github.com/legacy/repos/search/#{@get('query')}").done (response) =>
            repos = _.sortBy response.repositories, (repo) -> -repo.watchers
            @searchHackers repos.slice 0, 3

    searchHackers: (repos) ->
        place = 1
        findHacker = ->
            repo = repos.shift()
            $.getJSON("https://api.github.com/users/#{repo.owner}").done (hacker) =>
                _.extend hacker, { repoName: repo.name, repoLanguage: repo.language, repoFollowers: repo.followers, repoUrl: repo.url, place: place }
                Backbone.Mediator.publish 'hacker:added', hacker
                place += 1
                findHacker() if repos.length > 0

        findHacker()
