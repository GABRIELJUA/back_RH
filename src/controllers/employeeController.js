const userModel = require('../models/userModel');
const auditLogModel = require('../models/auditLogModel');
const bcrypt = require('bcrypt');

const { ROLES_VALIDOS } = require('../middlewares/validationMiddleware');
const { getPagination } = require('../utils/pagination');

// ================== REGISTRAR EMPLEADO ==================
const register = async (req, res) => {
  try {
    const userData = req.body;

    if (userData.rol) {
      if (!ROLES_VALIDOS.includes(userData.rol)) {
        return res.status(400).json({ message: 'Rol no válido' });
      }

      if (userData.rol === 'ADMIN' && req.user.rol !== 'ADMIN') {
        return res.status(403).json({
          message: 'No tienes permisos para crear un administrador'
        });
      }
    } else {
      userData.rol = 'EMPLEADO';
    }

    if (userData.num_nomina !== undefined) {
      userData.num_nomina = String(userData.num_nomina).trim();
    }

    if (!userData.num_nomina) {
      return res.status(400).json({
        message: 'El número de nómina es obligatorio'
      });
    }

    if (!/^[0-9]{4}$/.test(userData.num_nomina)) {
      return res.status(400).json({
        message: 'La nómina debe tener exactamente 4 números'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    userData.password_hash = hashedPassword;
    delete userData.password;

    const employeeId = await userModel.create(userData);

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'CREATE',
      entity: 'EMPLEADO',
      entity_id: employeeId,
      details: {
        num_nomina: userData.num_nomina,
        rol: userData.rol,
        nombre: userData.nombre
      }
    });

    res.status(201).json({
      message: 'Empleado registrado exitosamente',
      id: employeeId
    });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      let message = 'Dato duplicado';

      if (error.message.includes('correo')) {
        message = 'El correo electrónico ya está registrado';
      }
      else if (error.message.includes('curp')) {
        message = 'La CURP ya existe';
      }
      else if (error.message.includes('rfc')) {
        message = 'El RFC ya existe';
      }
      else if (error.message.includes('num_nomina')) {
        message = 'El número de nómina ya existe';
      }
      else if (error.message.includes('nss')) {
        message = 'El NSS ya existe';
      }

      return res.status(400).json({ message });
    }

    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ================== ACTUALIZAR EMPLEADO (ADMIN / EDITOR) ==================
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    if (userData.num_nomina !== undefined) {
      userData.num_nomina = String(userData.num_nomina).trim();

      if (!/^[0-9]{4}$/.test(userData.num_nomina)) {
        return res.status(400).json({
          message: 'La nómina debe tener exactamente 4 números'
        });
      }
    }

    if (userData.rol) {
      if (!ROLES_VALIDOS.includes(userData.rol)) {
        return res.status(400).json({
          message: 'Rol no válido'
        });
      }

      if (userData.rol === 'ADMIN' && req.user.rol !== 'ADMIN') {
        return res.status(403).json({
          message: 'No puedes asignar rol de administrador'
        });
      }
    }

    const updated = await userModel.update(id, userData);

    if (!updated) {
      return res.status(404).json({
        message: 'Empleado no encontrado'
      });
    }

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'UPDATE',
      entity: 'EMPLEADO',
      entity_id: id,
      details: userData
    });

    res.json({
      message: 'Empleado actualizado correctamente'
    });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'Dato duplicado'
      });
    }

    console.error('Error al actualizar:', error);
    res.status(500).json({
      message: 'Error al actualizar empleado'
    });
  }
};

// ================== LISTAR EMPLEADOS ==================
const getEmployees = async (req, res) => {
  try {
    const filters = {
      departamento: req.query.departamento,
      puesto: req.query.puesto,
      estatus: req.query.estatus,
      q: req.query.q
    };

    const pagination = getPagination(req.query);
    const employees = await userModel.getAll(filters, pagination);
    res.json(employees);
  } catch (error) {
    console.error('Error al listar empleados:', error);
    res.status(500).json({ message: 'Error al obtener empleados' });
  }
};

// ================== OBTENER EMPLEADO POR ID ==================
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await userModel.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: 'Empleado no encontrado'
      });
    }

    res.json(employee);

  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({
      message: 'Error al obtener el empleado'
    });
  }
};

// ================== PERFIL PROPIO ==================
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const employee = await userModel.findById(userId);

    if (!employee) {
      return res.status(404).json({
        message: 'Perfil no encontrado'
      });
    }

    res.json(employee);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      message: 'Error al obtener perfil'
    });
  }
};

// ================== ACTUALIZAR PERFIL PROPIO ==================
const updateMyProfile = async (req, res) => {
  try {
    const allowed = ['telefono', 'domicilio', 'estado_civil', 'correo'];
    const data = {};

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    const updated = await userModel.updatePartial(req.user.id, data);

    if (!updated) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'UPDATE_PROFILE',
      entity: 'EMPLEADO',
      entity_id: req.user.id,
      details: data
    });

    return res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

const updateEmployeePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!rol || !ROLES_VALIDOS.includes(rol)) {
      return res.status(400).json({
        message: 'Rol no válido'
      });
    }

    if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({
        message: 'No tienes permisos para cambiar roles'
      });
    }

    await userModel.updatePartial(id, { rol });

    await auditLogModel.create({
      user_id: req.user.id,
      action: 'UPDATE_ROLE',
      entity: 'EMPLEADO',
      entity_id: id,
      details: { rol }
    });

    res.json({
      message: 'Permisos actualizados correctamente'
    });

  } catch (error) {
    console.error('Error al actualizar permisos:', error);
    res.status(500).json({
      message: 'Error al actualizar permisos'
    });
  }
};

module.exports = {
  register,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  getMyProfile,
  updateMyProfile,
  updateEmployeePermissions
};
