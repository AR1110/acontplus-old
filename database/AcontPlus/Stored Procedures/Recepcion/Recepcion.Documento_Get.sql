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
-- Recepcion.Documento_Get 63, '{"orderBy":"","sortBy":"","limit":50,"page":1,"codDoc":"","codEstab":"ESTAB-000000006","startDate":"2023-04-01T05:00:00.000Z","endDate":"2023-05-01T04:59:59.999Z","rucProveedor":"0990017514001"}'
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
	--DECLARE @totalRecords AS INT
	DECLARE @startDate DATETIME
	DECLARE @endDate DATETIME
	DECLARE @tipo VARCHAR(1)
	DECLARE @claveAcceso VARCHAR(50)
	DECLARE @idDocumento INT
	,@rucProveedor VARCHAR(25)

	DECLARE @params NVARCHAR(max) = '@codEstab VARCHAR(50)
									,@codDoc VARCHAR(2)
									,@startDate DATETIME
									,@endDate DATETIME
									,@rucProveedor VARCHAR(25) '
	DECLARE @sql NVARCHAR(MAX)





	--SET @@pageNumber=2
	--SET @@pageNumber=4 
	SELECT @codDoc = codDoc
		,@startDate = startDate
		,@endDate = endDate
		,@tipo = tipo --, @PageNumber = pageNumber, @rowsOfPage = limit, @orderBy= orderBy, @sortBy = sortBy
		,@claveAcceso = claveAcceso
		,@idDocumento = idDocumento
		,@codEstab = codEstab
		,@rucProveedor = rucProveedor 
	FROM OPENJSON(@JSON) WITH (
			limit INT '$.limit'
			,pageNumber INT '$.page'
			,orderBy VARCHAR(5) '$.orderBy'
			,sortBy VARCHAR(100) '$.sortBy'
			,codDoc VARCHAR(2) '$.codDoc'
			,startDate DATETIME '$.startDate'
			,endDate DATETIME '$.endDate'
			,tipo VARCHAR(1) '$.tipo'
			,idDocumento INT '$.idDocumento'
			,claveAcceso VARCHAR(50) '$.claveAcceso'
			,codEstab VARCHAR(50) '$.codEstab'
			,rucProveedor VARCHAR(25) '$.rucProveedor'
			)

	SELECT @idUsuario = idUsuario
	FROM App.UsuarioRol WITH (NOLOCK)
	WHERE idUsuarioRol = @idRol

	--SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1
	IF @tipo = '1'
	BEGIN
		DECLARE @idEntidad INT

		SELECT @idEntidad = idEntidad
		FROM App.UsuarioRol WITH (NOLOCK)
		WHERE idUsuarioRol = @idRol

		SELECT *
		FROM SustentoTributario WITH (NOLOCK)

		SELECT *
		FROM TiempoCredito WITH (NOLOCK)
		WHERE idEntidad = @idEntidad
			AND gestion = 0

		SELECT *
		FROM CategoriaCompra WITH (NOLOCK)
		WHERE idEntidad = @idEntidad

		SELECT *
		FROM Bodega WITH (NOLOCK)
		WHERE codEstab IN (SELECT codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol)

		SELECT *
		FROM Medida WITH (NOLOCK)
		WHERE idEntidad = @idEntidad

		RETURN
	END

	--Documento Relacionado 
	IF @tipo = 3
	BEGIN
		IF @codDoc = '01'
		BEGIN
			SELECT comprobante = 'Retención'
				,serieComprobante = rAts.estab + rAts.ptoEmi + Helper.F_Auto_Sequential(rAts.secuencial)
				,rucEmisor = rAts.identificacionSujetoRetenido
				,razonSocialEmisior = rAts.razonSocialSujetoRetenido
				,fechaEmision = CONVERT(NVARCHAR, FORMAT(rAts.fechaEmision, 'dd/MM/yyyy HH:mm'))
				,rAts.claveAcceso
				,importeTotal = 0
			FROM FactElect.RetAtsDocSustento retDoc
			INNER JOIN FactElect.RetencionAts rAts ON rAts.idRetencionAts = retDoc.idRetencionAts
			WHERE retDoc.numAutDocSustento = @claveAcceso
			RETURN
		END

		IF @codDoc = '04'
		BEGIN
			SELECT comprobante
				,serieComprobante
				,rucEmisor
				,razonSocialEmisior
				,fechaEmision
				,claveAcceso
				,importeTotal
			FROM (
				SELECT comprobante
					,serieComprobante
					,rucEmisor
					,razonSocialEmisior
					,fechaEmision
					,claveAcceso
					,importeTotal
					,Replace(serieComprobante, '-', '') AS numDocSustento
				FROM Recepcion.DocumentoRecibido
				) t
			WHERE t.numDocSustento = (
					SELECT numDocSustento
					FROM FactElect.DocRelacionado WITH (NOLOCK)
					WHERE codDocSustento = '01'
						AND idDocumentoRecibido = @idDocumento
					)
			RETURN
		END
	END

	SET @sql = 'SELECT [idDocumento]
		,[codEstab]
		,[comprobante]
		,[codDoc]
		,[serieComprobante]
		,[rucEmisor]
		,[razonSocialEmisior]
		,[fechaEmision]
		,[fechaAutorizacion]
		,[tipoEmision]
		,[identificacionReceptor]
		,[claveAcceso]
		,[numeroAutorizacion]
		,[importeTotal]
		,CASE 
			WHEN xmlDoc IS NOT NULL
				THEN 1
			ELSE 0
			END hasXml
		,ISNULL(complete, 0) complete
		,CASE 
			WHEN xmlDoc IS NOT NULL
				AND complete = 0
				THEN ''background-color: #FFF5BD;''
			WHEN complete = 1
				THEN ''background-color: #03a9f3; cursor: pointer;''
			ELSE ''''
			END colorRow
		,CASE 
			WHEN complete = 1
				THEN ''background-color: #03a9f3;''
			ELSE ''''
			END colorCol
		,CASE 
			WHEN complete = 1
				THEN ''Documento Importado''
			ELSE ''''
			END hoverText
	FROM Recepcion.DocumentoRecibido WITH (NOLOCK)
	WHERE codEstab = @codEstab
		AND CAST(fechaEmision AS DATE) BETWEEN CAST(@startDate AS DATE)
			AND CAST(@endDate AS DATE) '

	IF LEN(@codDoc) > 1
	BEGIN
		SET @sql = @sql + 'AND codDoc = @codDoc '

		IF LEN(LTRIM(RTRIM(@rucProveedor))) > 0
		BEGIN
			SET @sql = @sql + 'AND rucEmisor = @rucProveedor '
		END
	END

	IF LEN(LTRIM(RTRIM(@rucProveedor))) > 0
	BEGIN
		SET @sql = @sql + 'AND rucEmisor = @rucProveedor '
	END

	EXEC sp_executesql @sql
		,@params
		,@codEstab = @codEstab
		,@codDoc = @codDoc
		,@startDate = @startDate
		,@endDate = @endDate
		,@rucProveedor = @rucProveedor
END
GO


