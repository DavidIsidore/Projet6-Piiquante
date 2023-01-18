//import d'express
const express = require('express');

//on créée le routeur
const router = express.Router();

//import du modèle de données
const userCtrl = require('../controllers/user');

//on créée la route pour l'inscription
router.post('/signup', userCtrl.signup);

//on créée la route pour la connection
router.post('/login', userCtrl.login);




//on exporte le routeur
module.exports = router;