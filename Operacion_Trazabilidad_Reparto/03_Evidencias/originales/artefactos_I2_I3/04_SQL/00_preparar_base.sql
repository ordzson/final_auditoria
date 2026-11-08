-- laboratorio.py sustituye el nombre validado; no reutiliza bases.
IF DB_ID(N'$(BASE)') IS NOT NULL THROW 51000,'La base ya existe; usar otro nombre propio.',1;
CREATE DATABASE [$(BASE)];
