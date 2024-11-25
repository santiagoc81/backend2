import { Router } from "express";
import { userModel } from "../models/user.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        let users = await userModel.find();
        res.send({ result: "success", payload: users });
    } catch (error) {
        console.log("No pude obtener usuario con mongoose: " + error);
    }
});

// Endpoint para crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        // Validación básica
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({ result: "error", message: "Datos incompletos" });
        }

        // Crear nuevo usuario
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password,
            role,
        });

        // Guardar en la base de datos
        await newUser.save();

        res.status(201).send({ result: "success", payload: newUser });
    } catch (error) {
        console.log("No pude crear usuario con mongoose: " + error);
        res.status(500).send({ result: "error", error: error.message });
    }
});

const userRouter = router; 
export default userRouter; 
