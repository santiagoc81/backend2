import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, "El nombre es obligatorio"],
        },
        last_name: {
            type: String,
            required: [true, "El apellido es obligatorio"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "El correo electrónico es obligatorio"],
            match: [/^\S+@\S+\.\S+$/, "El correo no tiene un formato válido"],
        },
        age: {
            type: Number,
            min: [0, "La edad no puede ser menor que 0"],
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
        },
        cart: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ["user", "admin"], // Solo permite estos valores
            default: "user",
        },
    }
);

// Middleware para cifrar la contraseña antes de guardarla usando hashSync
userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = bcrypt.genSaltSync(10); 
        this.password = bcrypt.hashSync(this.password, salt); // Encripta la contraseña con el metodo pedido
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password); // Compara la contraseña en texto plano con la encriptada
};


export const userModel = mongoose.model(userCollection, userSchema);
