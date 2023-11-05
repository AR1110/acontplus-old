USE [Acontplus]
GO
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
-- Author:		Alexis Ramirez
-- Create date: 03/14/2023
-- Description:	SP para lisatar las cuentas por pagar.
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorPagar_Get', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorPagar_Get
GO

--  Contabilidad.CuentaPorPagar_Get 44, '{"tipo":1}'

CREATE PROCEDURE Contabilidad.CuentaPorPagar_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @tipo INT 
	
	--Varibles Generales 
	DECLARE @idProveedor INT
	DECLARE @idCuentaPorPagar INT 

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @tipo = tipo, @idCuentaPorPagar = idCuentaPorPagar FROM OPENJSON(@json) WITH (tipo INT '$.tipo', idCuentaPorPagar INT '$.idCuentaPorPagar')

	IF @tipo = 1
		BEGIN
			DECLARE @checkboxFecha BIT 
			DECLARE @checkboxEstab BIT
			DECLARE @codEstab VARCHAR(100)
			DECLARE @checkboxTipoDoc BIT
			DECLARE @codDoc VARCHAR(10)
			DECLARE @checkboxEstado BIT 
			DECLARE @codEstado VARCHAR(5)
			DECLARE @checkboxProveedor BIT 
			DECLARE @dateStart DATETIME 
			DECLARE @dateEnd DATETIME


			DECLARE @sql AS NVARCHAR(MAX) = 'SELECT TOP 50
												 pp.idCuentaPorPagar
												,idTiempoCredito = ISNULL(pp.idTiempoCredito,0)
												,idProveedor = pp.idProveedor
												,es.codEstab
												,identificacion = p.numeroIdentificacion
												,nombreFiscal = p.nombreFiscal
												,codDoc = CASE pp.codDoc WHEN ''01'' THEN ''Factura''
												                         WHEN ''03'' THEN ''Liquidacion'' 
												                         WHEN ''FC'' THEN ''F.Fisica'' 
																		 WHEN ''DH'' THEN ''C.N.Habitual''
														  END
												,pp.serieComprobante
												,fechaEmision = Format(pp.fechaEmision, ''yyyy-MM-dd'') 
												,fechaVencimiento = Format(pp.fechaVencimiento, ''yyyy-MM-dd'') 
												,importeTotal 
												,abono = ISNULL(abono,0)
												,saldo = ISNULL(saldo,0)
												,diasCredito = ISNULL(tc.diasCredito,0)
												,estado = ep.descripcion
												,codPago = ep.codigo
												,colorRow  = CASE ep.codigo WHEN ''A''  THEN ''#ED9D9D'' 
																			WHEN ''PA'' THEN ''#cfeaff''
																			ELSE ''''
															END 
										FROM Contabilidad.CuentaPorPagar pp WITH (NOLOCK)
										INNER JOIN dbo.Proveedor      p WITH (NOLOCK) ON p.idProveedor      = pp.idProveedor
										INNER JOIN Sri.Establecimiento es WITH(NOLOCK) ON es.idEstablecimiento = pp.idEstablecimiento
   										LEFT JOIN dbo.TiempoCredito tc WITH (NOLOCK) ON tc.idTiempoCredito = pp.idTiempoCredito
										INNER JOIN dbo.EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago    = pp.idEstadoPago
										WHERE pp.idEntidad = @idEntidad'

			DECLARE @params AS NVARCHAR(MAX) = '@idEntidad AS INT,
												@codEstab VARCHAR(100),
												@codDoc VARCHAR(5),
												@codEstado VARCHAR(10),
												@idProveedor INT,
												@dateStart DATETIME,
												@dateEnd DATETIME'

			SELECT 
				@checkboxFecha = checkboxFecha,
				@checkboxEstab = checkboxEstab,
				@codEstab      = codEstab,
				@checkboxTipoDoc = checkboxTipoDoc,
				@codDoc          = codDoc,
				@checkboxEstado  = checkboxEstado,
				@codEstado       = codEstado,
				@checkboxProveedor = checkboxProveedor,
				@idProveedor       = idProveedor,
				@dateStart         = dateStart,
				@dateEnd           = dateEnd
			FROM OPENJSON(@json)
			WITH (
				checkboxFecha BIT '$.checkboxFecha',
				checkboxEstab BIT '$.checkboxEstab',
				codEstab VARCHAR(100) '$.codEstab',
				checkboxTipoDoc BIT '$.checkboxTipoDoc',
				codDoc VARCHAR(10) '$.codDoc',
				checkboxEstado BIT '$.checkboxEstado',
				codEstado VARCHAR(5) '$.codEstado',
				checkboxProveedor BIT '$.checkboxProveedor',
				idProveedor INT '$.idProveedor',
				dateStart DATETIME '$.dateStart',
				dateEnd DATETIME '$.dateEnd'
			)

			IF @checkboxFecha = 1
				BEGIN
					SET @sql = @sql + ' AND CAST(pp.fechaEmision AS DATE) BETWEEN CAST(@dateStart AS DATE) AND CAST(@dateEnd AS DATE) '
				END 

			IF @checkboxEstab = 1
				BEGIN
					SET @sql = @sql + ' AND es.codEstab = @codEstab'
				END 

			IF @checkboxTipoDoc = 1
				BEGIN
					SET @sql = @sql + ' AND pp.codDoc= @codDoc '
				END 

			IF @checkboxEstado = 1
				BEGIN
					SET @sql = @sql + ' AND ep.codigo= @codEstado'
				END 

			IF @checkboxProveedor = 1
				BEGIN
					SET @sql = @sql + ' AND pp.idProveedor= @idProveedor'
				END 

			SET @sql = @sql+' ORDER BY pp.idCuentaPorPagar DESC '
			
			EXEC sp_executesql 
			      @sql
			     ,@params 
			     ,@idEntidad    = @idEntidad
				 ,@codEstab     = @codEstab
				 ,@codDoc       = @codDoc
				 ,@codEstado    = @codEstado
				 ,@idProveedor  = @idProveedor
				 ,@dateStart    = @dateStart
				 ,@dateEnd      = @dateEnd
		END 

	IF @tipo = 2
		BEGIN
			DECLARE @codPago VARCHAR(5)			
			SELECT @codPago = codPago FROM OPENJSON(@json) WITH (codPago VARCHAR(5) '$.codPago')
			
			IF @codPago IS NULL
				BEGIN 
					SELECT 
						 c.idCuotaPorPagar
						,fechaVencimiento = Format(c.fechaVencimiento, 'yyyy-MM-dd')
						,c.nroCuota
						,c.cuota
						,c.abono
						,c.saldo
						,ep.descripcion
						,ep.codigo
					FROM Contabilidad.CuotaPorPagar c 
					INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = c.idEstadoPago
					WHERE c.idCuentaPorPagar = @idCuentaPorPagar	
					AND c.estado = 1
				END 
			
			ELSE IF @codPago IS NOT NULL
				BEGIN 
					SELECT 
						 c.idCuotaPorPagar
						,fechaVencimiento = Format(c.fechaVencimiento, 'yyyy-MM-dd')
						,c.nroCuota
						,c.cuota
						,c.abono
						,c.saldo
						,ep.descripcion
						,ep.codigo
					FROM Contabilidad.CuotaPorPagar c 
					INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = c.idEstadoPago
					WHERE c.idCuentaPorPagar = @idCuentaPorPagar	
					AND c.estado = 1 AND ep.codigo !='PA'
				END 							 
			END

	--Forma Pago
	IF @tipo = 3
			BEGIN
				
				SET @idProveedor = (SELECT idProveedor FROM OPENJSON(@json)WITH(idProveedor INT '$.idProveedor'))
				DECLARE @rucEmisor  VARCHAR(15)
				DECLARE @identificacionReceptor VARCHAR(13)
				DECLARE @cedula VARCHAR(10)
				DECLARE @table AS TABLE
				(
					idComprobante BIGINT 
				   ,idTipoDocumento BIGINT 
				   ,nroDocumento VARCHAR(20)
				   ,saldo DECIMAL(15,5)
				   ,tipoDocumento VARCHAR(50)
				)

				DECLARE @pagoDocuments AS TABLE 
				(
					 idComprobante INT
					,codDoc VARCHAR(5)
				)

				SELECT TOP 1 @rucEmisor = numeroIdentificacion FROM Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor

				SELECT TOP 1 @identificacionReceptor = ruc , @cedula = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
				
				SELECT * FROM EntidadFinanciera WHERE estado = 1
				SELECT * FROM SubEntidadFinanciera WHERE idEntidad = @idEntidad AND estado = 1
				SELECT * FROM Banco WHERE estado = 1
				SELECT * FROM Ciudad WHERE estado = 1


				INSERT INTO @pagoDocuments(idComprobante,codDoc)
				SELECT p.idComprobante,td.codigoSri FROM Pago p WITH (NOLOCK) 
													INNER JOIN dbo.TipoDocumento     td WITH (NOLOCK) ON p.idTipoDocumento      = td.idTipoDocumento 
													INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = p.idEntidadFinanciera
													INNER JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK) ON ce.idComprobanteEgreso = p.idComprobanteEgreso
													WHERE ef.codigo = 'DOC' AND ce.estado = 1  AND ce.idEntidad = @idEntidad


				INSERT INTO @table (idComprobante,idTipoDocumento,nroDocumento,saldo,tipoDocumento)
				SELECT 
					 de.idDocumentoElectronico
					,idTipoDocumento = (SELECT idTipoDocumento FROM dbo.TipoDocumento td (NOLOCK) WHERE td.codigo = 'RC')
					,nroDocumento    = de.numEstab+'-'+de.ptoEmision+'-'+Helper.F_Auto_Sequential(de.nroDocumento)
					,saldo           = (SELECT rc.total FROM dbo.RetencionCompra rc  WITH (NOLOCK) WHERE rc.idRetencionCompra = de.idDocumento)
					,codigo          = 'Retención versión: 1.0.0'
				FROM dbo.DocumentoElectronico de WITH (NOLOCK) 
				WHERE de.codDoc          = '07' 
				  AND de.versionComp     = '1.0.0' 
				  AND de.idEntidad       = @idEntidad
				  AND de.codEstado       = 4
				  AND de.idContribuyente = @idProveedor
				  AND de.idDocumentoElectronico NOT IN (SELECT idComprobante FROM @pagoDocuments t WHERE t.codDoc = '07')

				INSERT INTO @table (idComprobante,idTipoDocumento,nroDocumento,saldo,tipoDocumento)
				SELECT 
					 de.idDocumentoElectronico
					,idTipoDocumento = (SELECT idTipoDocumento FROM dbo.TipoDocumento td WHERE td.codigo = 'RC')
					,nroDocumento = de.numEstab+'-'+de.ptoEmision+'-'+Helper.F_Auto_Sequential(de.nroDocumento)
					,saldo = (SELECT SUM(ats.valorRetenido) FROM FactElect.RetencionAtsRet ats WHERE ats.idRetencionAts = de.idDocumento)
					,codigo = 'Retención versión: 2.0.0'
				FROM dbo.DocumentoElectronico de 
				WHERE de.codDoc = '07'
				  AND de.versionComp = '2.0.0'
				  AND de.codEstado = 4
				  AND de.idEntidad = @idEntidad
				  AND de.numeroIdentificacion = @rucEmisor
				  AND de.idDocumentoElectronico NOT IN (SELECT idComprobante FROM @pagoDocuments t WHERE t.codDoc = '07')


				INSERT INTO @table (idComprobante,idTipoDocumento,nroDocumento,saldo,tipoDocumento)
				SELECT 
					 d.idDocRelacionado
					,idTipoDocumento = (SELECT TOP 1 idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NC')
					,dr.serieComprobante
					,saldo = d.baseImponible + valorRetenido
					,codDoc = 'Nota Crédito Version:'+dr.versionComp
				FROM factelect.DocRelacionado d
				INNER JOIN Recepcion.DocumentoRecibido dr ON dr.idDocumento = d.idDocumentoRecibido
				WHERE dr.codDoc = '04' 
				  AND dr.identificacionReceptor = @identificacionReceptor
				  AND dr.rucEmisor = @rucEmisor 
				  AND d.idDocRelacionado NOT IN (SELECT idComprobante FROM @pagoDocuments t WHERE t.codDoc = '04')


				INSERT INTO @table (idComprobante,idTipoDocumento,nroDocumento,saldo,tipoDocumento)
				SELECT 
					 d.idDocRelacionado
					,idTipoDocumento = (SELECT TOP 1 idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NC')
					,dr.serieComprobante
					,saldo = d.valorRetenido
					,codDoc = 'Nota Crédito Version:'+dr.versionComp
				FROM factelect.DocRelacionado d
				INNER JOIN Recepcion.DocumentoRecibido dr ON dr.idDocumento = d.idDocumentoRecibido
				WHERE dr.codDoc = '04' 
				  AND dr.identificacionReceptor = @cedula
				  AND dr.rucEmisor = @rucEmisor 
				  AND d.idDocRelacionado NOT IN (SELECT idComprobante FROM @pagoDocuments t WHERE t.codDoc = '04')
				SELECT * FROM @table

				
			END 

	IF @tipo = 4
		BEGIN 				
			SELECT
				ce.nroIdentificacion
				,ce.nombreFiscal
				,ce.total
				,tipoDocumento = 'CE-' + es.estab + '-' + Helper.F_Auto_Sequential(ce.nroDocumento) 
				,usuario = us.nombreUsuario
				,estado = IIF(ce.estado=1, 'ACTIVO', 'ANULADA')
				,fechaRegistro = FORMAT(ce.fechaRegistro, 'yyyy-MM-dd hh:mm')

			FROM Contabilidad.Historial_Pago hp WITH(NOLOCK)
			INNER JOIN ComprobanteEgreso     ce WITH(NOLOCK) ON ce.idComprobanteEgreso = hp.idComprobanteEgreso
			INNER JOIN Sri.Establecimiento   es WITH(NOLOCK) ON es.codEstab            = ce.codEstab 
			INNER JOIN Usuario               us WITH(NOLOCK) ON us.idUsuario           = ce.idUsuario
			WHERE hp.idCuentaPorPagar = @idCuentaPorPagar
			ORDER BY fechaRegistro 

		END 
	
    --> Data Form Cuotas 
    IF @tipo = 5 
        BEGIN
            SELECT idTiempoCredito
	                ,descripcion
	                ,diasCredito
	                ,numeroCuota 
	        FROM TiempoCredito WITH (NOLOCK) 
	        WHERE idEntidad = @idEntidad 
              AND gestion = 0
              AND estado = 1
            RETURN 
        END 
END
GO
