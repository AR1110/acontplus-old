USE [AcontPlus]
go
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
-- Create date: 2023-03-16
-- Description:	sp for get data to print
-- =============================================
 -- ApiPrinter.Impresion_Get 48, 
IF OBJECT_ID(N'ApiPrinter.Impresion_Get', N'P') IS NOT NULL
DROP PROCEDURE ApiPrinter.Impresion_Get
GO
CREATE PROCEDURE ApiPrinter.Impresion_Get @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	------DATA JSON PARAMETER-------------
	DECLARE @idDocument INT
	DECLARE @idTipoDocumento INT
	DECLARE @codEstab VARCHAR(50)
	DECLARE @nroIdentificacion VARCHAR(15)
	DECLARE @codDoc VARCHAR(5)
	------------END---------------------

	--------PARAMETER MANAGEMENT----------
	DECLARE @idUsuario INT
	DECLARE @SP VARCHAR(MAX)
    DECLARE @idImpresora INT
	DECLARE @ruc VARCHAR(15)
	DECLARE @rdlcProps VARCHAR(MAX)
	DECLARE @dataSources VARCHAR(MAX)
    DECLARE @estab VARCHAR(5)
	DECLARE @invoice VARCHAR(15) = 'Factura'
	DECLARE @note VARCHAR(15) = 'NotaEntrega'
	
	DECLARE @identificacion VARCHAR(15)
	------------END-----------------------
	
	-----DATA PRINTER SERVICE------
	DECLARE @printerName VARCHAR(100)
	DECLARE @computerName VARCHAR(100)
    DECLARE @printer VARCHAR(150)
    DECLARE @isThermal BIT
    DECLARE @format VARCHAR(200)
	DECLARE @urlPrinter VARCHAR(200)
    DECLARE @deviceInfo VARCHAR(max)
    DECLARE @copyPrint INT
	-------------END----------------

 
		SELECT @codEstab          = codEstab 
			  ,@idDocument        = idDocument
			  ,@codDoc            = codDoc
			  ,@nroIdentificacion = nroIdentificacion
			  ,@idTipoDocumento   = idTipoDocumento
		FROM OPENJSON(@json) 
		WITH (idDocument        INT          '$.idDocument'
		     ,idTipoDocumento   INT			 '$.idTipoDocumento'
			 ,codEstab          VARCHAR(50)  '$.codEstab'
			 ,codDoc            VARCHAR(5)   '$.codDoc'
			 ,nroIdentificacion VARCHAR(15)  '$.nroIdentificacion')

		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT @identificacion = nroIdentificacion FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

		SELECT  @ruc = ruc, @estab = estab FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab


		
		IF NOT EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab)
			BEGIN
				SELECT '0' code,'No tienes ninguna impresora configurada'  as 'message'
				RETURN 
			END


		IF EXISTS (SELECT  1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion)
			BEGIN
				IF @identificacion != @nroIdentificacion
					BEGIN
						SELECT '0' code,'Tu configuracion esta por usuario no puedes imprimir facturas de otro vendedor' as 'message'
						RETURN
					END 

				IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion AND codDoc = @codDoc)
					BEGIN
						SELECT TOP 1 
							@idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND nroIdentificacion = @nroIdentificacion 
						  AND codDoc            = @codDoc

					END 

			    IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion AND codDoc = 'A')
					BEGIN
						SELECT TOP 1 @idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND nroIdentificacion = @nroIdentificacion 
						  AND codDoc            = 'A'
					END 
			END 

		IF NOT EXISTS (SELECT  1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion)
			BEGIN
				IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND codDoc = @codDoc)
					BEGIN
						SELECT TOP 1 @idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND codDoc            = @codDoc

					END 

			    IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND codDoc = 'A')
					BEGIN
						SELECT TOP 1 @idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND codDoc            = 'A'
					END 
			END 

		--IF @idImpresora IS NULL	
		--	BEGIN
		--		SELECT '0'code,'No tienes configurado una impresora' as 'message'
		--		RETURN 
		--	END
			SELECT TOP 1 @urlPrinter = ipMaquina
		FROM ApiPrinter.Config_Document cd WITH (NOLOCK)
		INNER JOIN ApiPrinter.Impresora      i WITH (NOLOCK) ON i.idImpresora      = cd.idImpresora
		INNER JOIN ApiPrinter.TipoImpresora ti WITH (NOLOCK) ON ti.idTipoImpresora = i.idTipoImpresora
		WHERE  cd.codDoc = @codDoc
		AND i.codEstab = @codEstab 
		  AND cd.estado = 1  
	SET @rdlcProps = (SELECT
			 i.nombreImpresora printerName
			,i.nombreEquipo computerName
			,ti.descripcion
			,ti.isThermal
			,ti.formato
			,ti.deviceInfo
			,cd.copyPrint
			,i.ipMaquina
			,rdlcName = CASE @codDoc WHEN 'FV' THEN @invoice+ti.descripcion+'.rdl' 
		                                                 WHEN 'NE' THEN @note+ti.descripcion+'.rdl'
														 WHEN 'PR' THEN 'Proforma' + ti.descripcion +'.rdl'
														 END
		FROM ApiPrinter.Config_Document cd WITH (NOLOCK)
		INNER JOIN ApiPrinter.Impresora      i WITH (NOLOCK) ON i.idImpresora      = cd.idImpresora
		INNER JOIN ApiPrinter.TipoImpresora ti WITH (NOLOCK) ON ti.idTipoImpresora = i.idTipoImpresora
		WHERE  cd.codDoc = @codDoc
		AND i.codEstab = @codEstab 

		AND cd.estado = 1 FOR JSON PATH)

		SELECT  @dataSources = dataSources FROM ApiPrinter.Document_Data(@idDocument,@idTipoDocumento,@codDoc)

		--SET @rdlcProps = (SELECT rdlcName = CASE @codDoc WHEN 'FV' THEN @invoice+@printer+'.rdl' 
		--                                                 WHEN 'NE' THEN @note+@printer+'.rdl'
		--												 WHEN 'PR' THEN 'Proforma' + @printer +'.rdl'
		--												 END
		--						,computerName = @computerName 
		--						,printerName = @printerName	 
		--						,isThermal =@isThermal
		--						,'format' = @format
		--						,deviceInfo = @deviceInfo
		--				  FOR JSON PATH
		--				  ) 
		SELECT '1' code, payload = (SELECT 'http://' + @urlPrinter urlPrinter,  @rdlcProps rdlcProps, @dataSources dataSources FOR JSON PATH)
END
GO
