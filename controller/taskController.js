const Project = require('../models/Project')
const Task = require('../models/Tasks')
const { validationResult } = require('express-validator')

exports.createTask = async (req, res) => {

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() })
	}


	try {

		//Extract project
		const { project } = req.body
		const projectExists = await Project.findById(project)
		if (!projectExists) {
			return res.status(404).json({ msg: "Project not found" })
		}

		if (projectExists.creator.toString() !== req.user.id) {
			return res.status(404).json({ msg: 'Permision denied' })
		}

		const task = new Task(req.body)
		await task.save()
		res.json({ task })




	} catch (error) {
		console.log(error)
		res.status(500).send('An error has ocurred')
	}

}


//get Tasks by project
exports.getTasks = async (req, res) => {

	try {
		//Extract project
		const { project } = req.query


		const projectExists = await Project.findById(project)
		if (!projectExists) {
			return res.status(404).json({ msg: 'Project not found' })
		}

		if (projectExists.creator.toString() !== req.user.id) {
			return res.status(404).json({ msg: 'Permission denied' })
		}

		//Get tasks by project
		let tasks = await Task.find({ project }).sort({ date: -1 })
		res.json({ tasks })



	} catch (error) {
		console.log('An error has ocurred')
		res.status(500).send('An error has ocurred')

	}

}


exports.updateTask = async (req, res) => {
	try {

		const { project, name, state } = req.body

		//Check if task exists
		let task = await Task.findById(req.params.id)

		if (!task) {
			return res.status(404).josn({ msg: 'Task doesn`t exists' })
		}

		//Extarc project
		const projectExists = await Project.findById(project)


		if (projectExists.creator.toString() !== req.user.id) {
			res.status(401).json({ msg: 'Permission denied' })
		}

		//Create object with new info
		const newTask = {}

		newTask.name = name
		newTask.state = state


		//save task
		task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true })
		res.json({ task })

	} catch (error) {
		console.log(error)
		res.status(500).send('An error has ocurred')
	}

}

exports.deleteTask = async (req, res) => {

	try {

		const { project } = req.query
		console.log(req.params)

		//Check if task exists
		let task = await Task.findById(req.params.id)
		if (!task) {
			return res.status(404).json({ msg: 'Task doesn`t exists' })
		}

		//Extarc project
		const projectExists = await Project.findById(project)


		if (projectExists.creator.toString() !== req.user.id) {
			res.status(404).json({ msg: 'Permission denied' })
		}


		//delete
		await Task.findOneAndRemove({ _id: req.params.id })
		res.json({ msg: 'Task deleted' })



	} catch (error) {
		console.log(error)
		res.status(500).send('An error has ocurred')
	}

}