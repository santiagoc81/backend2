import { Router } from "express";
import passport from "../passport-config.js"; 

const router = Router();

// Endpoint para obtener el usuario autenticado
router.get(
    "/current",
    passport.authenticate("current", { session: false }), 
    (req, res) => {
        // Si el usuario está autenticado, devuelve su información
        res.status(200).json({
            message: "Usuario autenticado",
            user: req.user, // Información del usuario autenticado
        });
    }
);

export default router;
