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
CREATE PROCEDURE ApiPrinter.Impresion_Get @idUsuarioRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	------DATA JSON PARAMETER-------------
	DECLARE @idDocument INT
	       ,@codEstab VARCHAR(50)
	       ,@codDoc VARCHAR(5)
	------------END---------------------

	--------PARAMETER MANAGEMENT----------
	DECLARE @rdlcProps VARCHAR(MAX)
	       ,@rdlcParams VARCHAR(MAX)
	       ,@dataSources VARCHAR(MAX)
	------------END-----------------------
	
	-----DATA PRINTER SERVICE------
	DECLARE @urlPrinter VARCHAR(200)
           ,@totalThermalPrinters INT
	       ,@totalInyectionPrinters INT
	       ,@hasParams BIT = 0
	-------------END----------------

	SELECT @codEstab  = codEstab , @idDocument = idDocument, @codDoc= codDoc 
    FROM OPENJSON(@json) WITH (idDocument INT  '$.idDocument' ,codEstab VARCHAR(50) '$.codEstab',codDoc VARCHAR(5) '$.codDoc')

		
	IF NOT EXISTS (SELECT 1 FROM ApiPrinter.Impresora WITH (NOLOCK) WHERE codEstab = @codEstab)
		BEGIN
			SELECT '0' code,'No tienes ninguna impresora configurada'  as 'message'
			RETURN 
		END

	SELECT TOP 1 @urlPrinter = ipMaquina
	FROM ApiPrinter.Config_Document     cd WITH (NOLOCK)
	INNER JOIN ApiPrinter.Impresora      i WITH (NOLOCK) ON i.idImpresora      = cd.idImpresora
	INNER JOIN ApiPrinter.TipoImpresora ti WITH (NOLOCK) ON ti.idTipoImpresora = i.idTipoImpresora
	WHERE cd.codDoc  = @codDoc
	  AND i.codEstab = @codEstab 
	  AND cd.estado  = 1
	    AND (i.nombreEquipo IS NOT NULL AND LEN(LTRIM(RTRIM(i.nombreEquipo))) > 0)

	SELECT @totalThermalPrinters   = (SELECT COUNT(*) FROM v_Impresora ii WITH (NOLOCK) WHERE  ii.idImpresora = i.idImpresora AND ii.codImpresora = 'TE')  
	      ,@totalInyectionPrinters = (SELECT COUNT(*) FROM v_Impresora ii WITH (NOLOCK) WHERE  ii.idImpresora = i.idImpresora AND ii.codImpresora = 'AT')  
	FROM ApiPrinter.Config_Document cd WITH (NOLOCK)
	INNER JOIN v_Impresora           i WITH (NOLOCK) ON i.idImpresora = cd.idImpresora
	 WHERE cd.codDoc  = @codDoc
	   AND i.codEstab = @codEstab 
	   AND cd.estado  = 1 

	IF (@totalThermalPrinters = 0 AND @totalInyectionPrinters > 0)
		BEGIN 
			IF EXISTS (SELECT 1 FROM Config.Estab_Logo WHERE codEstab = @codEstab)		
				BEGIN
					SET @hasParams = 1
					SET @rdlcParams = (SELECT logo = nombreImagen, mimeType FROM Config.Estab_Logo WHERE codEstab = @codEstab FOR JSON PATH)
				END
			ELSE
				BEGIN
					SET @rdlcParams = 'undefined'
				END
		END

	IF (@totalThermalPrinters > 0 AND @totalInyectionPrinters > 0)
		BEGIN 
			IF EXISTS (SELECT 1 FROM Config.Estab_Logo WHERE codEstab = @codEstab)		
				BEGIN
					SET @hasParams = 1
					SET @rdlcParams = (SELECT logo = nombreImagen, mimeType FROM Config.Estab_Logo WHERE codEstab = @codEstab FOR JSON PATH)
				END
			ELSE
				BEGIN
					SET @rdlcParams = 'undefined'
				END
		END
	
	SET @rdlcProps = (
					    SELECT i.nombreImpresora printerName
						      ,i.nombreEquipo computerName
						      ,ti.descripcion
						      ,ti.isThermal
						      ,ti.formato
						      ,ti.deviceInfo
						      ,cd.copyPrint
						      ,i.ipMaquina
						      ,rdlcName = CASE @codDoc WHEN 'FV' THEN 'Factura'       + ti.descripcion + '.rdl' 
		                                               WHEN 'NE' THEN 'NotaEntrega'   + ti.descripcion + '.rdl'
													   WHEN 'PR' THEN 'Proforma'      + ti.descripcion + '.rdl'
													   WHEN 'IC' THEN 'IngresoEgreso' + ti.descripcion + '.rdl'
													   WHEN 'EC' THEN 'IngresoEgreso' + ti.descripcion + '.rdl'
													   WHEN 'A'  THEN 'Anticipo'      + ti.descripcion + '.rdl'
									      END
						     ,hasParams = @hasParams
						     ,codDoc = CASE @codDoc WHEN 'IC' THEN 'MC'
												    WHEN 'EC' THEN 'MC'
												    WHEN 'A'  THEN 'A'
												    ELSE ''
									   END 
 						FROM ApiPrinter.Config_Document     cd WITH (NOLOCK)
						INNER JOIN ApiPrinter.Impresora      i WITH (NOLOCK) ON i.idImpresora      = cd.idImpresora
						INNER JOIN ApiPrinter.TipoImpresora ti WITH (NOLOCK) ON ti.idTipoImpresora = i.idTipoImpresora
						WHERE cd.codDoc    = @codDoc
						    AND i.codEstab = @codEstab 
						    AND cd.estado  = 1
                            AND (i.nombreEquipo IS NOT NULL AND LEN(LTRIM(RTRIM(i.nombreEquipo))) > 0)
                            FOR JSON PATH
					 )
	
	SELECT  @dataSources = dataSources FROM ApiPrinter.Document_Data(@idDocument,@codDoc)

	SELECT '1' code, payload = (SELECT IIF(@urlPrinter = '127.0.0.1:9100','http://' + @urlPrinter  ,'https://acontplusprint.com:9200') as urlPrinter ,  @rdlcProps rdlcProps, @dataSources dataSources, @rdlcParams rdlcParams 
	FOR JSON PATH)
END
GO
