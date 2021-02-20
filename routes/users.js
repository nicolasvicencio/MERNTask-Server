const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const {check} = require('express-validator')






//Create an user
//api/users
router.post('/',
[
	check('name', 'Name is required').not().isEmpty(),
	check('email', 'Add a valid email').isEmail(),
	check('password', 'Password must be 6 characters min').isLength({min: 6})
],
userController.createUser

)

module.exports = router