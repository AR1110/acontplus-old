USE Acontplus
GO
IF OBJECT_ID(N'v_DocRecibido', N'V') IS NOT NULL
DROP VIEW v_DocRecibido
GO
CREATE VIEW v_DocRecibido AS (
	
	SELECT * FROM Recepcion.DocumentoRecibido
)