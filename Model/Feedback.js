const {validate}=require('jsonschema')
const feedbackschema = require('../Schema/feedbackschema.json');
const express = require("express")
const router = express.Router()
const db = require('../config/db')

exports.feedBack = async function(req,res, next){
    try{
        const {firstname,lastname,email,comments}=req.body;
        const filteredData = validate(req.body,feedbackschema);
        if(!filteredData.valid){
            const err = filteredData.errors.map(error=>error.stack)
            console.log(err);
            return err;
        }
        const feedback = await db.query(
            "INSERT INTO feedbacks (firstname,lastname,email,comments) VALUES ($1, $2, $3, $4)RETURNING *", 
            [firstname,lastname,email,comments]
        );
        return res.json(feedback.rows[0]);
      
    }
    catch(err){
        return next(err);
    }
}


