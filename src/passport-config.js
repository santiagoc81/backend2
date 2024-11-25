import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "./models/user.model.js";


// Clave secreta para JWT
const SECRET_KEY = "MiSuperClaveSecreta"; 

// **Estrategia Local**
passport.use(
    new LocalStrategy(
        {
            usernameField: "email", // Campo para el email en la solicitud
            passwordField: "password", // Campo para la contraseña
        },
        async (email, password, done) => {
            try {
                // Buscar al usuario por email
                const user = await userModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                // Comparar contraseñas
                const isMatch = user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                // Usuario autenticado exitosamente
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Extractor de cookies
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["authToken"]; // Nombre de la cookie que contiene el token
    }
    return token;
};

// JWT
passport.use(
    "current",
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: SECRET_KEY,
        },
        async (jwtPayload, done) => {
            try {
                // Buscar al usuario asociado al token
                const user = await userModel.findById(jwtPayload.id);
                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }
                return done(null, user); // Usuario encontrado
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

export default passport;
