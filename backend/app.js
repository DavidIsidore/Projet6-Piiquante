// import de Express
const express = require('express');

//import de mongoose
const mongoose = require('mongoose');

//accès au chemin du serveur
const path = require('path');

//import de body-parser pour avoir une réponse au bon format
const bodyparser = require('body-parser');


//création de l'application
const app = express();

//on importe le routeur des produits
const productRoutes = require('./routes/product');

//on importe le routeur pour les utilisateurs
const userRoutes = require('./routes/user');

//Connection à la base de données
mongoose.connect('mongodb+srv://serialcoder:aBQjHHvMgRei93y@picante.kobnz2f.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Gestion des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//on accède au corps des requêtes
//on intercepte toutes les requêtes au format JSON
// et on les met à disposition dans req.body
app.use(bodyparser.json());



//définition de la destination des images




app.use('/api/sauces', productRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));



//on exporte l'application
module.exports = app;
