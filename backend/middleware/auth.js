// on importe le package jsonwebtoken
const jwt = require('jsonwebtoken');

// export de la fonction qui décode le token
module.exports = (req,res,next) => {
    //on récupère le token
    try{
        const token = req.headers.authorization.split(' ')[1];
        //on décode le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //on récupère le userId
        const userId = decodedToken.userId;
        // on créée l'objet auth qui contient la valeur du token décodé
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.Status(401).json({error})
    };
};