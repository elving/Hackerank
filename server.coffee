express = require 'express'
app = express.createServer()
app.configure -> app.use express.static "#{__dirname}/public"
app.get '/', (req, res) -> res.sendfile 'index.html'
port = process.env.PORT or 3000
app.listen port, -> console.log "Listening on port #{port}"
