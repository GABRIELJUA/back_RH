const db = require('../config/db');

const createAlbum = async (data) => {
  const {
    nombre,
    descripcion,
    anio,
    portada_url,
    creado_por
  } = data;

  const [result] = await db.query(
    `
      INSERT INTO galeria_albumes (nombre, descripcion, anio, portada_url, creado_por)
      VALUES (?, ?, ?, ?, ?)
    `,
    [nombre, descripcion || null, anio || null, portada_url || null, creado_por]
  );

  return result.insertId;
};

const getAlbums = async (filters = {}, pagination = null) => {
  const whereClauses = [];
  const values = [];

  if (filters.anio) {
    whereClauses.push('ga.anio = ?');
    values.push(filters.anio);
  }

  if (filters.q) {
    whereClauses.push('(ga.nombre LIKE ? OR ga.descripcion LIKE ?)');
    const term = `%${filters.q}%`;
    values.push(term, term);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const baseQuery = `
    SELECT
      ga.*,
      CONCAT(e.nombre, ' ', e.apellido_paterno) AS creado_nombre,
      COUNT(gf.id) AS total_fotos
    FROM galeria_albumes ga
    LEFT JOIN galeria_fotos gf ON gf.album_id = ga.id
    LEFT JOIN empleados e ON e.id_empleado = ga.creado_por
    ${whereSql}
    GROUP BY ga.id
    ORDER BY ga.created_at DESC
  `;

  if (!pagination) {
    const [rows] = await db.query(baseQuery, values);
    return rows;
  }

  const [rows] = await db.query(
    `${baseQuery} LIMIT ? OFFSET ?`,
    [...values, pagination.limit, pagination.offset]
  );

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM galeria_albumes ga ${whereSql}`,
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

const findAlbumById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM galeria_albumes WHERE id = ?',
    [id]
  );

  return rows[0];
};

const addPhotos = async (albumId, photos = []) => {
  if (!photos.length) {
    return 0;
  }

  const values = photos.map((photo) => [
    albumId,
    photo.archivo_url,
    photo.orden || 0,
    photo.subido_por
  ]);

  const [result] = await db.query(
    `
      INSERT INTO galeria_fotos (album_id, archivo_url, orden, subido_por)
      VALUES ?
    `,
    [values]
  );

  return result.affectedRows;
};

const getPhotosByAlbum = async (albumId) => {
  const [rows] = await db.query(
    `
      SELECT
        gf.*,
        CONCAT(e.nombre, ' ', e.apellido_paterno) AS subido_nombre
      FROM galeria_fotos gf
      LEFT JOIN empleados e ON e.id_empleado = gf.subido_por
      WHERE gf.album_id = ?
      ORDER BY gf.orden ASC, gf.created_at ASC
    `,
    [albumId]
  );

  return rows;
};

const findPhotoById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM galeria_fotos WHERE id = ?',
    [id]
  );

  return rows[0];
};

const removePhoto = async (id) => {
  const [result] = await db.query(
    'DELETE FROM galeria_fotos WHERE id = ?',
    [id]
  );

  return result.affectedRows;
};

const removeAlbum = async (id) => {
  const [result] = await db.query(
    'DELETE FROM galeria_albumes WHERE id = ?',
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  createAlbum,
  getAlbums,
  findAlbumById,
  addPhotos,
  getPhotosByAlbum,
  findPhotoById,
  removePhoto,
  removeAlbum
};
