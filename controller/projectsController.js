const Project = require('../models/Project')
const {validationResult} = require('express-validator')



exports.createProject = async(req, res) => {

	//Check for error
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array() })
	}


	try {
		//Creating new project
		const project = new Project(req.body)
	
		//Save creator by jwt
		project.creator = req.user.id


		project.save()
		res.json({project})



	} catch (error) {
		console.log(error)
		res.status(500).send('An error has ocurred')
	}
}

//Get all project of current user

exports.getProjects = async(req, res) => {
	try {
	const projects = await Project.find({creator: req.user.id}).sort({date: -1})
	res.json({projects})


	} catch (err) {
		console.log(err)
		res.status(500).send('An error has ocurred')
	}
}

//Update projects

exports.updateProject = async(req, res) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		res.status(500).json({errors: errors.array()})
	}

//Extract project info

const {name} = req.body
const newProject = {}
if(name) {
	newProject.name = name
}

try {
//Check id
let project = await Project.findById(req.params.id)

//If project exists
if(!project){
	return res.status(404).json({msg : "Project not found"})
}

//Check creator
if(project.id.toString() !== req.user.id){
	return res.status(401).json({msg: 'Not authorized'})
}

//update
project = await Project.findByIdAndUpdate({_id: req.params.id}, {$set: newProject },{new: true})

res.json({project})
	
} catch (error) {
	console.log(error)
	res.status(500).send('Sever error')
}

}

//Delete project by id

exports.deleteProject = async(req, res) => {

	
	try {
		
		let project = await Project.findById(req.params.id)
	
		//If project exist
		if(!project){
			return res.status(404).json({msg:" Project not found"})
		}
	
		//Check creator
		if(project.creator.toString() !== req.user.id){
			return res.status(401).json({msg: 'Not authorized'})
		}
	
		//Delete project
		await Project.findOneAndRemove({_id: req.params.id})
		res.json({msg: 'Project Deleted'})


	} catch (error) {
		console.error(error)
		res.status(500).send("An error has ocurred")
	}


}