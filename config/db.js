const mongoose  =  require('mongoose')
require('dotenv').config({path:'variables.env'})

const connectDB = async () => {
	try {
	await mongoose.connect(process.env.DB_MONGO, {
		useNewUrlParser: true, 
		useUnifiedTopology: true
	});

	console.log('db its working')
		
	} catch (err) {
		console.log(err);
		console.log('its not connected')
		// process.exit(1) //Stop app
	}
}

module.exports = connectDB