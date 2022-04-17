const express = require('express')
const path = require('path')
const http = require('http')
const serveStatic = require("serve-static")
const { parse } = require('path')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/static',serveStatic(path.join(__dirname, 'static')))

const server = http.createServer(app)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "static/views/login.html"))
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})