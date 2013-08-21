HackerView = require 'views/hacker'

describe 'HackerView', ->
    beforeEach ->
        @view = new HackerView()

    it 'should exist', ->
        expect(@view).to.be.ok
