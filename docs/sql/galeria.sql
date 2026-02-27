-- Esquema recomendado para módulo Galería (álbumes + fotos)

CREATE TABLE IF NOT EXISTS galeria_albumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  anio SMALLINT NULL,
  portada_url VARCHAR(255) NULL,
  creado_por INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_galeria_albumes_creado_por
    FOREIGN KEY (creado_por) REFERENCES empleados(id_empleado)
);

CREATE TABLE IF NOT EXISTS galeria_fotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT NOT NULL,
  archivo_url VARCHAR(255) NOT NULL,
  orden INT DEFAULT 0,
  subido_por INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_galeria_fotos_album
    FOREIGN KEY (album_id) REFERENCES galeria_albumes(id) ON DELETE CASCADE,
  CONSTRAINT fk_galeria_fotos_subido_por
    FOREIGN KEY (subido_por) REFERENCES empleados(id_empleado)
);

CREATE INDEX idx_galeria_albumes_anio ON galeria_albumes(anio);
CREATE INDEX idx_galeria_albumes_nombre ON galeria_albumes(nombre);
CREATE INDEX idx_galeria_fotos_album_id ON galeria_fotos(album_id);
