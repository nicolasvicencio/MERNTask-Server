const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const taskController = require('../controller/taskController')
const { check } = require('express-validator')



router.post('/',
	auth,
	[
		check('name', 'Name is required').not().isEmpty(),
		check('project', 'Project is required').not().isEmpty()
	],
	taskController.createTask
)

//Get task by rpoject

router.get('/', 
auth,
taskController.getTasks
)


//uptdate task
router.put('/:id',
auth,
taskController.updateTask
)

//Delete task
router.delete('/:id',
auth,
taskController.deleteTask
)

module.exports = router