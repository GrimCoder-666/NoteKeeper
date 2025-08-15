const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.post('/', async (req, res)=>{
    try{
        const {title, content} = req.body;
        const note = await Note.create({title, content});
        res.status(201).json(note);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/', async (req,res) => {
    try{
        const notes = await Note.find();
        res.status(200).json(notes);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/:id', async (req,res) => {
    try{
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({message: 'Note not found'});
        res.status(200).json(note);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', async (req,res) => {
    try{
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!note) return res.status(404).json({message: 'Note not found'});
        res.status(200).json(note);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/:id', async (req,res) => {
    try{
        const note = await Note.findByIdAndDelete(req.params.id);
        if(!note) return res.statusCode(200).json({message: 'Note removed'});
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

module.exports = router;