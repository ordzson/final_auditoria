-- Login auditor_lectura preparado por laboratorio.py con secreto local excluido de Git.
CREATE USER auditor_lectura FOR LOGIN auditor_lectura;
GRANT SELECT ON SCHEMA::dbo TO auditor_lectura;
DENY INSERT, UPDATE, DELETE, ALTER ON DATABASE::[$(BASE)] TO auditor_lectura;
CREATE USER admin_bitacora_lab WITHOUT LOGIN;
CREATE USER control_bitacora_lab WITHOUT LOGIN;
GRANT SELECT, UPDATE, DELETE ON dbo.BitacoraSQL TO admin_bitacora_lab;
GRANT SELECT ON dbo.BitacoraSQL TO control_bitacora_lab;
-- Ningún dato de BitacoraSQL se modifica para probar estos permisos.
