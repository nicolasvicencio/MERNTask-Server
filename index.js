const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')


//Create server
const app = express()
//Connect DB
connectDB()

//Enable cors

app.use(cors())

//Enable express.json
app.use(express.json({extended: true}))


//App port .
const port = process.env.PORT || 4000

//import routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));


app.listen(port, '0.0.0.0', () => {
	console.log('its working on port : ' +  port)
})