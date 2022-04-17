const mysql = require('mysql')
const express = require('express')
const session = require('express-session')
const path = require('path')
const http = require('http')
const serveStatic = require("serve-static")
const { parse } = require('path')
const app = express()
const port = 3000

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/static',serveStatic(path.join(__dirname, 'static')))

const server = http.createServer(app)

// const connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '',
// 	database : 'nodelogin'
// })

app.get('/', (request, response) => {
    if (request.session.loggedin) {
		response.redirect('/rsvp')
	} else {
		response.redirect('/login')
	}
})

app.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname, "static/views/login.html"))
})

app.post('/login', function(request, response) {
    let fname = request.body.fname
    let lname = request.body.lname
    let code = request.body.code

    if (fname === "Russell" && lname === "Leininger" && code === "1212") {
        request.session.loggedin = true
        request.session.userId = 1234
        response.redirect('/rsvp')
    } else {
        response.redirect('/')
    }
	// // Capture the input fields
	// let username = request.body.username
	// let password = request.body.password
	// Ensure the input fields exists and are not empty
	// if (username && password) {
	// 	// Execute SQL query that'll select the account from the database based on the specified username and password
	// 	connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
	// 		// If there is an issue with the query, output the error
	// 		if (error) throw error
	// 		// If the account exists
	// 		if (results.length > 0) {
	// 			// Authenticate the user
	// 			request.session.loggedin = true
	// 			request.session.username = username
	// 			// Redirect to home page
	// 			response.redirect('/home')
	// 		} else {
	// 			response.send('Incorrect Username and/or Password!')
	// 		}			
	// 		response.end()
	// 	})
	// } else {
	// 	response.send('Please enter Username and Password!')
	// 	response.end()
	// }
})

app.get('/rsvp', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname, "static/views/rsvp.html"))
	} else {
		// Not logged in
		response.redirect('/')
	}
})

app.post('/logout', function(request, response) {
    request.session.loggedin = false
        request.session.userId = ''
        response.redirect('/login')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})