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
-- Create date: 2023-02-13
-- Description: SP FOR GET DOCS RECEIVED TO DOWNLOAD XML FROM SRI
-- =============================================
--Recepcion.Doc_Service_Get 50
IF OBJECT_ID(N'Recepcion.Doc_Serv_Update ', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Doc_Serv_Update 
GO
CREATE PROCEDURE Recepcion.Doc_Serv_Update @idDocumento INT
,@downloaded VARCHAR(2)
,@codDoc VARCHAR(2)
,@versionComp VARCHAR(5)
,@fechaEmision VARCHAR(10)
,@xmlDoc XML
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT
	,@idProveedor INT 
	,@idEstadoPago INT
	,@idTipoIdentificacion INT
	,@identificacionCliProv VARCHAR(25)
	,@razonSocial VARCHAR(300)
	,@nombreComercial VARCHAR(300)
	,@direccion VARCHAR(300)
	,@rucReceptor VARCHAR(15)
	,@claveAcceso AS VARCHAR(50)
	,@comprobante VARCHAR(100)
	,@serieComprobante VARCHAR(50)
	,@importeTotal NUMERIC(18,5)

	SELECT TOP 1 @claveAcceso = claveAcceso FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento

	BEGIN TRY
		BEGIN TRAN
			

			IF (@codDoc = '01')
				BEGIN
					SELECT @razonSocial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/razonSocial)[1]','VARCHAR(300)')
					,@nombreComercial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
					,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/ruc)[1]','VARCHAR(13)')
					,@direccion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
					,@rucReceptor = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/identificacionComprador)[1]','VARCHAR(25)')
					,@comprobante = 'Factura'
					,@serieComprobante = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/estab)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/secuencial)[1]','VARCHAR(25)')
					,@importeTotal = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/importeTotal)[1]','NUMERIC(18,5)')
				END

			IF (@codDoc = '03')
				BEGIN
					SELECT @razonSocial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/razonSocial)[1]','VARCHAR(300)')
					,@nombreComercial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
					,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/ruc)[1]','VARCHAR(13)')
					,@direccion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
					,@rucReceptor = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoLiquidacionCompra/identificacionProveedor)[1]','VARCHAR(25)')
					,@comprobante = 'Liquidación de Compra'
						,@serieComprobante = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/estab)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/secuencial)[1]','VARCHAR(25)')
				END
			IF (@codDoc = '04')
				BEGIN
					SELECT @razonSocial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/razonSocial)[1]','VARCHAR(300)')
					,@nombreComercial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
					,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/ruc)[1]','VARCHAR(13)')
					,@direccion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
					,@rucReceptor = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/identificacionComprador)[1]','VARCHAR(25)')
					,@comprobante = 'Nota de Crédito'
						,@serieComprobante = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/estab)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/secuencial)[1]','VARCHAR(25)')
					,@importeTotal = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/importeTotal)[1]','NUMERIC(18,5)')
				END
			IF (@codDoc = '05')
				BEGIN
					SELECT @razonSocial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/razonSocial)[1]','VARCHAR(300)')
					,@nombreComercial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
					,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/ruc)[1]','VARCHAR(13)')
					,@direccion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
					,@rucReceptor = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoNotaDebito/identificacionComprador)[1]','VARCHAR(25)')
					,@comprobante = 'Nota de Débito'
						,@serieComprobante = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/estab)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/secuencial)[1]','VARCHAR(25)')
				END
			IF (@codDoc = '06')
				BEGIN
					SELECT @razonSocial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/razonSocial)[1]','VARCHAR(300)')
					,@nombreComercial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
					,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/ruc)[1]','VARCHAR(13)')
					,@direccion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
					,@rucReceptor = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoGuiaRemision/identificacionComprador)[1]','VARCHAR(25)')
					,@comprobante = 'Guía de Remisión'
					,@serieComprobante = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/estab)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/secuencial)[1]','VARCHAR(25)')
					,@importeTotal = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoGuiaRemision/importeTotal)[1]','NUMERIC(18,5)')
				END
			IF (@codDoc = '07')
				BEGIN
					SELECT @razonSocial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/razonSocial)[1]','VARCHAR(300)')
					,@nombreComercial = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
					,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/ruc)[1]','VARCHAR(13)')
					,@direccion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
					,@rucReceptor = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoCompRetencion/identificacionSujetoRetenido)[1]','VARCHAR(25)')
					,@comprobante = 'Comprobante de Retención'
					,@serieComprobante = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/estab)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
					+ '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/secuencial)[1]','VARCHAR(25)')
				END

			UPDATE dr SET dr.comprobante = @comprobante
			,dr.codDoc = @codDoc
			,dr.serieComprobante = @serieComprobante
			,dr.rucEmisor = @identificacionCliProv
			,dr.razonSocialEmisior = @razonSocial
			,fechaEmision = @fechaEmision
			,fechaAutorizacion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion')))).value('(/autorizacion/fechaAutorizacion)[1]','VARCHAR(49)')
			,dr.tipoEmision = 'NORMAL'
			,dr.identificacionReceptor = @rucReceptor
			,dr.numeroAutorizacion = @claveAcceso
			,dr.importeTotal = @importeTotal
			,dr.xmlDoc = @xmlDoc
			,dr.downloaded = @downloaded
			,versionComp = @versionComp
			FROM Recepcion.DocumentoRecibido dr WITH (ROWLOCK)
			WHERE idDocumento = @idDocumento


			IF (@codDoc != '07')
				BEGIN
					SET @identificacionCliProv = (SELECT LTRIM(RTRIM(@identificacionCliProv)))

					SET @idTipoIdentificacion = (SELECT CASE 
													WHEN LEN(@identificacionCliProv) = 10 THEN (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion
																																WHERE codigoSri = '05')
													WHEN LEN(@identificacionCliProv) = 13 THEN (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion
																																WHERE codigoSri = '04')
													WHEN LEN(@identificacionCliProv) < 10 OR LEN(@identificacionCliProv) > 13 THEN (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion
																																WHERE codigoSri = '06')
												END)


					IF LEN(LTRIM(RTRIM(@rucReceptor))) = 13
						BEGIN
							IF EXISTS (SELECT 1 FROM Entidad WHERE LTRIM(RTRIM(ruc)) = LTRIM(RTRIM(@rucReceptor)))
								BEGIN
									SET @idEntidad = (SELECT TOP 1 idEntidad FROM Entidad WHERE LTRIM(RTRIM(ruc)) = LTRIM(RTRIM(@rucReceptor)) AND estado = 1)
							
									IF NOT EXISTS(SELECT 1 FROM Proveedor WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@identificacionCliProv)))
										BEGIN
											INSERT INTO Proveedor(idTipoIdentificacion, nombreFiscal, nombreComercial, numeroIdentificacion, direccion, idEntidad)
											VALUES (@idTipoIdentificacion,@razonSocial, @nombreComercial, @identificacionCliProv, @direccion, @idEntidad)
										END
								END
						END
					IF LEN(LTRIM(RTRIM(@rucReceptor))) = 10
						BEGIN
							IF EXISTS (SELECT 1 FROM Entidad WHERE LTRIM(RTRIM(ruc)) = LTRIM(RTRIM(@rucReceptor)))
								BEGIN
						
									SET @idEntidad = (SELECT TOP 1 idEntidad FROM Entidad WHERE LTRIM(RTRIM(ruc)) = LTRIM(RTRIM(@rucReceptor)) AND estado = 1)
							
									IF NOT EXISTS(SELECT 1 FROM Proveedor WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@identificacionCliProv)))
										BEGIN
											INSERT INTO Proveedor(idTipoIdentificacion, nombreFiscal, nombreComercial, numeroIdentificacion, direccion, idEntidad)
											VALUES (@idTipoIdentificacion,@razonSocial, @nombreComercial, @identificacionCliProv, @direccion, @idEntidad)
										END
								END
							IF EXISTS (SELECT 1 FROM Entidad WHERE LTRIM(RTRIM(ruc)) = LTRIM(RTRIM(@rucReceptor+'001')))
								BEGIN
						
									SET @idEntidad = (SELECT TOP 1 idEntidad FROM Entidad WHERE LTRIM(RTRIM(ruc)) = LTRIM(RTRIM(@rucReceptor+'001')) AND estado = 1)
							
									IF NOT EXISTS(SELECT 1 FROM Proveedor WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@identificacionCliProv)))
										BEGIN
											INSERT INTO Proveedor(idTipoIdentificacion, nombreFiscal, nombreComercial, numeroIdentificacion, direccion, idEntidad)
											VALUES (@idTipoIdentificacion,@razonSocial, @nombreComercial, @identificacionCliProv, @direccion, @idEntidad)
										END
								END
						END
				END
				
				--===========================================================Contabilidad=================================================================================================
			
				SELECT TOP 1 @idProveedor = pr.idProveedor FROM dbo.Proveedor pr WITH (NOLOCK) WHERE pr.numeroIdentificacion = @identificacionCliProv AND pr.idEntidad = @idEntidad

				SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago ep WHERE ep.codigo = 'PE'


				IF NOT EXISTS (SELECT 1 FROM Contabilidad.CuentaPorPagar WHERE uniqueId = @claveAcceso)
					BEGIN 
						INSERT INTO Contabilidad.CuentaPorPagar
							  (idEstablecimiento,idProveedor,idEstadoPago,codDoc,uniqueId,serieComprobante,identificacion,fechaEmision,importeTotal,idEntidad,idUsuario)
						SELECT idEstablecimiento,@idProveedor,@idEstadoPago,codDoc,claveAcceso,serieComprobante,@identificacionCliProv,CONVERT (date, fechaEmision, 103),importeTotal,@idEntidad,dr.idUsuario
						FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
						WHERE dr.idDocumento = @idDocumento AND dr.codDoc = '01'
					END 

		COMMIT TRAN
	END TRY
	BEGIN CATCH
 		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
 		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate])
		VALUES (NEWID(), 'DocumentoService/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador())
	END CATCH 

END
GO
