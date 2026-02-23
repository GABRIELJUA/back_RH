const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Importar rutas (las crearemos en el siguiente paso)
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const sugerenciaRoutes = require('./routes/sugerencias.routes');
const libraryRoutes = require('./routes/libraryRoutes');
const comunicadoRoutes = require('./routes/comunicadoRoutes');
const dashboardRoutes = require('./routes/dashboard.routes');
const vacacionesRoutes = require('./routes/vacaciones.routes');
const notificacionesRoutes = require('./routes/notificaciones.routes');


const app = express();
app.use('/uploads', express.static('uploads'));

// --- Middlewares Globales ---

// 1. CORS: Permite que tu Frontend se comunique con el Backend
app.use(cors({
    origin: 'http://localhost:4200', // O la URL de tu frontend (ej. Vite)
    credentials: true // Indispensable para permitir el envío de cookies
}));


// 2. Lectura de JSON y Cookies
app.use(express.json());
app.use(cookieParser());

// --- Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/sugerencias', sugerenciaRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/comunicados', comunicadoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);




// Ruta de prueba para verificar que el servidor vive
app.get('/', (req, res) => {
    res.send('Servidor del Hotel Posada Tampico funcionando 🏨');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Deposada tampico corriendo en http://localhost:${PORT}`);
});