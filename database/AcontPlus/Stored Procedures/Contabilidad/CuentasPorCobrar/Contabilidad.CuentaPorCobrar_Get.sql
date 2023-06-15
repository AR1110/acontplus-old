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
	DECLARE @fecha AS DATE
	DECLARE @idEntidad AS INT 
	DECLARE @tipo AS INT 
	DECLARE @idCuentaPorCobrar AS INT

	-- ==== PARAMETER CONFIG ==========
	DECLARE @configInteres AS BIT
	DECLARE @tipoConfig AS VARCHAR(5)
	DECLARE @interes AS NUMERIC(18,5)
			
	-- == PARAMETER TIEMPO CREDITO =====
	DECLARE @creditoContado BIT
	DECLARE @codEstado VARCHAR(5)

	--=== PARAMETER TIPO 3 PARA COBROS===
	DECLARE @idCliente AS INT 
	DECLARE @codEstab AS VARCHAR(50)
	DECLARE @nombreFiscal AS VARCHAR(100)
	DECLARE @numeroIdentificacion AS VARCHAR(15)
	DECLARE @identificacionReceptor AS VARCHAR(50)
	DECLARE @tiempoCredito AS BIT
	DECLARE @fechaEmision AS DATE
	DECLARE @serieComprobante AS VARCHAR(20)

	DECLARE @tbCuotasInteres AS TABLE
	(
		 idCuotaPorCobrar INT UNIQUE NOT NULL
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

	DECLARE @tbVentas AS TABLE
	(
		 idCuentaPorCobrar INT NOT NULL UNIQUE
		,serieComprobante VARCHAR(20) NOT NULL
		,tipoDoc VARCHAR(5) NOT NULL
		,fechaEmision DATETIME NOT NULL
		,fechaVencimiento DATETIME NOT NULL
		,importeTotal NUMERIC(18,5) NOT NULL
		,diasMora INT NOT NULL
		,mora NUMERIC(18,5) NOT NULL
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

	DECLARE @documents AS TABLE
	(
		idDocumento BIGINT
		,idTipoDocumento BIGINT
		,serieComprobante VARCHAR(25)
		,saldo DECIMAL(15,5)
		,codDoc VARCHAR(100)
		,nroDoc VARCHAR(20)
	)


	--============================= Recuperar Variables ==================================================================================

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @idCuentaPorCobrar = idCuentaPorCobrar, @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo',idCuentaPorCobrar INT '$.idCuentaPorCobrar')
	

	-- ============================= Gestios de cuotas en los Documentos ===================================================================
	IF @tipo = 2
		BEGIN
			
			SELECT TOP 1 @interes = interes FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar

			SELECT @configInteres = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.configInteres') FROM config.sistema WITH (NOLOCK) WHERE codConfig = 'CV' AND idEntidad = @idEntidad

			
			SELECT TOP 1 @creditoContado = tc.tipo, @codEstado = ep.codigo
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
			INNER JOIN dbo.TiempoCredito      tc WITH (NOLOCK) ON tc.idTiempoCredito = cc.idTiempoCredito
			INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago    = cc.idEstadoPago
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar
			

			-- ==================== PROCESO PAR CUANDO ESTE ACTIVADO LA CONFIGURACION =================================
			IF @configInteres = 1
				BEGIN
					-- ========================== documentos a credito ==================================================================================
					IF @creditoContado = 0
						BEGIN
							-- === Calculo para sacar el interes de las cuotas segun su configuracion --------------------------------------
							IF @codEstado != 'CBR'
								BEGIN
									IF EXISTS (SELECT 1 FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar AND tipoConfig != 'NA')
										BEGIN
											SELECT TOP 1 @tipoConfig = tipoConfig, @interes = interes FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar
										END 
									ELSE 
										BEGIN 
											SELECT @tipoConfig = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.infoInteres.tipoConfig')
												  ,@interes    = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.infoInteres.interes')
											FROM config.sistema WITH (NOLOCK) WHERE codConfig = 'CV' AND idEntidad = @idEntidad
										END 
								END 
						END 
				END 

			-- ==================== PAYLOAD ===========================================================================
		    SELECT TOP 1 cl.numeroIdentificacion
						,cl.nombreFiscal
						,fechaEmision     = FORMAT(cc.fechaEmision,'dd/MM/yyyy')
						,serieComprobante = cc.serieComprobante 
						,importeTotal     = cc.importeTotal
						,cc.idTiempoCredito
						,codEstado        = ep.codigo 
						,config           = ISNULL(@configInteres,0)
						,tipoConfig       = ISNULL(@tipoConfig,'NA')
						,interes          = ISNULL(@interes,0)
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
			INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente      = cc.idCliente 
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
			INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago   = cc.idEstadoPago
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar
			
			SELECT idTiempoCredito,descripcion,diasCredito,numeroCuota,tiempoCredito = tipo FROM dbo.TiempoCredito WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 AND gestion = 1

			SELECT cx.idCuotaPorCobrar
			      ,cx.nroCuota
				  ,cx.cuota
				  ,cx.interes
				  ,cx.diasMora
				  ,cx.mora
				  ,cx.abono
				  ,saldoCta = cx.cuota - cx.abono
				  ,cx.saldo
				  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				  ,estado = ep.descripcion
				  ,codEstado = ep.codigo
			FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
			INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
			WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar AND cx.estado = 1
			ORDER BY cx.nroCuota ASC

		END 
	
	-- ============================= Datos para cobros rapidos,lotes,credito ================================================================ 
	IF @tipo = 3
		BEGIN

			SELECT TOP 1 @identificacionReceptor = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

			SELECT @idCliente = idCliente, @codEstab = codEstab, @tiempoCredito = credito FROM OPENJSON(@json) WITH (idCliente INT '$.idCliente', codEstab VARCHAR(50) '$.codEstab', credito BIT '$.credito')

			SELECT TOP 1 @numeroIdentificacion = numeroIdentificacion, @nombreFiscal = nombreFiscal FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

			-- ====================================== Datos por lote se trae por cliente y establecimiento   ==================================================================
			IF @tiempoCredito IS NULL
				BEGIN 
					INSERT INTO @tbVentas (idCuentaPorCobrar,serieComprobante,tipoDoc,fechaEmision,fechaVencimiento,importeTotal,diasMora,mora,abono,saldo,estado,cuotas)
					SELECT cc.idCuentaPorCobrar
						  ,cc.serieComprobante 
						  ,cc.codDoc
						  ,fechaEmision
						  ,fechaVencimiento
						  ,cc.importeTotal
						  ,cc.diasMora
						  ,cc.mora
						  ,cc.abono
						  ,cc.saldo
						  ,ep.descripcion
						  ,cuotas = (
						             SELECT cx.idCuotaPorCobrar
										   ,cx.idCuentaPorCobrar
										   ,cx.nroCuota
										   ,cx.cuota
										   ,cx.mora
										   ,cx.interes
										   ,cx.diasMora
										   ,cx.abono
										   ,saldoCta = cx.cuota - cx.abono
										   ,cx.saldo
										   ,estado = ep.descripcion
						             FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
									 INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
						             WHERE cx.idCuentaPorCobrar = cc.idCuentaPorCobrar 
									   AND cx.estado          = 1 
									   AND ep.codigo         IN ('PE','PP')
									   FOR JSON PATH
									 )
					FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) 
					INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = cc.idPuntoEmision
					INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
					INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago   = cc.idEstadoPago
					WHERE cc.idCliente = @idCliente AND ep.codigo IN ('PP','PE') AND es.codEstab = @codEstab
				END 

			-- ====================================== Documento a credito o contado  ==================================================================
		    IF @tiempoCredito = 0 OR @tiempoCredito = 1
				BEGIN
					INSERT INTO @tbVentas (idCuentaPorCobrar,serieComprobante,tipoDoc,fechaEmision,fechaVencimiento,importeTotal,diasMora,mora,abono,saldo,estado,cuotas)
					SELECT cc.idCuentaPorCobrar
						  ,cc.serieComprobante 
						  ,cc.codDoc
						  ,fechaEmision
						  ,fechaVencimiento
						  ,cc.importeTotal
						  ,cc.diasMora
						  ,cc.mora
						  ,cc.abono
						  ,cc.saldo
						  ,ep.descripcion
						  ,cuotas = (
						             SELECT cx.idCuotaPorCobrar
									       ,cx.idCuentaPorCobrar
										   ,cx.nroCuota
										   ,cx.cuota
										   ,cx.interes
										   ,cx.mora
										   ,cx.diasMora
										   ,cx.abono
										   ,saldoCta = cx.cuota - cx.abono
										   ,cx.saldo
										   ,estado = ep.descripcion
						             FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
									 INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
						             WHERE cx.idCuentaPorCobrar = cc.idCuentaPorCobrar 
									   AND cx.estado          = 1 
									   AND ep.codigo         IN ('PE','PP')
									   FOR JSON PATH
									 )
					FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) 
					INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = cc.idPuntoEmision
					INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
					INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago   = cc.idEstadoPago
					WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar AND ep.codigo IN ('PP','PE') AND es.codEstab = @codEstab
				END 

			-- ====================== Documetos Emitidos o recibidos para aplicar a cobros ; si el documento es a credito ===========================================
			
			INSERT INTO @cobroDocuments (idComprobante,codDoc,codMov)
			SELECT co.idComprobante,td.codigoSri,td.codigo 
			FROM dbo.Cobro                    co WITH (NOLOCK)
			INNER JOIN dbo.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento      = co.idTipoDocumento
			INNER JOIN dbo.EntidadFinanciera  ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
			INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
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
			
			-- ==================================== PAYLOAD ================================================================================
			IF @tiempoCredito = 1 OR @tiempoCredito = 0
				BEGIN
					SELECT @fechaEmision = fechaEmision, @serieComprobante = serieComprobante FROM @tbVentas 
				END 

			SELECT idEntidadFinanciera,descripcion,detalle,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

			SELECT idEntidadFinanciera,idSubEntidadFinanciera,descripcion,codigo,interes,controlCaja FROM dbo.SubEntidadFinanciera WHERE idEntidad = @idEntidad AND estado = 1 

			SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1

			SELECT cd.idCiudad,provincia = pr.descripcion ,cd.descripcion,pr.codigo FROM dbo.Provincia pr WITH (NOLOCK) INNER JOIN dbo.Ciudad cd WITH (NOLOCK) ON cd.idProvincia = pr.idProvincia WHERE cd.estado = 1

			SELECT idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc FROM @documents 

			SELECT idCuentaPorCobrar
			      ,serieComprobante
				  ,tipoDoc          = CASE tipoDoc WHEN '01' THEN 'Factura' ELSE 'N. Entrega' END 
				  ,fechaEmision     = FORMAT(fechaEmision,'MM/dd/yyyy')
				  ,fechaVencimiento = FORMAT(fechaVencimiento,'MM/dd/yyyy')
				  ,importeTotal
				  ,diasMora
				  ,mora
				  ,abono
				  ,saldo
				  ,estado
				  ,cuotas
			FROM @tbVentas ORDER BY fechaEmision DESC

			SELECT importeTotal         = SUM(importeTotal) 
			      ,mora                 = SUM(mora)
				  ,totalSaldoDoc        = SUM(importeTotal - abono)
				  ,saldo                = SUM(saldo)
				  ,abono                = SUM(abono)
				  ,idCliente            = @idCliente
				  ,numeroIdentificacion = @numeroIdentificacion
				  ,nombreFiscal         = @nombreFiscal
				  ,codEstab             = @codEstab 
				  ,fechaEmision         = FORMAT(@fechaEmision,'MM/dd/yyyy')
				  ,serieComprobante     = @serieComprobante
			FROM @tbVentas
			
		END
	
	-- ============================= Datos para el calculo de Interes de las moras ==========================================================
	IF @tipo = 4
		BEGIN 

			SELECT @interes = interes, @tipoConfig = tipoConfig FROM OPENJSON(@json) WITH (interes NUMERIC(18,5) '$.interes', tipoConfig VARCHAR(5) '$.tipoConfig', precioFijo NUMERIC(18,5)) 
			
			IF @tipoConfig = 'NA'
				BEGIN
					RETURN 
				END

			ELSE 
				 BEGIN 
					INSERT INTO @tbCuotasInteres(idCuotaPorCobrar,nroCuota,cuota,abono,fechaVencimiento,diasMora,interes,mora,estado,codEstado)
					SELECT   cx.idCuotaPorCobrar
							,cx.nroCuota
							,cx.cuota
							,cx.abono
							,fechaVencimiento = cx.fechaVencimiento
							,diasMora         = CASE WHEN ep.codigo != 'CBR' THEN DATEDIFF(DAY,cx.fechaVencimiento,dbo.ufnGetDateEcuador()) ELSE 0 END 
							,interes          = CASE WHEN ep.codigo != 'CBR' THEN (cx.cuota - cx.abono)  * @interes  / 100 ELSE 0 END  
							,mora             = CASE WHEN ep.codigo != 'CBR' THEN (cx.cuota - cx.abono)  * @interes  / 100 * DATEDIFF(DAY,cx.fechaVencimiento,dbo.ufnGetDateEcuador()) ELSE 0 END  
							,ep.descripcion
							,ep.codigo
					FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
					INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago 
					WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar AND cx.estado = 1	
			
					SELECT idCuotaPorCobrar 
						  ,nroCuota
						  ,cuota
						  ,abono
						  ,interes
						  ,mora     = IIF(mora < 0 ,0,mora)
						  ,saldoCta = cuota - abono
						  ,saldo    = IIF(mora< 0,0,mora) + (cuota - abono)
						  ,fechaVencimiento
						  ,diasMora = IIF(diasMora < 0,0,diasMora)
						  ,estado
						  ,codEstado
					FROM @tbCuotasInteres 
				END 
		END 
END
GO
