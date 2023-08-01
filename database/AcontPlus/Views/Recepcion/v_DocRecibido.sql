USE Acontplus
GO
IF OBJECT_ID(N'v_DocRecibido', N'V') IS NOT NULL
DROP VIEW v_DocRecibido
GO
CREATE VIEW v_DocRecibido AS (
	
	SELECT rd.*, e.ruc, en.idEntidad
	FROM Recepcion.DocumentoRecibido rd WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON rd.idEstablecimiento = e.idEstablecimiento
	INNER JOIN Entidad en WITH (NOLOCK) ON e.ruc = en.ruc 
)