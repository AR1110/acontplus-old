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
 -- Config.Print_Get 369, '{"isPrint":1,"idDocument":158946,"codEstab":"ESTAB-000000249","codDoc":"NE","codigo":"RNEPT"}'

CREATE OR ALTER PROCEDURE Config.Print_Get @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	------DATA JSON PARAMETER-------------
	DECLARE @idDocument INT
	       ,@codEstab VARCHAR(50)
           ,@establecimientoId INT
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

	SET @establecimientoId = (SELECT idEstablecimiento FROM Sri.Establecimiento WHERE codEstab = @codEstab)
    
	IF NOT EXISTS (SELECT 1 FROM Config.Printer WITH (NOLOCK) WHERE EstablecimientoId = @establecimientoId AND [Enabled] = 1)
		BEGIN
			SELECT Common.ufnSpResponse ('0','No tienes ninguna impresora configurada', DEFAULT)
			RETURN 
		END

	SELECT TOP 1 @urlPrinter = IpAddress
	FROM Config.PrinterDocument     cd WITH (NOLOCK)
	INNER JOIN Config.Printer      i WITH (NOLOCK) ON i.Id      = cd.PrinterId AND i.[Enabled] = 1
	INNER JOIN Config.PrinterType ti WITH (NOLOCK) ON ti.Id = i.PrinterTypeId
	WHERE cd.codDoc  = @codDoc
	  AND i.EstablecimientoId = @establecimientoId 
	  AND cd.[Enabled]  = 1
	    AND (i.Machine IS NOT NULL AND LEN(LTRIM(RTRIM(i.Machine))) > 0)

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
					SET @rdlcParams = (SELECT logo = [filename], ContentType mimeType FROM Config.EstablecimientoLogo el INNER JOIN Sri.Establecimiento e ON el.EstablecimientoId = e.idEstablecimiento WHERE codEstab = @codEstab FOR JSON PATH)
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
									      END
						     ,hasParams = @hasParams
						     ,codDoc = CASE @codDoc WHEN 'IC' THEN 'MC'
												    WHEN 'EC' THEN 'MC'
												    WHEN 'A'  THEN 'A'
												    ELSE @codDoc
									   END 
                            ,@establecimientoId establecimientoId
                            ,@codEstab codEstab
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

	SELECT Common.ufnSpResponse ('1', 'Successful',
    (SELECT IIF(@urlPrinter = '127.0.0.1:9100', 'http://' + @urlPrinter, 'https://acontplusprint.com') as urlPrinter 
        ,@rdlcProps rdlcProps
        ,@dataSources dataSources
        ,@rdlcParams rdlcParams 
	FOR JSON PATH))

--SELECT payload = (SELECT @rdlcProps rdlcProps
--        ,@dataSources dataSources
--        ,@rdlcParams rdlcParams 
--	FOR JSON PATH, WITHOUT_aRRAY_WRAPPER)

END
GO
