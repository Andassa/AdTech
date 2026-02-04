require( "dotenv" ).config();


const server = require( "./src/app" ); // Pour créer le serveur express
const connectDB = require( "./src/config/database" ); // Pour connecter la base de données mongoDB

// Connexion à MongoDB avant de démarrer le serveur
connectDB()
  .then(() => {
    // Démarrer le serveur une fois MongoDB connecté
    server.listen( process.env.PORT, () =>
    {
      console.log( `Server is running on port ${ process.env.PORT }` );
    } );
  })
  .catch((error) => {
    console.error( "Failed to connect to MongoDB:", error.message );
    process.exit(1);
  });