const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ================== LOGIN ==================
const login = async (req, res) => {
    const { num_nomina, password } = req.body;

    try {
        const user = await userModel.findByNomina(num_nomina);

        if (!user) {
            return res.status(404).json({ message: 'El número de nomina no está registrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'La contraseña es incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id_empleado, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        }).json({
            message: 'Login exitoso',
            user: {
                nombre: user.nombre,
                rol: user.rol,
                puesto: user.puesto
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Ocurrió un error en el servidor' });
    }
};

// ================== LOGOUT ==================
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.status(200).json({
        message: 'Sesión cerrada correctamente'
    });
};

// ================== ME (VERIFICAR SESIÓN) ==================
const me = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({
            id: user.id_empleado,
            nombre: user.nombre,
            rol: user.rol,
            puesto: user.puesto
        });

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};


// EXPORTAMOS TODO
module.exports = { login, logout, me };
