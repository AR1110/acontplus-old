USE [Acontplus]
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorCobrar_Get', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorCobrar_Get
GO
CREATE PROCEDURE Contabilidad.CuentaPorCobrar_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN

	DECLARE @idEntidad AS INT 
	DECLARE @tipo AS INT 
	DECLARE @idDocumento AS INT 
	DECLARE @idTipoDocumento AS INT 
	DECLARE @codDoc AS VARCHAR(5)

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @tipo = tipo,@idTipoDocumento = idTipoDocumento, @idDocumento = idDocumento FROM OPENJSON(@json) WITH (tipo INT '$.tipo',idDocumento INT '$.idDocumento', idTipoDocumento INT '$.idTipoDocumento')

	SELECT TOP 1 @codDoc = codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento
	

	-- ============================= Gestios de cuotas en los Documwentos ===============================================================
	IF @tipo = 2
		BEGIN
			
			-- ==== PARAMETER CONFIG ==========
			DECLARE @configInteres AS BIT
			DECLARE @porcentaje AS NUMERIC(18,5)
			DECLARE @precioFijo AS NUMERIC(18,5)
			DECLARE @tipoConfig AS VARCHAR(5)
			
			-- == PARAMETER TIEMPO CREDITO =====
			DECLARE @creditoContado BIT
			DECLARE @codEstado VARCHAR(5)

			DECLARE @tbCuotasInteres AS TABLE (
				 idCuotaXCobrar INT UNIQUE NOT NULL
				,nroCuota INT NOT NULL
				,cuota NUMERIC(15,5) NOT NULL
				,abono NUMERIC(15,5) NOT NULL
				,interes NUMERIC(15,5) NOT NULL
				,mora NUMERIC(15,5) NOT NULL
				,fechaVencimiento DATE NOT NULL
				,diasMora INT NOT NULL
				,estado VARCHAR(150) NOT NULL
				,codEstado VARCHAR(5) NOT NULL
			)

			SELECT @configInteres = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.configInteres')
			      ,@tipoConfig    = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.infoInteres.tipo')
				  ,@porcentaje    = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.infoInteres.porcentajeInteres')
				  ,@precioFijo    = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.infoInteres.precioFijo') 
			FROM config.sistema WITH (NOLOCK) WHERE codConfig = 'CV' AND idEntidad = @idEntidad

			-- ==================== PROCESO PAR CUANDO ESTE ACTIVADO LA CONFIGURACION =================================
			IF @configInteres = 1
				BEGIN
					
					IF @codDoc = 'FV'
						BEGIN
							SELECT TOP 1 @creditoContado = tc.tipo, @codEstado = ep.codigo
							FROM dbo.Factura             fe WITH (NOLOCK)
							INNER JOIN dbo.TiempoCredito tc WITH (NOLOCK) ON tc.idTiempoCredito = fe.idTiempoCredito
							INNER JOIN dbo.EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago    = fe.idEstadoPago
							WHERE fe.idFactura = @idDocumento
						END 

					IF @codDoc = 'NE'
						BEGIN
							SELECT TOP 1 @creditoContado = tc.tipo, @codEstado = ep.codigo
							FROM dbo.NotaEntrega         ne WITH (NOLOCK)
							INNER JOIN dbo.TiempoCredito tc WITH (NOLOCK) ON tc.idTiempoCredito = ne.idTiempoCredito
							INNER JOIN dbo.EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago    = ne.idEstadoPago
							WHERE ne.idNotaEntrega = @idDocumento
						END 

					-- ========================== documentos a credito ==================================================================================
					IF @creditoContado = 0 
						BEGIN
							-- === Calculo para sacar el interes de las cuotas segun su configuracion --------------------------------------
							IF @codEstado != 'CBR'
								BEGIN
									IF @tipoConfig = 'PI' OR @tipoConfig = 'PF'
										BEGIN 
											INSERT INTO @tbCuotasInteres(idCuotaXCobrar,nroCuota,cuota,abono,fechaVencimiento,diasMora,interes,mora,estado,codEstado)
											SELECT cx.idCuotaXCobrar
												  ,cx.nroCuota
												  ,cx.cuota
												  ,cx.abono
												  ,fechaVencimiento = cx.fechaVencimiento
												  ,diasMora         = CASE WHEN ep.codigo != 'CBR' THEN DATEDIFF(DAY,cx.fechaVencimiento,GETDATE()) ELSE 0 END 
												  ,interes          = CASE WHEN ep.codigo != 'CBR' THEN cx.saldo * @porcentaje  / 100 ELSE 0 END  
												  ,mora             = CASE WHEN ep.codigo != 'CBR' THEN cx.saldo * @porcentaje  / 100 * DATEDIFF(DAY,cx.fechaVencimiento,GETDATE()) ELSE 0 END  
												  ,ep.descripcion
												  ,ep.codigo
											FROM dbo.CuotaXCobrar     cx WITH (NOLOCK)
											INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago 
											WHERE cx.idComprobante = @idDocumento AND cx.idTipoDocumento = @idTipoDocumento AND cx.estado = 1
										END 
								END 
						END 
				END 

			
			-- ==================== PAYLOAD ===========================================================================
			IF @codDoc = 'FV'
				BEGIN
					SELECT TOP 1 cl.numeroIdentificacion
							    ,cl.nombreFiscal
								,fechaEmision     = FORMAT(fe.fechaEmision,'dd/MM/yyyy')
								,serieComprobante = es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(fe.nroFactura) 
								,importeTotal     = fe.total
								,fe.idTiempoCredito
								,codEstado        = ep.codigo 
								,config           = ISNULL(@configInteres,0)
								,tipoConfig       = @tipoConfig
					FROM dbo.Factura               fe WITH (NOLOCK)
					INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = fe.idCliente 
					INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = fe.idPuntoEmision
					INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
					INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago   = fe.idEstadoPago
					WHERE fe.idFactura = @idDocumento
				END 

			IF @codDoc = 'NE'
				BEGIN
					SELECT TOP 1 cl.numeroIdentificacion
							    ,cl.nombreFiscal
								,fechaEmision     = FORMAT(ne.fechaEmision,'dd/MM/yyyy')
								,serieComprobante = es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(ne.nroDocumento) 
								,importeTotal     = ne.total
								,ne.idTiempoCredito
								,codEstado        = ep.codigo 
								,config           = ISNULL(@configInteres,0) 
								,tipoConfig       = @tipoConfig
					FROM dbo.NotaEntrega           ne WITH (NOLOCK)
					INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = ne.idCliente 
					INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = ne.idPuntoEmision
					INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
					INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago   = ne.idEstadoPago
					WHERE ne.idNotaEntrega = @idDocumento
				END 
			
			SELECT idTiempoCredito,descripcion,diasCredito,numeroCuota,tiempoCredito = tipo FROM dbo.TiempoCredito WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 AND gestion = 1

			SELECT cx.idCuotaXCobrar
			      ,cx.nroCuota
				  ,cx.cuota
				  ,interes = 0
				  ,cx.diasMora
				  ,cx.mora
				  ,cx.abono
				  ,cx.saldo
				  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				  ,estado = ep.descripcion
				  ,codEstado = ep.codigo
			FROM dbo.CuotaXCobrar     cx WITH (NOLOCK)
			INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
			WHERE cx.idTipoDocumento = @idTipoDocumento AND  cx.idComprobante = @idDocumento AND cx.estado = 1
			ORDER BY cx.nroCuota ASC

			SELECT * FROM @tbCuotasInteres 

		END 
	
	-- ============================= Datos para cobros rapidos,lotes,credito ================================================================ 
	IF @tipo = 3
		BEGIN
			DECLARE @idCliente AS INT 
			DECLARE @codEstab AS VARCHAR(50)
			DECLARE @nombreFiscal AS VARCHAR(100)
			DECLARE @numeroIdentificacion AS VARCHAR(15)
			DECLARE @identificacionReceptor AS VARCHAR(50)
			DECLARE @tiempoCredito AS BIT
			DECLARE @fechaEmision AS DATE
			DECLARE @serieComprobante AS VARCHAR(20)
			
			DECLARE @tbDocuments AS TABLE (
			      id AS cast(idTipoDocumento as varchar) + cast(idDocumento as varchar) UNIQUE
				 ,idTipoDocumento INT NOT NULL
				 ,idDocumento INT NOT NULL
				 ,serieComprobante VARCHAR(20) NOT NULL
				 ,tipoDoc VARCHAR(5) NOT NULL
				 ,fechaEmision DATETIME NOT NULL
				 ,fechaVencimiento DATETIME NOT NULL
				 ,importeTotal NUMERIC(18,5) NOT NULL
				 ,abono NUMERIC(18,5) NOT NULL
				 ,saldo NUMERIC(18,5) NOT NULL
				 ,estado VARCHAR(100) NOT NULL
				 ,cuotas VARCHAR(MAX) NULL
			)

			DECLARE @cobroDocuments AS TABLE
			(
				idComprobante INT 
			   ,codDoc VARCHAR(5)
			   ,codMov VARCHAR(5)
			)

			DECLARE @documents AS TABLE (
				idDocumento BIGINT
			   ,idTipoDocumento BIGINT
			   ,serieComprobante VARCHAR(25)
			   ,saldo DECIMAL(15,5)
			   ,codDoc VARCHAR(100)
			   ,nroDoc VARCHAR(20)
			)

			SELECT TOP 1 @identificacionReceptor = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

			SELECT @idCliente = idCliente, @codEstab = codEstab, @tiempoCredito = credito FROM OPENJSON(@json) WITH (idCliente INT '$.idCliente', codEstab VARCHAR(50) '$.codEstab', credito BIT '$.credito')

			SELECT TOP 1 @numeroIdentificacion = numeroIdentificacion, @nombreFiscal = nombreFiscal FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente


			-- ====================================== Datos por lote se trae por cliente y establecimiento   ==================================================================
			IF @tiempoCredito IS NULL
				BEGIN 
					INSERT INTO @tbDocuments (idTipoDocumento,idDocumento,serieComprobante,tipoDoc,fechaEmision,fechaVencimiento,importeTotal,abono,saldo,estado,cuotas)
					SELECT fv.idTipoDocumento
						  ,fv.idFactura
						  ,es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(fv.nroFactura) 
						  ,'FV'
						  ,fechaEmision
						  ,fechaVencimiento
						  ,fv.total
						  ,fv.abono
						  ,fv.saldo
						  ,ep.descripcion
						  ,cuotas = (
						             SELECT cc.idTipoDocumento
									       ,idDocumento = cc.idComprobante
										   ,cc.idCuotaXCobrar
										   ,cc.nroCuota
										   ,cc.cuota
										   ,cc.abono
										   ,cc.saldo
										   ,estado = ep.descripcion
						             FROM dbo.CuotaXCobrar     cc WITH (NOLOCK)
									 INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cc.idEstadoPago
						             WHERE cc.idComprobante   = fv.idFactura 
									   AND cc.idTipoDocumento = fv.idTipoDocumento 
									   AND cc.estado          = 1 
									   AND ep.codigo         IN ('PE','PP')
									   FOR JSON PATH
									 )
					FROM dbo.Factura               fv WITH (NOLOCK) 
					INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = fv.idPuntoEmision
					INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
					INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago   = fv.idEstadoPago
					WHERE fv.idCliente = @idCliente AND ep.codigo IN ('PP','PE') AND es.codEstab = @codEstab 


					INSERT INTO @tbDocuments (idTipoDocumento,idDocumento,serieComprobante,tipoDoc,fechaEmision,fechaVencimiento,importeTotal,abono,saldo,estado,cuotas)
					SELECT ne.idTipoDocumento
						  ,ne.idNotaEntrega
						  ,es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(ne.nroDocumento) 
						  ,'NE'
						  ,fechaEmision
						  ,fechaVencimiento
						  ,ne.total
						  ,ne.abono
						  ,ne.saldo
						  ,ep.descripcion
						  ,cuotas = (
						             SELECT cc.idTipoDocumento
									       ,idDocumento = cc.idComprobante
										   ,cc.idCuotaXCobrar
										   ,cc.nroCuota
										   ,cc.cuota
										   ,cc.abono
										   ,cc.saldo
										   ,estado = ep.descripcion
						             FROM dbo.CuotaXCobrar     cc WITH (NOLOCK)
									 INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cc.idEstadoPago
						             WHERE cc.idComprobante   = ne.idNotaEntrega 
									   AND cc.idTipoDocumento = ne.idTipoDocumento 
									   AND cc.estado          = 1 
									   AND ep.codigo         IN ('PE','PP')
									   FOR JSON PATH
									 )
					FROM dbo.NotaEntrega           ne WITH (NOLOCK) 
					INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = ne.idPuntoEmision
					INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON  es.codEstab      = pt.codEstab
					INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago   = ne.idEstadoPago
					WHERE ne.idCliente = @idCliente AND ep.codigo IN ('PP','PE') AND es.codEstab = @codEstab 
				END 

			-- ====================================== Documento a credito o contado  ==================================================================
		    IF @tiempoCredito = 0 OR @tiempoCredito = 1
				BEGIN
					IF @codDoc = 'FV'
						BEGIN 
							INSERT INTO @tbDocuments (idTipoDocumento,idDocumento,serieComprobante,tipoDoc,fechaEmision,fechaVencimiento,importeTotal,abono,saldo,estado,cuotas)
							SELECT fv.idTipoDocumento
								  ,fv.idFactura
								  ,es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(fv.nroFactura) 
								  ,'FV'
								  ,fechaEmision
								  ,fechaVencimiento
								  ,fv.total
								  ,fv.abono
								  ,fv.saldo
								  ,ep.descripcion
								  ,cuotas = (
												SELECT cc.idTipoDocumento
												      ,idDocumento = cc.idComprobante
													  ,cc.idCuotaXCobrar
													  ,cc.nroCuota,cc.cuota
													  ,cc.abono
													  ,cc.saldo
													  ,estado = ep.descripcion
												FROM dbo.CuotaXCobrar     cc WITH (NOLOCK)
												INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cc.idEstadoPago
												WHERE cc.idComprobante   = fv.idFactura 
												 AND cc.idTipoDocumento  = fv.idTipoDocumento 
												 AND cc.estado           = 1 
												 AND ep.codigo          IN ('PE','PP')
												 FOR JSON PATH
									        )
							FROM dbo.Factura fv WITH (NOLOCK) 
							INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = fv.idPuntoEmision
							INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
							INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago   = fv.idEstadoPago
							WHERE fv.idFactura = @idDocumento AND ep.codigo IN ('PP','PE') 
						END 

					IF @codDoc = 'NE'
						BEGIN 
							INSERT INTO @tbDocuments (idTipoDocumento,idDocumento,serieComprobante,tipoDoc,fechaEmision,fechaVencimiento,importeTotal,abono,saldo,estado,cuotas)
							SELECT ne.idTipoDocumento
								  ,ne.idNotaEntrega
								  ,es.estab + '-' + pt.ptoEmi + '-' + Helper.F_Auto_Sequential(ne.nroDocumento) 
								  ,'NE'
								  ,fechaEmision
								  ,fechaVencimiento
								  ,ne.total
								  ,ne.abono
								  ,ne.saldo
								  ,ep.descripcion
								  ,cuotas = (
												SELECT cc.idTipoDocumento
													,idDocumento = cc.idComprobante
													,cc.idCuotaXCobrar
													,cc.nroCuota
													,cc.cuota
													,cc.abono
													,cc.saldo
													,estado = ep.descripcion
												FROM dbo.CuotaXCobrar     cc WITH (NOLOCK)
												INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cc.idEstadoPago
												WHERE cc.idComprobante = ne.idNotaEntrega 
												 AND cc.idTipoDocumento = ne.idTipoDocumento 
												 AND cc.estado = 1
												 AND ep.codigo IN ('PE','PP')
												 FOR JSON PATH
											 )
							FROM dbo.NotaEntrega           ne WITH (NOLOCK) 
							INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = ne.idPuntoEmision
							INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON  es.codEstab      = pt.codEstab
							INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago   = ne.idEstadoPago
							WHERE ne.idNotaEntrega = @idDocumento AND ep.codigo IN ('PP','PE')
						END 
				END 

			-- ====================== Documetos Emitidos o recibidos para plicar a cobros ; si el documento es a credito ===========================================
			IF @tiempoCredito = 0 
				BEGIN
					INSERT INTO @cobroDocuments (idComprobante,codDoc,codMov)
				    SELECT c.idComprobante,td.codigoSri,td.codigo 
			        FROM dbo.Cobro c WITH (NOLOCK)
					INNER JOIN dbo.TipoDocumento     td  WITH (NOLOCK) ON td.idTipoDocumento      = c.idTipoDocumento
					INNER JOIN dbo.EntidadFinanciera ef  WITH (NOLOCK) ON ef.idEntidadFinanciera  = c.idEntidadFinanciera
					INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = c.idComprobanteIngreso
					WHERE ef.codigo = 'DOC' 
					  AND ci.estado = 1
					  AND ci.idEntidad = @idEntidad

					INSERT INTO @documents (idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc)
					SELECT 
						 d.idDocRelacionado
						,idTipoDocumento = (SELECT TOP 1 td.idTipoDocumento FROM dbo.TipoDocumento td WITH (NOLOCK) WHERE td.codigoSri = '07')
						,dr.serieComprobante
						,saldo = d.valorRetenido
						,codDoc = 'Retención Version:'+dr.versionComp
						,nroDoc = ''
					FROM factelect.DocRelacionado d WITH (NOLOCK)
					INNER JOIN Recepcion.DocumentoRecibido dr WITH (NOLOCK) ON dr.idDocumento = d.idDocumentoRecibido
					WHERE dr.codDoc = '07' 
					  AND dr.identificacionReceptor = @identificacionReceptor 
					  AND dr.rucEmisor = @numeroIdentificacion 
					  AND d.estado = 'PE'
					  AND d.idDocRelacionado NOT IN (SELECT c.idComprobante FROM @cobroDocuments c WHERE c.codDoc = '07')


					INSERT INTO @documents (idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc)
					SELECT 
						 de.idDocumentoElectronico
						,idTipoDocumento = (SELECT TOP 1 td.idTipoDocumento FROM dbo.TipoDocumento td WITH (NOLOCK) WHERE td.codigoSri = '04')
						,serieComprobante = de.numEstab+'-'+de.ptoEmision+'-'+Helper.F_Auto_Sequential(de.nroDocumento)
						,saldo = (SELECT TOP 1 nc.total FROM dbo.NotaCredito nc WITH (NOLOCK) WHERE nc.idNotaCredito = de.idDocumento)
						,codDoc = 'Nota de Crédito Version: '+de.versionComp
						,nroDoc = ''
					FROM dbo.DocumentoElectronico de
					WHERE de.codDoc = '04'
					  AND de.codEstado = 4
					  AND de.idEntidad = @idEntidad
					  AND de.idContribuyente = @idCliente
					  AND de.idDocumentoElectronico NOT IN (SELECT c.idComprobante FROM @cobroDocuments c WHERE c.codDoc = '04')

					INSERT INTO @documents (idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc)
					SELECT 
						 a.idAnticipo as idComprobante
						,a.idTipoDocumento as idTipoDocumento
						,td.codigo+'-'+es.estab+'-'+dbo.AFTAutoComplete(a.nroDoc) as nroDocumento
						,a.valor
						,td.codigo as tipoDocumento
						,''
					FROM Anticipo a
					INNER JOIN Sri.Establecimiento es ON es.codEstab = a.codEstab
					INNER JOIN TipoDocumento td ON td.idTipoDocumento = a.idTipoDocumento
					WHERE a.idCliente =  @idCliente 
					  AND a.estado = 1 
					  AND a.idAnticipo NOT IN (SELECT t.idComprobante FROM @cobroDocuments t WHERE t.codMov = 'A')
				END 
			
			-- ==================================== PAYLOAD ================================================================================
			IF @tiempoCredito = 1 OR @tiempoCredito = 0
				BEGIN
					SELECT @fechaEmision = fechaEmision, @serieComprobante = serieComprobante FROM @tbDocuments 
				END 

			SELECT idEntidadFinanciera,descripcion,detalle,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

			SELECT idEntidadFinanciera,idSubEntidadFinanciera,descripcion,codigo,interes,controlCaja FROM dbo.SubEntidadFinanciera WHERE idEntidad = @idEntidad AND estado = 1 

			SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1

			SELECT cd.idCiudad,provincia = pr.descripcion ,cd.descripcion,pr.codigo FROM dbo.Provincia pr WITH (NOLOCK) INNER JOIN dbo.Ciudad cd WITH (NOLOCK) ON cd.idProvincia = pr.idProvincia WHERE cd.estado = 1

			SELECT idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc FROM @documents 

			SELECT idTipoDocumento ,idDocumento ,serieComprobante,tipoDoc,fechaEmision = FORMAT(fechaEmision,'MM/dd/yyyy'),fechaVencimiento = FORMAT(fechaVencimiento,'MM/dd/yyyy'),importeTotal,abono,saldo,estado,cuotas,estado FROM @tbDocuments

			SELECT importeTotal         = SUM(importeTotal) 
			      ,saldo                = SUM(saldo)
				  ,abono                = SUM(abono)
				  ,idCliente            = @idCliente
				  ,numeroIdentificacion = @numeroIdentificacion
				  ,nombreFiscal         = @nombreFiscal
				  ,codEstab             = @codEstab 
				  ,fechaEmision         = FORMAT(@fechaEmision,'MM/dd/yyyy')
				  ,serieComprobante     = @serieComprobante
			FROM @tbDocuments
		END

END
GO
