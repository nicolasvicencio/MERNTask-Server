const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const authController = require('../controller/authController')
const auth = require('../middleware/auth')

//api/auth
router.post('/', 
[
	check('email', 'Add a valid email').isEmail(),
	check('password', 'Passwrod must be 6 character min').isLength({min: 6})
],
authController.authenticateUser
)

//this func get authenticated user
router.get('/', 
auth,
authController.userAuthenticated
)

module.exports = router