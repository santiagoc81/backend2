import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";

const router = Router();
const SECRET_KEY = "MiSuperClaveSecreta"; 

// Ruta de login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Configurar la cookie con el token
        res.cookie("authToken", token, {
            httpOnly: true, 
            secure: false, 
            maxAge: 60 * 60 * 1000, // 1 hora
        });

        res.status(200).json({ message: "Inicio de sesión exitoso" });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta protegida para probar
router.get("/protected", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1]; // Extrae el token del encabezado Authorization

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verifica el token
        res.status(200).json({ message: "Acceso permitido", user: decoded });
    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(403).json({ message: "Token inválido o expirado" });
    }
});

export default router;
