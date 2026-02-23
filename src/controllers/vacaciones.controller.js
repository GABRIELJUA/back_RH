const vacacionesModel = require('../models/vacaciones.model');
const notificacionesModel = require('../models/notificaciones.model');

// EMPLEADO crea solicitud
const createVacacion = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, motivo } = req.body;
        const id_empleado = req.user.id;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                message: 'La fecha de inicio y fin son obligatorias'
            });
        }

        // 1️⃣ Guardar solicitud Y obtener ID
        const solicitudId = await vacacionesModel.create(
            id_empleado,
            fecha_inicio,
            fecha_fin,
            motivo
            
        );

        // 2️⃣ Crear notificación ADMIN
        await notificacionesModel.createAdmin(
            'Solicitud de vacaciones',
            'Un empleado ha enviado una nueva solicitud de vacaciones',
            'VACACIONES',
            `/admin/gestionsolicitud`
        );

        res.status(201).json({
            message: 'Solicitud de vacaciones enviada correctamente'
        });

    } catch (error) {
        console.error('Error al guardar solicitud de vacaciones:', error);
        res.status(500).json({
            message: 'Error al enviar la solicitud'
        });
    }
};

// ADMIN RH lista solicitudes
const getVacaciones = async (req, res) => {
    try {
        const solicitudes = await vacacionesModel.getAll();
        res.json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({
            message: 'Error al obtener las solicitudes'
        });
    }
};

module.exports = { createVacacion, getVacaciones };
