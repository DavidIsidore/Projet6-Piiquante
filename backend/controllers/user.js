// on importe le User
const User = require('../models/User');

//on importe le module de cryptage
const bcrypt = require('bcrypt');

//on importe le package d'identification de token
const jwt = require('jsonwebtoken');



//on exporte la fonction de création d'utilisateur
exports.signup = (req,res,next) => {
    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch();
};

//on exporte la fonction de conncetion
exports.login = (req,res,next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({message : 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({message: 'Paire login/mot de passe incorrecte'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch();
};