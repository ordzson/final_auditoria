-- Ejecutar SELECT en cada contexto; admin/control con EXECUTE AS USER por sa.
SELECT USER_NAME() AS UsuarioBD,ORIGINAL_LOGIN() AS LoginConexion,
HAS_PERMS_BY_NAME('dbo.BitacoraSQL','OBJECT','SELECT') AS PuedeSelect,
HAS_PERMS_BY_NAME('dbo.BitacoraSQL','OBJECT','UPDATE') AS PuedeUpdate,
HAS_PERMS_BY_NAME('dbo.BitacoraSQL','OBJECT','DELETE') AS PuedeDelete,
HAS_PERMS_BY_NAME('dbo.BitacoraSQL','OBJECT','ALTER') AS PuedeAlter,
HAS_PERMS_BY_NAME(DB_NAME(),'DATABASE','CONTROL') AS ControlBD,
HAS_PERMS_BY_NAME(NULL,'SERVER','CONTROL SERVER') AS ControlServidor,
IS_MEMBER('db_owner') AS EsDbOwner,IS_SRVROLEMEMBER('sysadmin') AS EsSysadmin
ORDER BY UsuarioBD;
