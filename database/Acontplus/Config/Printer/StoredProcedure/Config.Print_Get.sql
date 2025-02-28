USE [AcontPlus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-03-16
-- Description:	sp for get data to print
-- =============================================

CREATE OR ALTER PROCEDURE Config.Print_Get @userRoleId INT
	,@json VARCHAR(MAX)
    ,@isMobileUserAgent BIT = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	------DATA JSON PARAMETER-------------
	DECLARE @idDocument INT
            ,@documentoId INT
	       ,@codEstab VARCHAR(50)
           ,@establecimientoId INT
	       ,@codDoc VARCHAR(5)
           ,@getUrlPrintServer BIT = 0
           ,@orderId INT;
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
           ,@logoName VARCHAR(300)
           ,@logoMimeType VARCHAR(300)
	-------------END----------------

	SELECT @codEstab = codEstab
        ,@idDocument = idDocument
        ,@documentoId = documentoId
        ,@codDoc= codDoc 
        ,@getUrlPrintServer = getUrlPrintServer
        ,@orderId = id
    FROM OPENJSON(@json) WITH (
                                idDocument INT  '$.idDocument',
                                documentoId INT '$.documentoId',
                                codEstab VARCHAR(50) '$.codEstab',
                                codDoc VARCHAR(5) '$.codDoc',
                                getUrlPrintServer BIT,
                                id INT
                              )

	SET @establecimientoId = (SELECT idEstablecimiento FROM Sri.Establecimiento WITH(NOLOCK) WHERE codEstab = @codEstab)

    --DE RESTAURANTE SOLO LLEGA TIPO 2
    IF (@codDoc IN ('OR', 'ORC') OR @orderId > 0)
        BEGIN
            SET @establecimientoId = (SELECT EstablecimientoId FROM Restaurant.[Order] WITH(NOLOCK) WHERE id = @orderId)
        END

      --TEMPORAL --> VARIABLES HECHO LEÑA EN FRONT
     IF (@idDocument = 0 OR @idDocument IS NULL)
                BEGIN
                    SET @idDocument = @documentoId
                END


	IF NOT EXISTS (SELECT 1 FROM Config.Printer p WITH (NOLOCK)
        INNER JOIN Config.PrinterDocument pd ON p.Id = pd.PrinterId 
    WHERE p.EstablecimientoId = @establecimientoId AND pd.codDoc = @codDoc AND p.[Enabled] = 1)
		BEGIN
			SELECT '0','No tienes ninguna impresora configurada para este tipo de documento' as 'message'
			RETURN 
		END

	SELECT TOP 1 @urlPrinter = IIF(@isMobileUserAgent = 1, IpAddress, p.Domain)
	FROM Config.PrinterDocument     cd WITH (NOLOCK)
	INNER JOIN Config.Printer      p WITH (NOLOCK) ON p.Id      = cd.PrinterId
    AND p.[Enabled] = 1
	INNER JOIN Config.PrinterType ti WITH (NOLOCK) ON ti.Id = p.PrinterTypeId
	WHERE cd.codDoc  = @codDoc
	  AND p.EstablecimientoId = @establecimientoId 
	  AND cd.[Enabled]  = 1
    
    IF (@urlPrinter IS NULL OR LEN(LTRIM(RTRIM(@urlPrinter))) = 0)
        BEGIN
			SELECT '0','No se pudo obtener la ' as 'message'
			RETURN 
		END

    IF @getUrlPrintServer = 1
        BEGIN
            SELECT '1' code, payload = IIF(@urlPrinter = '127.0.0.1:9100', 'http://' + @urlPrinter, 'https://' + @urlPrinter)
            RETURN
        END

    IF EXISTS (SELECT TOP 1 1 FROM Config.EstablecimientoLogo WHERE EstablecimientoId = @establecimientoId)
        BEGIN
            SELECT @logoName = @codEstab + '-' + CONVERT(VARCHAR, LatestVersion), @logoMimeType = ContentType 
            FROM Config.EstablecimientoLogo 
            WHERE EstablecimientoId = @establecimientoId
        END

	SELECT @totalThermalPrinters   = (SELECT COUNT(*) FROM Config.v_Printer ii WITH (NOLOCK) WHERE  ii.Id = i.Id AND ii.printerTypeCode = 'TE')  
	      ,@totalInyectionPrinters = (SELECT COUNT(*) FROM Config.v_Printer ii WITH (NOLOCK) WHERE  ii.Id = i.Id AND ii.printerTypeCode = 'AT')  
	FROM Config.PrinterDocument cd WITH (NOLOCK)
	INNER JOIN Config.v_Printer i WITH (NOLOCK) ON i.Id = cd.PrinterId
	WHERE cd.codDoc  = @codDoc
	   AND i.EstablecimientoId = @establecimientoId 
	   AND cd.[Enabled]  = 1 

	IF (@totalThermalPrinters = 0 AND @totalInyectionPrinters > 0)
		BEGIN 
			IF EXISTS (SELECT 1 FROM Config.EstablecimientoLogo el
                        INNER JOIN Sri.Establecimiento e ON el.EstablecimientoId = e.idEstablecimiento WHERE codEstab = @codEstab)		
				BEGIN
					SET @hasParams = 1
					SET @rdlcParams = (SELECT logo = [FileName], contentType mimeType FROM Config.EstablecimientoLogo el
                        INNER JOIN Sri.Establecimiento e ON el.EstablecimientoId = e.idEstablecimiento
                    WHERE codEstab = @codEstab FOR JSON PATH)
				END
			ELSE
				BEGIN
					SET @rdlcParams = 'undefined'
				END
		END

	IF (@totalThermalPrinters > 0 AND @totalInyectionPrinters > 0)
		BEGIN 
			IF EXISTS (SELECT 1 FROM Config.EstablecimientoLogo el INNER JOIN Sri.Establecimiento e ON el.EstablecimientoId = e.idEstablecimiento WHERE codEstab = @codEstab)		
				BEGIN
					SET @hasParams = 1
					SET @rdlcParams = (SELECT logo = [filename], ContentType mimeType FROM Config.EstablecimientoLogo el 
                    INNER JOIN Sri.Establecimiento e ON el.EstablecimientoId = e.idEstablecimiento WHERE codEstab = @codEstab FOR JSON PATH)
				END
			ELSE
				BEGIN
					SET @rdlcParams = 'undefined'
				END
		END
	
	SET @rdlcProps = (
					    SELECT i.[name] printerName
						      ,i.Machine computerName 
						      ,ti.Thermal isThermal
						      ,ti.formato
						      ,ti.deviceInfo
						      ,cd.copies copyPrint
                              ,CAST(ISNULL(i.serverDevice,0) AS bit) serverDevice
						      ,ISNULL(i.macAddress, '') macAddress
						      ,rdlcName = CASE @codDoc WHEN 'FV' THEN 'Factura'       + ti.[Name] + '.rdl' 
		                                               WHEN 'NE' THEN 'NotaEntrega'   + ti.[Name] + '.rdl'
													   WHEN 'PR' THEN 'Proforma'      + ti.[Name] + '.rdl'
													   WHEN 'IC' THEN 'IngresoEgreso' + ti.[Name] + '.rdl'
													   WHEN 'EC' THEN 'IngresoEgreso' + ti.[Name] + '.rdl'
													   WHEN 'A'  THEN 'Anticipo'      + ti.[Name] + '.rdl'
                                                       ELSE ''
									      END
						     ,hasParams = @hasParams
						     ,codDoc = CASE @codDoc WHEN 'IC' THEN 'MC'
												    WHEN 'EC' THEN 'MC'
												    WHEN 'A'  THEN 'A'
												    ELSE @codDoc
									   END 
                            ,@establecimientoId establecimientoId
                            ,ISNULL(@logoName, '') logoName
                            ,ISNULL(@logoMimeType, '') logoMimeType
 						FROM Config.PrinterDocument     cd WITH (NOLOCK)
						INNER JOIN Config.Printer      i WITH (NOLOCK) ON i.Id      = cd.PrinterId AND i.[Enabled] = 1
						INNER JOIN Config.PrinterType ti WITH (NOLOCK) ON ti.Id = i.PrinterTypeId
						WHERE cd.codDoc    = @codDoc
						    AND i.EstablecimientoId = @establecimientoId 
						    AND cd.[enabled]  = 1
                            AND (i.Machine IS NOT NULL AND LEN(LTRIM(RTRIM(i.Machine))) > 0)
                            FOR JSON PATH
					 )
	
   SELECT  @dataSources = dataSources FROM Config.Documento_To_Print(@idDocument,@codDoc)
   
   DECLARE @tblResponse AS TABLE (
        rdlcProps NVARCHAR(MAX),
        dataSources NVARCHAR(MAX),
        rdlcParams NVARCHAR(MAX), 
        docType VARCHAR(3));


    INSERT INTO @tblResponse (rdlcProps, dataSources, rdlcParams, docType)
	VALUES(@rdlcProps, @dataSources, @rdlcParams, @codDoc)

    IF NOT EXISTS (SELECT 1 FROM @tblResponse)
        BEGIN
            SELECT '0' code, 'No se pudo recuparar información del documento!'
            RETURN
        END

    SELECT '1' code, payload = (SELECT * FROM @tblResponse FOR JSON PATH)

END
GO