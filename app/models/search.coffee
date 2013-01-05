module.exports = class SearchModel extends Backbone.Model
    defaults:
        query: ''

    validate: (attrs) ->
        return 'Query can\'t be empty' unless attrs.query

    initialize: ->
        @on 'change:query', @search

    search: ->
        url = "https://api.github.com/legacy/repos/search/"

        $.getJSON("#{url}#{@get('query')}?callback=?").done (response) =>
            repos = response.data.repositories
            repos = _.sortBy repos, (repo) -> -repo.watchers
            @searchHackers repos.slice 0, 3

    searchHackers: (repos) ->
        place = 1
        find  = ->
            repo = repos.shift()
            url  = "https://api.github.com/users/#{repo.owner}?callback=?"

            $.getJSON(url).done (hacker) =>
                hacker = hacker.data

                _.extend hacker, {
                    place: place
                    repoUrl: repo.url
                    repoName: repo.name
                    repoLanguage: repo.language
                    repoFollowers: repo.followers
                }

                Backbone.Events.trigger 'hacker:added', hacker
                place += 1
                find() if repos.length > 0

        find()
