var mongoose = require('mongoose');
const User = require('../../models/user-model');
const Workspace = require('../../models/workspace-model');
const Notification = require('../../models/notification-model');
const WorkspaceUser = require('../../models/workspace-model');
const Document = require('../../models/document-model');
const Comment = require('../../models/comment-model');
var express = require('express');

exports.addFiletree = function(req,res,next){
	Workspace.findOne({name : req.body.name})
	.exec()
	.then((data) => {
		data.addCategory(req.body.data)
		.then((da) => {
			res.send(da)
		})
		.catch((err) => {
			next(err);
		})
	})
	.catch()
}

exports.addDocument = function(req,res,next){
	Workspace.findOne({name:req.body.name})
	.exec()
	.then((data) => {
		data.addDocument({name: req.body.data})
		.then((datalagi) => {
			res.send(datalagi);
		})
		.catch()

	})
	.catch()
}

exports.updateWorkspace = function(req,res,next){
	Workspace.updateOne({name:req.body.name},req.body)
	.exec()
	.then((data) => {
		res.send({status:1,message:"data updated"});
	})
	.catch((err)=>{
		next(err);
	})
}

exports.getWorkspace = function(req,res,next){
	Workspace.findOne({name:req.params.name}).select("-__v")
	.exec().then(function(workspace){
		if(workspace){
			res.send({status:1,workspace});
		}else{
			res.send({status:0,message:"workspace not found"});
		}
	})
	.catch(function(err){
		res.send({status:0,message:err.message});
	});
}

exports.getUsers = function(req,res,next){
	Workspace.findOne({name:req.params.name}).select("-__v")
	.exec().then(function(workspace){
		if(workspace){
			workspace.getUsersDetail()
			.then((users) => {
				res.send({status:1, users});
			})
		}else{
			res.send({status:0,message:"workspace not found"});
		}
	})
	.catch(function(err){
		res.send({status:0,message:err.message});
	});
}

exports.putUser = function(req,res,next){
	Workspace.findOne({name:req.params.name}).select("-__v")
	.exec().then(function(workspace){
		if(workspace){
			let obj = {
				user : req.body.user,
				level : req.body.level,
				disable : false,
			}
			workspace.addUser(obj)
			.then((users) => {
				res.send({status:1, users});
			})
		}else{
			res.send({status:0,message:"workspace not found"});
		}
	})
	.catch(function(err){
		res.send({status:0,message:err.message});
	});
}

exports.deleteUser = function(req,res,next){
	return false;	
}

exports.getDocuments = function(req,res,next){
	Workspace.findOne({name:req.params.name})
	.exec()
	.then(function(wspace){
		wspace.getDocuments()
		.then((data) => {
			res.send(data);
		});
		
	})
}

exports.getDocument = function(req,res,next){
	Workspace.findOne({name:req.params.name})
	.exec()
	.then(function(wspace){
		wspace.getDocument(req.params.docid)
		.then((doc)=>{
			res.send({status : 1, document : doc});
		})
		.catch((err)=>{ next(err)})
	})
}


exports.updateDocument = async function(req,res,next){
	
	let doc = await mongoose.model('workspace').findOne({name:req.params.name}).exec();
	let docDetail = await doc.getDocument(req.body.name);

	let updatedDoc = docDetail[0].document;
	updatedDoc.name = "percobaan sekali lagi";

	Workspace.findOne({name:req.params.name})
	.exec()
	.then(function(wspace){
		wspace.updateDocument(updatedDoc)
		.then((d)=>{
			res.send({status : 0, message : "API not ready yet"})
		})
	})
	
}