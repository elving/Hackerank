SearchView = require 'views/search'

describe 'SearchView', ->
    beforeEach ->
        @view = new SearchView()

    it 'should exist', ->
        expect(@view).to.be.ok
