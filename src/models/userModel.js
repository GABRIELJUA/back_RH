const db = require('../config/db');

const create = async (userData) => {
    const {
        num_nomina, password_hash, rol, nombre, apellido_paterno,
        apellido_materno, fecha_nacimiento, sexo, estado_civil,
        nacionalidad, rfc, curp, nss, domicilio, correo,
        telefono, fecha_ingreso, puesto, departamento
    } = userData;

    const query = `
        INSERT INTO empleados (
            num_nomina, password_hash, rol, nombre, apellido_paterno, 
            apellido_materno, fecha_nacimiento, sexo, estado_civil, 
            nacionalidad, rfc, curp, nss, domicilio, correo, 
            telefono, fecha_ingreso, puesto, departamento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        num_nomina, password_hash, rol, nombre, apellido_paterno,
        apellido_materno, fecha_nacimiento, sexo, estado_civil,
        nacionalidad, rfc, curp, nss, domicilio, correo,
        telefono, fecha_ingreso, puesto, departamento
    ]);

    return result.insertId;
};

//buscamos el usuario por su numero de nomina
const findByNomina = async (num_nomina) => {
  const [rows] = await db.query(
    'SELECT * FROM empleados WHERE num_nomina = ?',
    [num_nomina]
  );
  return rows[0];
};

const update = async (id, userData) => {
    const {
        num_nomina,
        rol,
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo,
        estado_civil,
        nacionalidad,
        rfc,
        curp,
        nss,
        domicilio,
        correo,
        telefono,
        fecha_ingreso,
        puesto,
        departamento
    } = userData;

    const query = `
        UPDATE empleados SET
            num_nomina = ?,
            rol = ?,
            nombre = ?,
            apellido_paterno = ?,
            apellido_materno = ?,
            fecha_nacimiento = ?,
            sexo = ?,
            estado_civil = ?,
            nacionalidad = ?,
            rfc = ?,
            curp = ?,
            nss = ?,
            domicilio = ?,
            correo = ?,
            telefono = ?,
            fecha_ingreso = ?,
            puesto = ?,
            departamento = ?
        WHERE id_empleado = ?
    `;

    const [result] = await db.query(query, [
        num_nomina,
        rol,
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo,
        estado_civil,
        nacionalidad,
        rfc,
        curp,
        nss,
        domicilio,
        correo,
        telefono,
        fecha_ingreso,
        puesto,
        departamento,
        id
    ]);

    return result.affectedRows;
};

const updatePartial = async (id, data) => {
  const fields = Object.keys(data);

  if (!fields.length) {
    return false;
  }

  const values = Object.values(data);
  const setClause = fields.map(field => `${field} = ?`).join(', ');

  const sql = `
    UPDATE empleados
    SET ${setClause}
    WHERE id_empleado = ?
  `;

  values.push(id);

  const [result] = await db.query(sql, values);
  return result.affectedRows > 0;
};



// Obtener todos los empleados
const getAll = async (filters = {}, pagination = null) => {
    const whereClauses = [];
    const values = [];

    if (filters.departamento) {
        whereClauses.push('departamento = ?');
        values.push(filters.departamento);
    }

    if (filters.puesto) {
        whereClauses.push('puesto = ?');
        values.push(filters.puesto);
    }

    if (filters.estatus) {
        whereClauses.push('rol = ?');
        values.push(filters.estatus);
    }

    if (Array.isArray(filters.roles) && filters.roles.length) {
        const placeholders = filters.roles.map(() => '?').join(', ');
        whereClauses.push(`rol IN (${placeholders})`);
        values.push(...filters.roles);
    }

    if (filters.q) {
        whereClauses.push(`(
            nombre LIKE ? OR
            apellido_paterno LIKE ? OR
            apellido_materno LIKE ? OR
            num_nomina LIKE ?
        )`);
        const term = `%${filters.q}%`;
        values.push(term, term, term, term);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const baseSelect = `
        SELECT 
            id_empleado,
            num_nomina,
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            puesto,
            departamento,
            rol,
            rfc,
            curp,
            nss,
            domicilio,
            telefono,
            fecha_ingreso,
            fecha_nacimiento,
            sexo,
            estado_civil,
            edad
        FROM empleados
        ${whereSql}
        ORDER BY fecha_ingreso DESC
    `;

    if (!pagination) {
        const [rows] = await db.query(baseSelect, values);
        return rows;
    }

    const [rows] = await db.query(
        `${baseSelect} LIMIT ? OFFSET ?`,
        [...values, pagination.limit, pagination.offset]
    );

    const [countRows] = await db.query(
        `SELECT COUNT(*) AS total FROM empleados ${whereSql}`,
        values
    );

    return {
        data: rows,
        total: countRows[0].total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(countRows[0].total / pagination.limit)
    };
};


// Obtener empleado por ID
const findById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM empleados WHERE id_empleado = ?',
        [id]
    );
    return rows[0];
};

module.exports = { findByNomina , create, getAll, findById, update , updatePartial };
