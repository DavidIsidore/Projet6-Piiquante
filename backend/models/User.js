//import de mongoose
const mongoose = require('mongoose');

//import du package de validation d'user unique
const uniqueValidator = require('mongoose-unique-validator');

//on créée le schéma de données
const userSchema = mongoose.Schema({
    email: {type: String, required:true, unique:true},
    password: {type:String, required:true}
});

//on applique le plugin de validation unique
userSchema.plugin(uniqueValidator);

//on exporte le schéma de données
module.exports = mongoose.model('User', userSchema);