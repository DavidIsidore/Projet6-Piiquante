//on importe le modèle de sauces
const Sauce = require('../models/Sauce');

//import de fs pour gérer la modification des fichiers
const fs = require('fs');


//export de la fonction de création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    
    //on parse l'objet
    const sauceObject = JSON.parse(req.body.sauce);
    // à voir s'il faut enlever les 2 lignes suivantes
    //delete sauceObject._id;
    //delete sauceObject.userId;
    // on crée une nouvelle instance de Sauce
    const sauce = new Sauce({
        ...sauceObject, likes:0, dislikes: 0, usersLiked:[], usersDisliked: [], imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    //sauvegarde de la nouvelle sauce
    sauce.save()
    .then(() => res.status(201).json({message : 'Votre recette de sauce a bien été enregistrée'}))
    .catch(error => res.status(400).json({error}));
  };

//export de la fonction de modification d'une sauce
exports.modifySauce = (req,res,next) => {
    //on vérifie si un fichier image est joint
    const sauceObject = req.filename?{
        //si c'est le cas
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}; // sinon, on récupère le corps de la requête

    //on supprime le userId venant de la requête
    delete sauceObject._userId;
    //on cherche la sauce dans la base de données
    Sauce.findOne({_id:req.params.id})
    .then((sauce) => {
        //on vérifie que ce soit l'utilisateur qui a créé la sauce qui cherche à la modifier
        if(sauce.userId != req.auth.userId) { // si le userId est différent
            res.status(400).json({message: 'Non-autorisé'});
        } else { //si l'utilisateur est le bon
            //on met la sauce à jour
            Sauce.updateOne({_id: req.params.id},{...sauceObject,_id:req.params.id})
            .then(() => res.status(200).json({message: 'La sauce a été mise à jour'}))
            .catch(error => res.status(401).json({error}));
        }
    })
    .catch((error) => {res.status(400).json({error})});
};

//export de la fonction de suppression d'une sauce
exports.deleteSauce = (req,res,next) => {
    // on récupère la sauce
    Sauce.findOne({_id : req.params.id})
    .then( sauce => { // on vérifie les droits d'accès
        if (sauce.userId != req.auth.userId) { // si celui qui veut supprimer la sauce n'en est pas le créateur
            res.status(400).json({message: 'Vous n\'êtes pas autorisé à effectuer cette action'})
        } else { // si c'est le bon utilisateur
            // on récupère le nom de fichier
             const filename = sauce.imageUrl.split('/images/')[1];
             //on supprime l'image
             fs.unlink(`images/${filename}`, () => {
                // on supprime la sauce de la BDD
                Sauce.deleteOne({_id:req.params.id})
                .then(() => res.status(200).json({message: 'La sauce a bien été supprimée'}))
                .catch(error => res.status(401).json({error}));
             });
        }

    })
    .catch(error => res.status(500).json({error}));
  };

//export de la fonction de récupération d'une sauce spécifique
exports.findOneSauce = (req,res,next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

//export de la fonction de récupération du tableau de toutes les sauces
exports.findAllSauces = (req, res, next) => {
    Sauce.find()
    //on retourne le tableau des sauces
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
   };

   //export de la fonction gérant les likes
   exports.likeSauce = (req,res,next) => { //on récupère la sauce
    //const sauceObject = JSON.parse(req.body.sauce);
    Sauce.findOne({_id:req.params.id})
    .then(sauce =>{ // on vérifie qu'il s'agit d'un utilisateur différent
        if(sauce.userId = req.body.userId) { //s'il s'agit du créateur de la sauce
            res.status(400).json({message : "Vous n'êtes pas autorisé à liker votre propre sauce"}) // on lui dit qu'il ne peut liker sa propre sauce
        }else{
            // on vérifie que l'utilisateur n'a pas déjà voté pour cette sauce
            if(sauce.usersLiked.includes(req.body.userId)){ //si l'utilisateur a déjà liké
                res.status(400).json({message: "Vous ne pouvez pas liker plusieurs fois la même sauce (même si elle vous plaît beaucoup)"})
            } else { //si l'utilisateur n'a pas encore liké
                alert('Vous n\'avez pas encore liké cette sauce');
                //on ajoute l'utilisateur au tableau
                sauce.usersLiked.push(userId); 
                //on met la sauce à jour avec les nouveaux paramètres
                Sauce.updateOne({_id: req.params.id},{...sauceObject,_id:req.params.id, likes:req.body.like,usersLiked:req.body.usersLiked})
                .then(() => res.status(200).json({message: 'Merci d\'avoir apprécié'}))
                .catch(error => res.status(401).json({error}));
                

            }
        }
    })
    .catch(error => res.status(400).json({error}));
   };