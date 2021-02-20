const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')


exports.authenticateUser = async(req, res) => {
	//Check for errors
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(404).json({errors: errors.array()})
	}

	//Extract email and password

	const {email, password} = req.body

	try {
		//Check if is a registered user
		let user = await User.findOne({email})
		if(!user) {
			return res.status(400).json({msg: 'User doesn`t exist '})
		}

		//Check password
		const correctPass = await bcryptjs.compare(password, user.password)
		if(!correctPass){
			return res.status(400).json({msg: 'Incorrect password'})
		}

		//If everything is correct
		const payload = {
			user: {
				id: user.id
			}
		}

		jwt.sign(payload, process.env.SECRET, {
			expiresIn: 3600
		},(error, token) => {
			if(error) throw error

			res.json({token})
		})
		
	} catch (error) {
		console.log(error)
	}

}


//get if user is authenticated
exports.userAuthenticated = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password')
		res.json({user})


	} catch (error) {
		console.log(error)
		res.status(500).json({msg: 'An error has ocurred'})
	}
}