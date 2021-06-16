var mongoose = require('mongoose');
const User = require('../../models/user-model');
const Workspace = require('../../models/workspace-model');
const Notification = require('../../models/notification-model');
const WorkspaceUser = require('../../models/workspace-model');
const Document = require('../../models/document-model');
const Comment = require('../../models/comment-model');
var express = require('express');


exports.getUser = function(req,res,next){
	User.findOne({username:req.params.username}).select("-password -googleAccount -notifications -__v")
	.exec()
	.then(function(user){
		if(user){
			res.send({status:1,user:user});
		}else{
			res.send({status:0,message:"not found"});
		}
	})
	.catch(function(err){
		res.send({status:0,message:err.message});
	})
}

exports.getWorkspaces = function(req,res,next){
	User.findOne({username:req.params.username}).select("-password -googleAccount -notifications -_id -__v")
	.exec()
	.then(function(user){
		user.getWorkspaces()
		.then(function(data){
			res.send({status:1,workspaces : data.workspaces});
		})
	})
	.catch(function(err){
		res.send({status:0,message:err.message});
	})
}

exports.updateUser = function(req,res,next){
	User.updateOne({username:req.body.username},req.body)
	.exec()
	.then(function(data){
		res.send({status:1});
	})
}