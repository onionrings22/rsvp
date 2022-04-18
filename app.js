const mysql = require('mysql')
const express = require('express')
const session = require('express-session')
const path = require('path')
const http = require('http')
const serveStatic = require("serve-static")
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

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'rsvp'
})

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
    // parse request body
    let fname = request.body.fname
    let lname = request.body.lname
    let code = request.body.code

	// Ensure the input fields exists and are not empty
	if (fname && lname && code) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM user WHERE fname = ? AND lname = ? AND login_code = ?', [fname, lname, code], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true
				request.session.userId = results[0].id
				// Redirect to rsvp page
				response.redirect('/rsvp')
			} else {
				response.redirect('/')
			}			
		})
	} else {
		response.redirect('/')
	}
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

app.get('/details', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
        connection.query('select entree, modifications from user where id = ?',
        [request.session.userId], function(error, results, fields) {
            // If there is an issue with the query, output the error
			if (error) throw error
            if (results.length > 0) {
                response.send(results[0])
            } else {
                return {entree: '', modifications: ''}
            }
            
        })
	} else {
		// Not logged in
		response.redirect('/')
	}
})

app.post('/rsvp', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
        connection.query('update user set entree = ?, modifications = ? where id = ?',
        [request.body.entree, request.body.modifications, request.session.userId], function(error, results, fields) {
            // If there is an issue with the query, output the error
			if (error) {
                console.log("rsvp sql error: ", error)
                response.sendStatus(500)
            }
            response.sendStatus(200)
        })
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
  console.log(`RSVP app listening on port ${port}`)
})