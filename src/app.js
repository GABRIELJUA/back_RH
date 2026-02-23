const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

// Importar rutas
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
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

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

app.get('/', (req, res) => {
  res.send('Servidor del Hotel Posada Tampico funcionando 🏨');
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Deposada tampico corriendo en http://localhost:${PORT}`);
});
