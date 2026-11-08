-- Plantilla usada por laboratorio.py, un lote OPENJSON por tabla, en transacción.
-- $(COLUMNAS_TIPADAS) procede de sys.columns/sys.types del esquema contratado.
-- $(JSON) procede de csv.DictReader; \N se convierte en null y se escapa como literal SQL.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
INSERT dbo.[$(TABLA)] ($(COLUMNAS))
SELECT $(COLUMNAS) FROM OPENJSON(N'$(JSON)') WITH ($(COLUMNAS_TIPADAS));
COMMIT TRANSACTION;
