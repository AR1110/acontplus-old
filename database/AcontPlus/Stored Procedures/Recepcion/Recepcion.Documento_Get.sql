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
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA LISTAR LOS COMPROBANTES ELECTRONICOS DEL SRI IMPORTADOS
-- =============================================
--Recepcion.ASPComprobanteImportacionGet 38, '{"orderBy":"","sortBy":"","limit":10,"page":1,"codDoc":"01"}'
IF OBJECT_ID(N'Recepcion.Documento_Get ', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Documento_Get 
GO
CREATE PROCEDURE Recepcion.Documento_Get @idRol INT
,@json VARCHAR(MAX)
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	DECLARE @codEstab VARCHAR(50)
	DECLARE @codDoc VARCHAR(2)
	--DECLARE @pageNumber AS INT
	--DECLARE @rowsOfPage AS INT
	--DECLARE @sortBy AS VARCHAR(50)
	--DECLARE @orderBy AS VARCHAR(50)
	DECLARE @totalRecords AS INT
	DECLARE @startDate DATETIME
	DECLARE @endDate DATETIME
	DECLARE @tipo VARCHAR(1)
	--SET @@pageNumber=2
	--SET @@pageNumber=4 


	SELECT @codDoc = codDoc, @startDate = startDate, @endDate = endDate, @tipo = tipo --, @PageNumber = pageNumber, @rowsOfPage = limit, @orderBy= orderBy, @sortBy = sortBy
	FROM OPENJSON(@JSON) WITH(limit INT '$.limit'
							,pageNumber INT '$.page' 
							,orderBy VARCHAR(5) '$.orderBy'
							,sortBy VARCHAR(100) '$.sortBy'
							,codDoc VARCHAR(2) '$.codDoc'
							,startDate DATETIME '$.startDate'
							,endDate DATETIME '$.endDate'
							,tipo VARCHAR(1) '$.tipo'
							)
	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1


	IF @tipo = '1'
		BEGIN
			DECLARE @idEntidad INT 

			SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol
	
 
			SELECT * FROM SustentoTributario

			SELECT * FROM TiempoCredito WHERE idEntidad = @idEntidad AND gestion = 0

			SELECT * FROM CategoriaCompra WHERE idEntidad = @idEntidad

			SELECT * FROM Bodega WHERE codEstab = @codEstab

			SELECT * FROM Medida WHERE idEntidad = @idEntidad
			RETURN
		END


	IF LEN(@codDoc) > 1
		BEGIN
			SELECT @totalRecords = COUNT(*) FROM Recepcion.DocumentoRecibido
									WHERE codEstab = @codEstab
									AND codDoc = @codDoc

			SELECT [idDocumento], [codEstab], [comprobante], [codDoc], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], CASE WHEN xmlDoc IS NOT NULL THEN 1 ELSE 0 END hasXml
			,ISNULL(complete,0) complete
			,CASE WHEN xmlDoc IS NOT NULL AND complete = 0 THEN 'background-color: #5bc0de;' WHEN complete = 1 THEN 'background-color: #03a9f3;' ELSE '' END colorRow
			,CASE WHEN complete = 1 THEN '' ELSE '' END colorCol
				,CASE WHEN complete = 1 THEN 'Documento Importado' ELSE '' END hoverText
			,@totalRecords totalRecords
			FROM Recepcion.DocumentoRecibido
			WHERE codEstab = @codEstab
			AND codDoc = @codDoc
			AND CAST(fechaEmision AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE)
			ORDER BY fechaEmision DESC
			--CASE WHEN @sortBy = 'razonSocialEmisior' AND @orderBy = 'ASC' THEN razonSocialEmisior END ASC, 
			--CASE WHEN @sortBy = 'razonSocialEmisior' AND @orderBy = 'DESC' THEN razonSocialEmisior END DESC 
			--OFFSET (@pageNumber-1)*@rowsOfPage ROWS
			--FETCH NEXT @rowsOfPage ROWS ONLY
			RETURN
		END

	
	SELECT @totalRecords = COUNT(*) FROM Recepcion.DocumentoRecibido
									WHERE codEstab = @codEstab
	
	SELECT [idDocumento], [codEstab], [comprobante], [codDoc], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], CASE WHEN xmlDoc IS NOT NULL THEN 1 ELSE 0 END hasXml
	,ISNULL(complete,0) complete
	,CASE  WHEN xmlDoc IS NOT NULL AND complete = 0 THEN 'background-color: #5bc0de;' WHEN complete = 1 THEN 'background-color: #03a9f3; cursor: pointer;' ELSE '' END colorRow
	,CASE WHEN complete = 1 THEN '' ELSE '' END colorCol
		,CASE WHEN complete = 1 THEN 'Documento Importado' ELSE '' END hoverText
	,@totalRecords totalRecords
	FROM Recepcion.DocumentoRecibido
	WHERE codEstab = @codEstab
	AND CAST(fechaEmision AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE)
	ORDER BY fechaEmision DESC
	--CASE WHEN @sortBy = 'razonSocialEmisior' AND @orderBy = 'ASC' THEN razonSocialEmisior END ASC, 
	--CASE WHEN @sortBy = 'razonSocialEmisior' AND @orderBy = 'DESC' THEN razonSocialEmisior END DESC 
	--OFFSET (@pageNumber-1)*@rowsOfPage ROWS
	--FETCH NEXT @rowsOfPage ROWS ONLY
END
GO
