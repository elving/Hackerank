HackersView = require 'views/hackers'

describe 'HackersView', ->
    beforeEach ->
        @view = new HackersView()

    it 'should exist', ->
        expect(@view).to.be.ok
