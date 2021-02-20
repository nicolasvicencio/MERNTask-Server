const User = require("../models/User");
const bcrypjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

exports.createUser = async (req, res) => {

	//check for errors
	const errors = validationResult(req)
	if(!errors.isEmpty()){
return res.status(400).json({errors : errors.array()})
	}

	//Get email and password
	const { email, password } = req.body


	try {

		let user = await User.findOne({ email })

		if (user) {
			return res.status(400).json({ msg: 'User already exist' })
		}

		//Create new user
		user = new User(req.body)

		//Hash password
		const salt = await bcrypjs.genSalt(10)
		user.password = await bcrypjs.hash(password, salt)


		//Save new user
		await user.save()

		//Create and sign json web token
		let payload = {
			user: {
				id: user._id
			}
		}

		//sign json web token
		jwt.sign(payload, process.env.SECRET, {
			expiresIn: 3600
		}, (error, token) => {
			if(error) throw error
			
			//Confirmation message
			res.json({ token })
		})


	} catch (err) {
		console.log(err)
		res.status(400).send('An error has ocurred')
	}
}