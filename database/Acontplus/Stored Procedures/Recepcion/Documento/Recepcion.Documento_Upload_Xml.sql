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
-- Create date: 2023-05-28
-- Description: SP FOR GET DOCS RECEIVED TO DOWNLOAD XML FROM SRI
-- =============================================
--Recepcion.Doc_Service_Get 50

CREATE OR ALTER PROCEDURE Recepcion.Documento_Upload_Xml @idUsuarioRol INT
,@json VARCHAR(1000)
,@codDoc VARCHAR(2)
,@claveAcceso AS VARCHAR(49)
,@versionComp VARCHAR(5)
,@fechaEmision VARCHAR(10)
,@xmlDoc XML
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT ,@ruc VARCHAR(20)
	,@idProveedor INT 
	,@idEstadoPago INT
	,@idTipoIdentificacion INT
	,@identificacionCliProv VARCHAR(25)
	,@razonSocial VARCHAR(300)
	,@nombreComercial VARCHAR(300)
	,@direccion VARCHAR(300)
	,@rucReceptor VARCHAR(15)
	,@comprobante VARCHAR(100)
	,@serieComprobante VARCHAR(50)
	,@importeTotal NUMERIC(18,5)
	,@idUsuario INT
	,@codEstab  VARCHAR(50)
	,@idEstab INT
	,@idDocumento INT
    ,@tipoIdentificacion VARCHAR(20)

	BEGIN TRY
        
        --> Recuperndo Informacion
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago ep WHERE ep.codigo = 'PE'

        SELECT TOP 1 @ruc = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
	
        SELECT  @codEstab = codEstab FROM OPENJSON(@json) WITH(codEstab VARCHAR(100) '$.codEstab')
	
        SELECT TOP 1 @idEstab = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

        IF (@codDoc = '01')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Factura'
				      ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/secuencial)[1]','VARCHAR(25)')
				      ,@importeTotal          = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/importeTotal)[1]','NUMERIC(18,5)')
                      ,@tipoIdentificacion    = CONVERT(xml,dbo.f_sanitize_xml(convert(VARCHAR(max), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/tipoIdentificacionComprador)[1]','VARCHAR(20)')
			END

		IF (@codDoc = '03')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoLiquidacionCompra/identificacionProveedor)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Liquidación de Compra'
					  ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/secuencial)[1]','VARCHAR(25)')
			END

		IF (@codDoc = '04')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Nota de Crédito'
					  ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/secuencial)[1]','VARCHAR(25)')
				      ,@importeTotal          = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/importeTotal)[1]','NUMERIC(18,5)')
                      ,@tipoIdentificacion    = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/tipoIdentificacionComprador)[1]','VARCHAR(20)')

			END

		IF (@codDoc = '05')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoNotaDebito/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Nota de Débito'
					  ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/secuencial)[1]','VARCHAR(25)')
			END

		IF (@codDoc = '06')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoGuiaRemision/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Guía de Remisión'
				      ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/secuencial)[1]','VARCHAR(25)')
				      ,@importeTotal          = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoGuiaRemision/importeTotal)[1]','NUMERIC(18,5)')
			END

		IF (@codDoc = '07')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoCompRetencion/identificacionSujetoRetenido)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Comprobante de Retención'
				      ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/secuencial)[1]','VARCHAR(25)')
                      ,@tipoIdentificacion    = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoCompRetencion/tipoIdentificacionSujetoRetenido)[1]','VARCHAR(20)')
                     
			END

        IF @codDoc != '07' 
            BEGIN
                SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = @tipoIdentificacion
             END

        --> Validacion de informacion 
        IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE claveAcceso = @claveAcceso)
            BEGIN
                SELECT '0' code, 'El comprobante ya se encuentra importado' as 'message'
                RETURN 
            END 

        IF @ruc != @rucReceptor
            BEGIN
                SELECT '0'code,'El comprobante no pertenece al Contribuyente' + ' ' +  @ruc as 'message'
                RETURN
            END 

        IF @ruc != @rucReceptor + IIF(LEN(@rucReceptor) = 10,'001','')
            BEGIN
                SELECT '0'code,'El comprobante no pertenece al Contribuyente' + ' ' +  @ruc as 'message' 
                RETURN
            END 

		BEGIN TRAN
			INSERT  INTO Recepcion.DocumentoRecibido
                (idEstablecimiento, [codEstab], [comprobante], [codDoc], [serieComprobante], [rucEmisor], [razonSocialEmisior],[fechaEmision], [fechaAutorizacion],[tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], xmlCompressed, [versionComp], [idUsuario], [fechaRegistro], downloaded)
			VALUES(@idEstab, @codEstab, @comprobante, @codDoc, @serieComprobante, @identificacionCliProv
			, @razonSocial, @fechaEmision,  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion')))).value('(/autorizacion/fechaAutorizacion)[1]','VARCHAR(49)')
			, 'NORMAL', @rucReceptor, @claveAcceso, @claveAcceso, @importeTotal, COMPRESS(CONVERT(VARBINARY(MAX), @xmlDoc)), @versionComp, @idUsuario, dbo.ufnGetDateEcuador(), 'DE')

			SET @idDocumento = @@IDENTITY

			IF (@codDoc != '07')
				BEGIN	
					IF NOT EXISTS(SELECT 1 FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@identificacionCliProv)))
						BEGIN
							INSERT INTO Proveedor WITH (ROWLOCK)
                                   (idTipoIdentificacion, nombreFiscal, nombreComercial, numeroIdentificacion, direccion, idEntidad)
							SELECT @idTipoIdentificacion,@razonSocial, @nombreComercial, @identificacionCliProv, @direccion, @idEntidad

                            SELECT @idProveedor = SCOPE_IDENTITY()
						END
                    ELSE 
                        BEGIN
                            SELECT @idProveedor = @idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@identificacionCliProv)) 
                        END 
				END
				--> Contabilidad
	
				IF NOT EXISTS (SELECT 1 FROM Contabilidad.CuentaPorPagar WHERE uniqueId = @claveAcceso)
					BEGIN 
						INSERT INTO Contabilidad.CuentaPorPagar
							   (idDocumento,idEstablecimiento, idProveedor, idEstadoPago,codDoc,uniqueId,serieComprobante,identificacion,fechaEmision,importeTotal,idEntidad,idUsuario)
						SELECT @idDocumento,idEstablecimiento,@idProveedor,@idEstadoPago,codDoc,claveAcceso,serieComprobante,@identificacionCliProv,CONVERT (date, fechaEmision, 103),importeTotal,@idEntidad,dr.idUsuario
						FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
						WHERE dr.idDocumento = @idDocumento 
                          AND dr.codDoc = '01'
					END 
		COMMIT TRAN
        SELECT '1' code, 'Registrado Exitosamente' as 'message'
	END TRY
	BEGIN CATCH
 		IF (@@TRANCOUNT > 0)
            BEGIN 
			    ROLLBACK TRAN
		    END 
        DECLARE @method VARCHAR(200)
        SELECT '0' code, 'Error en el procedimiento' as 'message'
 		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate])
		VALUES (NEWID(), 'DocumentoService/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador())
	END CATCH 

END
GO
