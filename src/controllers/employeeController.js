const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

// Roles permitidos en el sistema
const ROLES_VALIDOS = [
  'ADMIN',
  'ADMIN_EDITOR',
  'ADMIN_LECTURA',
  'EMPLEADO'
];

// ================== REGISTRAR EMPLEADO ==================
const register = async (req, res) => {
  try {
    const userData = req.body;

    // Validar rol
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

    // ================= LIMPIAR NÓMINA =================
    if (userData.num_nomina !== undefined) {
      userData.num_nomina = String(userData.num_nomina).trim();
    }


    // ================= VALIDAR NÓMINA =================
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

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    userData.password_hash = hashedPassword;
    delete userData.password;

    const employeeId = await userModel.create(userData);

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

    // ================= VALIDAR NÓMINA =================
    if (userData.num_nomina !== undefined) {

      userData.num_nomina = String(userData.num_nomina).trim();

      if (!/^[0-9]{4}$/.test(userData.num_nomina)) {
        return res.status(400).json({
          message: 'La nómina debe tener exactamente 4 números'
        });
      }
    }

    // ================= VALIDAR ROL =================
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
    const employees = await userModel.getAll();
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
  const allowed = ['telefono', 'domicilio', 'estado_civil', 'correo'];
  const data = {};

  allowed.forEach(field => {
    if (req.body[field] !== undefined) {
      data[field] = req.body[field];
    }
  });

  await userModel.updatePartial(req.user.id, data);

  res.json({ message: 'Perfil actualizado correctamente' });
};


const updateEmployeePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    // 🔐 Validar rol
    const ROLES_VALIDOS = [
      'ADMIN',
      'ADMIN_EDITOR',
      'ADMIN_LECTURA',
      'EMPLEADO'
    ];

    if (!rol || !ROLES_VALIDOS.includes(rol)) {
      return res.status(400).json({
        message: 'Rol no válido'
      });
    }

    // 🔐 Solo ADMIN puede cambiar permisos
    if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({
        message: 'No tienes permisos para cambiar roles'
      });
    }

    await userModel.updatePartial(id, { rol });

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
