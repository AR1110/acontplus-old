USE AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-09-27
-- Description: SP FOR GET DETAIL TEMP
-- =============================================
--Recepcion.Doc_Detail_Temp_Get 1061, 'A250AADC-1033-4056-B0A1-13A2F857CB37'
IF OBJECT_ID(N'Recepcion.Doc_Detail_Temp_Get', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Doc_Detail_Temp_Get 
GO
CREATE PROCEDURE Recepcion.Doc_Detail_Temp_Get
@idRol INT
,@idDocumento INT
,@jsonData NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idEntidad INT =(SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol)

	IF NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = @idDocumento)
		BEGIN
			RETURN
		END

	SELECT d.*
	,impuesto  = (SELECT TOP 1 si.descripcion FROM Recepcion.Doc_Impuesto_Temp i
											INNER JOIN Sri.Impuesto si ON i.codigo = si.codigo
														WHERE d.idDocumento = i.idDocumento 
														AND d.codigoPrincipal = i.codArticulo)
	,valorImpuesto  = (SELECT SUM(CONVERT(NUMERIC(18,2),i.valor)) FROM Recepcion.Doc_Impuesto_Temp i
														WHERE d.idDocumento = i.idDocumento 
														AND d.codigoPrincipal = i.codArticulo)
	
	,idDocumentoDetalle = ISNULL((SELECT TOP 1 dd.idDocumentoDetalle FROM Recepcion.DocumentoDetalle dd WHERE d.idArticulo = dd.idArticulo AND dd.idDocumento = d.idDocumento), 0) 

	,etiquetas = ISNULL((SELECT TOP 1 ee.idEtiqueta, ee.descripcion, ee.etiquetas
				  FROM Inventario.Etiqueta ee
			      WHERE ee.idEtiqueta IN (
					SELECT ar.idEtiqueta
					FROM Articulo ar
					WHERE ar.idArticulo = d.idArticulo
				) FOR JSON PATH), '[]')
	,datosAdicionales = ISNULL((SELECT top 1 ar.datosAdicionales FROM Articulo ar where ar.idArticulo = d.idArticulo), 0)
	FROM Recepcion.Doc_Detalle_Temp d
	WHERE d.idDocumento = @idDocumento
	ORDER BY d.idDetalle ASC
END
GO
