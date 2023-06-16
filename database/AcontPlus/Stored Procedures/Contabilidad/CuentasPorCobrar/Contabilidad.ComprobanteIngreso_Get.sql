USE [AcontPlus]
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Contabilidad.ComprobanteIngreso_Get', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.ComprobanteIngreso_Get
GO
CREATE PROCEDURE Contabilidad.ComprobanteIngreso_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	DECLARE @tipo AS INT 
	DECLARE @idEntidad AS INT
	DECLARE @idUsuario AS INT
	DECLARE @idComprobanteIngreso AS INT 
	DECLARE @idCuentaPorCobrar INT
	DECLARE @codDoc AS VARCHAR(5)

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	SELECT TOP 1 @idUsuario = idUsuario , @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	-- ====================== Lista Principal de Comprobantes de Ingreso ===============================================
	IF @tipo = 1
		BEGIN
			DECLARE @codEstab VARCHAR(50)
			DECLARE @checkBoxFecha BIT
			DECLARE @checkBoxPersona  BIT
			DECLARE @checkBoxEstado BIT 
			DECLARE @checkBoxDocumento BIT
			DECLARE @checkBoxUsuario BIT
			DECLARE @fechaInicio DATETIME 
			DECLARE @fechaFin DATETIME
			DECLARE @byPersona NVARCHAR(100)
			DECLARE @byUsuarioSearch INT
			DECLARE @byTipoDocumento INT
			DECLARE @byComprobante INT
			DECLARE @byEstado INT 

			DECLARE @isViewOtherDocs BIT 
			

			DECLARE @params NVARCHAR(MAX) = '@idEntidad         INT
											,@fechaI            DATETIME
											,@fechaF            DATETIME
											,@nroIdentificacion NVARCHAR(100)
											,@idTipoDocumento   INT
											,@idComprobante     INT
											,@estado            INT
											,@idUsuario         INT
											,@byUsuarioSearch	INT
											,@codEstab          VARCHAR(50)'
			DECLARE @sql NVARCHAR(MAX) = 'SELECT TOP 50
													 idComprobanteIngreso = ci.idComprobanteIngreso
													,s.codEstab
													,total                = ci.total
													,fechaRegistro        = dbo.AFTConvertDate(ci.fechaRegistro)+''''+ dbo.AFTConvertHora(ci.fechaRegistro)
													,abono                = ci.abono
													,cambio               = ci.cambio
													,nroDoc               = td.codigo+''-''+s.estab+''-''+Helper.F_Auto_Sequential(ci.nroDocumento)
													,cliente              = ci.nombreFiscal
													,nroIdentificacion    = ci.nroIdentificacion  
													,caja                 =''Ninguna''
													,style                = CASE WHEN ci.estado = 0 THEN ''table-danger'' ELSE '''' END 
													,estado               = CASE WHEN ci.estado = 0 THEN ''Anulado'' ELSE ''Activo'' END 
													,usuario              = u.nombreUsuario
										 FROM dbo.ComprobanteIngreso   ci WITH (NOLOCK) 
										 INNER JOIN Sri.Establecimiento s WITH (NOLOCK) ON s.codEstab         = ci.codEstab
										 INNER JOIN dbo.TipoDocumento  td WITH (NOLOCK) ON td.idTipoDocumento = ci.idTipoDocumento
										 INNER JOIN dbo.Usuario         u WITH (NOLOCK) ON u.idUsuario        = ci.idUsuario
										 WHERE ci.idEntidad = @idEntidad AND s.codEstab = @codEstab '

			SELECT 
				 @checkBoxDocumento = checkBoxDocumento
				,@checkBoxEstado    = checkBoxEstado
				,@checkBoxFecha     = checkBoxFecha
				,@checkBoxPersona   = checkBoxPersona
				,@checkBoxUsuario   = checkBoxUsuario
				,@byComprobante     = byComprobante
				,@byUsuarioSearch   = byUsuario
				,@byPersona         = byPersona
				,@codEstab          = codEstab
				,@byTipoDocumento   = byTipoDocumento
				,@byEstado          = byEstado
				,@fechaFin          = fechaFin
				,@fechaInicio       = fechaInicio
			FROM OPENJSON(@json)
			WITH (checkBoxFecha     BIT           '$.checkBoxFecha'
				 ,checkBoxPersona   BIT           '$.checkBoxPersona'
				 ,checkBoxEstado    BIT           '$.checkBoxEstado'
				 ,checkBoxDocumento BIT           '$.checkBoxDocumento'
				 ,checkBoxUsuario   BIT           '$.checkBoxUsuario'
				 ,fechaInicio       DATETIME      '$.fechaInicio'
				 ,fechaFin          DATETIME      '$.fechaFin'
				 ,byPersona         NVARCHAR(100) '$.byPersona'
				 ,codEstab          VARCHAR(100)  '$.codEstab'
				 ,byTipoDocumento   INT           '$.byTipoDocumento'
				 ,byComprobante     INT           '$.byComprobante'
				 ,byUsuario         INT           '$.byUsuario'
				 ,byEstado          INT           '$.byEstado')

			SELECT @isViewOtherDocs = JSON_VALUE(jsonPermission, '$.additional.viewOthersDocs.view') FROM Config.UserPermission WITH (NOLOCK) WHERE codModule='V' AND idUsuarioRol = @idUsuarioRol
		
			IF @checkBoxDocumento = 1
				BEGIN
					SET @sql = @sql+'AND ci.idComprobanteIngreso IN (SELECT cd.idComprobanteIngreso FROM CobroDocumento cd WHERE cd.idTipoDocumento = @idTipoDocumento AND cd.idComprobante = @idComprobante) '
				END 

			IF @checkBoxEstado = 1
				BEGIN
					SET @sql = @sql+'AND ci.estado = @estado '
				END 

			IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql+'AND CAST(ci.fechaRegistro as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '
				END 
			
			IF @checkBoxPersona = 1
				BEGIN
					SET @sql = @sql + ' AND ci.nroIdentificacion = @nroIdentificacion '
				END 

			IF @isViewOtherDocs = 0
				BEGIN
					SET @sql = @sql + ' AND ci.idUsuario = @idUsuario '
				END
			ELSE
				BEGIN 
					IF @checkBoxUsuario = 1 
						BEGIN
							SET @sql = @sql + ' AND ci.idUsuario = @byUsuarioSearch '
						END 
				END 		

			SET @sql = @sql + ' ORDER BY ci.nroDocumento DESC'

			EXEC sp_executesql 
					  @sql
					 ,@params
					 ,@idEntidad         = @idEntidad
					 ,@fechaI            = @fechaInicio
					 ,@fechaF            = @fechaFin
					 ,@nroIdentificacion = @byPersona
					 ,@idTipoDocumento   = @byTipoDocumento
					 ,@idComprobante     = @byComprobante
					 ,@estado            = @byEstado
					 ,@idUsuario         = @idUsuario
					 ,@byUsuarioSearch   = @byUsuarioSearch
					 ,@codEstab          = @codEstab
		END 

	-- ====================== Historial para mostrar los detalles del comprobante de ingreso ===========================
	IF @tipo = 2
		BEGIN
			SELECT @idComprobanteIngreso = idComprobanteIngreso FROM OPENJSON(@json) WITH (idComprobanteIngreso INT '$.idComprobanteIngreso')

			SELECT ci.idComprobanteIngreso
			      ,numeroIdentificacion = ci.nroIdentificacion
				  ,ci.nombreFiscal
				  ,serieComprobante =  'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) 
				  ,fechaEmision = FORMAT(ci.fechaRegistro,'MM/dd/yyyy')
				  ,ci.total
				  ,ci.abono
				  ,ci.cambio
			FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = ci.codEstab
			WHERE ci.idComprobanteIngreso = @idComprobanteIngreso

			SELECT co.idCobro
				  ,co.valor
				  ,co.abono
				  ,fechaEmision         = FORMAT(co.fechaEmision, 'MM/dd/yyyy')
				  ,codPago              = ef.codigo
				  ,subEntidadFinanciera = ISNULL(sf.descripcion, ef.descripcion)
				  ,co.infoCobro
				  ,posfechado           = CASE WHEN co.posfechado = 1 THEN  'SI' ELSE 'NO' END 
			      ,estado               = CASE WHEN co.cobro = 1 THEN 'COBRADO' ELSE 'POR COBRAR' END
			FROM dbo.Cobro                   co WITH (NOLOCK) 
			INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
			 LEFT JOIN SubEntidadFinanciera  sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
			 LEFT JOIN Banco                 bc WITH (NOLOCK) ON bc.idBanco                = co.idBanco
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso

			SELECT cd.idCobroDetalle
			      ,cd.idCobro 
				  ,codDoc = CASE cx.codDoc WHEN '01' THEN 'Factura' ELSE 'Nota Entrega' END 
				  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				  ,cc.nroCuota
				  ,cc.cuota
				  ,cd.interes
				  ,cd.diasMora
				  ,cd.mora
				  ,cd.abono
				  ,saldo = cc.cuota - cd.abono
				  ,serieComprobante = cx.serieComprobante
			FROM dbo.CobroDetalle                   cd WITH (NOLOCK)
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro           = cd.idCobro
			INNER JOIN Contabilidad.CuotaPorCobrar  cc WITH (NOLOCK) ON cc.idCuotaPorCobrar  = cd.idCuotaPorCobrar
			INNER JOIN Contabilidad.CuentaPorCobrar cx WITH (NOLOCK) ON cx.idCuentaPorCobrar = cc.idCuentaPorCobrar
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso
		END

	-- ====================== Historial para mostrar los comprobantes de ingreso por Documento =========================
	IF @tipo = 3
		BEGIN
			SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT '$.idCuentaPorCobrar')

			
			SELECT   cl.numeroIdentificacion
					,cl.nombreFiscal
					,serieComprobante = cc.serieComprobante
					,fechaEmision     = FORMAT(cc.fechaEmision,'MM/dd/yyyy hh:mm')
					,cc.importeTotal
					,cc.abono
					,cc.saldo
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
			INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente      = cc.idCliente
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar

			SELECT hc.idComprobanteIngreso 
				  ,fechaEmision = FORMAT(ci.fechaRegistro,'MM/dd/yyyy hh:mm')
				  ,serieComprobante = 'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) 
				  ,ci.total
				  ,ci.abono
				  ,ci.cambio
				  ,estado = CASE ci.estado WHEN 1 THEN 'ACTIVO' ELSE 'ANULADO' END 
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
			INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab             = ci.codEstab
			WHERE hc.idCuentaPorCobrar = @idCuentaPorCobrar

			SELECT co.idComprobanteIngreso
			      ,co.idCobro
				  ,posfechado   =  CASE co.posfechado WHEN 1 THEN 'SI' ELSE 'NO' END 
				  ,fechaEmision = FORMAT(co.fechaEmision,'MM/dd/yyyy hh:mm')
				  ,formaCobro   = ISNULL(sf.descripcion,ef.descripcion)
				  ,banco        = ISNULL(bc.descripcion,'-------------')
				  ,infoCobro    = ISNULL(dbo.f_sanitize_json(co.infoCobro),'[]')
				  ,co.valor
				  ,co.abono
				  ,co.vuelto
				  ,estado = CASE co.cobro WHEN 1 THEN 'COBRADO' ELSE 'POR COBRAR' END 
				  ,codPago = ef.codigo
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON ci.idComprobanteIngreso   = hc.idComprobanteIngreso
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idComprobanteIngreso   = ci.idComprobanteIngreso
			INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
			 LEFT JOIN dbo.SubEntidadFinanciera     sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
			 LEFT JOIN dbo.Banco                    bc WITH (NOLOCK) ON bc.idBanco                = co.idBanco
			WHERE hc.idCuentaPorCobrar = @idCuentaPorCobrar

			SELECT 
				 co.idCobro
				,cx.nroCuota
				,fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				,cx.cuota
				,cx.saldo
				,cx.abono
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON ci.idComprobanteIngreso   = hc.idComprobanteIngreso
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idComprobanteIngreso   = ci.idComprobanteIngreso
			INNER JOIN dbo.CobroDetalle             cc WITH (NOLOCK) ON cc.idCobro                = co.idCobro
			INNER JOIN Contabilidad.CuotaPorCobrar  cx WITH (NOLOCK) ON cx.idCuotaPorCobrar       = cc.idCuotaPorCobrar
			WHERE hc.idCuentaPorCobrar = @idCuentaPorCobrar
		END 
END
GO
