// on importe express
const express = require('express');

//on importe le middleware gérant la vérification d'authentification
const auth = require('../middleware/auth');

//import du chemin d'images
const multer = require('../middleware/multer-config');

//on créée le routeur
const router = express.Router();

//import du modèle de données
const productCtrl = require('../controllers/product');



/*--------------ROUTES--------------*/
// on gère l'authentification avant les gestionnaires de routes

//création de nouvelle sauce
router.post('/', auth, multer, productCtrl.createSauce);

//Modification d'une sauce
router.put('/:id', auth,multer,  productCtrl.modifySauce);

//suppression d'une sauce
router.delete('/:id', auth, productCtrl.deleteSauce);


// Récupération d'une sauce spécifique
router.get('/:id', auth, productCtrl.findOneSauce);


// Récupération du tableau des sauces
router.use('/', auth, productCtrl.findAllSauces);

//gestion des likes
router.post('/:id/likes',auth , productCtrl.likeSauce);

/*----------------FIN DES ROUTES-----------------*/

//on exporte le routeur
module.exports = router;