import express from 'express';
import mongoose from 'mongoose';
import passport from "./passport-config.js"; 
import session from "express-session";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.router.js';
import authRoutes from "./routes/auth.routes.js";
import sessionsRoutes from "./routes/sessions.routes.js"; 

const app = express();

//Mongo
const uri = 'mongodb://localhost:27017/backend2'
mongoose.connect(uri);

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

// Configurar sesión
app.use(
  session({
      secret: "ClaveSecreta", 
      resave: false,
      saveUninitialized: false,
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/users', userRouter);
app.use("/auth", authRoutes);
app.use("/api/sessions", sessionsRoutes); // Ruta para obtener usuario actual


// Configura un puerto
const PORT = 3000;

// Define una ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola, Este es un proyecto de Express!');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
