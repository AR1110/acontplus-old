USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPControlCajaReport]    Script Date: 12/8/2022 3:29:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- exec ReporteGestionFinanc.ControlCaja '{"id":3151,"idUsuarioRol":28}'
-- =============================================
IF OBJECT_ID(N'ReporteGestionFinanc.ControlCaja', N'P') IS NOT NULL
DROP PROCEDURE ReporteGestionFinanc.ControlCaja
GO
CREATE PROCEDURE ReporteGestionFinanc.ControlCaja @json VARCHAR(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idControlCaja INT 
	DECLARE @color VARCHAR(200) = '#000000'
	DECLARE @efectivoSistema DECIMAL(15,5)
	DECLARE @totalSistema DECIMAL(15,5)
	DECLARE @totalArqueo DECIMAL(15,5)
	DECLARE @efectivoArqueo DECIMAL(15,5)
	DECLARE @otros DECIMAL(15,5)
	DECLARE @chequesPosf DECIMAL(15,5)
	DECLARE @direfencia DECIMAL(15,5)
	
	DECLARE @tbDetalleCaja AS TABLE (
		id INT IDENTITY(1,1) NOT NULL
	   ,idEntidadFinanciera INT NOT NULL
	   ,nroComprobante VARCHAR(100) NOT NULL
	   ,tipDoc VARCHAR(10) NOT NULL
	   ,nroDoc VARCHAR(25) NOT NULL
	   ,fechaEmision DATETIME NOT NULL
	   ,persona VARCHAR(200) NOT NULL
	   ,total NUMERIC(18,5) NOT NULL
	   ,abono NUMERIC(18,5) NOT NULL
	   ,saldo NUMERIC(18,5) DEFAULT 0 NOT NULL
	   ,pay  VARCHAR(150) NOT NULL
	   ,cobro BIT NOT NULL DEFAULT 1 
	   ,observacion VARCHAR(300) NULL
	)

	DECLARE @tbDocuments AS TABLE(
		 serieComprobante VARCHAR(25) NOT NULL
		,tipDoc VARCHAR(5) NOT NULL
		,total NUMERIC(18,5) NOT NULL
		,abono NUMERIC(18,5) NOT NULL
	)

	SELECT @idControlCaja = idControlCaja FROM OPENJSON(@json) WITH (idControlCaja INT '$.id', idUsuarioRol INT '$.idUsuarioRol') AS jsonValues


	INSERT INTO @tbDetalleCaja (nroComprobante,tipDoc,nroDoc,fechaEmision,persona,total,abono,saldo,pay,idEntidadFinanciera,cobro)
	SELECT nroComprobante  = 'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento)
		  ,doc             = IIF(cc.codDoc = '01','FV',cc.codDoc)
		  ,nroDoc          = cc.serieComprobante 
		  ,fechaEmision    = cc.fechaEmision
		  ,agenteEconomico = cl.nombreFiscal
		  ,total           = cc.importeTotal
		  ,abono           = CASE WHEN co.cobro = 1 THEN cd.abono ELSE 0 END
		  ,saldo           = cc.importeTotal - SUM(CASE WHEN co.cobro = 1 THEN cd.abono ELSE 0 END) OVER (PARTITION BY cc.idCuentaPorCobrar ORDER BY co.idCobro ROWS UNBOUNDED PRECEDING)    
		  ,pay             = ISNULL(sf.descripcion,ef.descripcion) + ' ' +  IIF(co.posfechado = 1,'POSFECHADO','')
		  ,ef.idEntidadFinanciera
		  ,co.cobro
	FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.codEstab               = ci.codEstab
	INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idComprobanteIngreso   = ci.idComprobanteIngreso
	INNER JOIN dbo.CobroDetalle             cd WITH (NOLOCK) ON cd.idCobro                = co.idCobro
	INNER JOIN Contabilidad.CuotaPorCobrar  cx WITH (NOLOCK) ON cx.idCuotaPorCobrar       = cd.idCuotaPorCobrar
	INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar      = cx.idCuentaPorCobrar
	INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente              = cc.idCliente
	INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
	 LEFT JOIN dbo.SubEntidadFinanciera     sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
	WHERE ci.idControlCaja = @idControlCaja AND ci.estado = 1
	
	INSERT INTO @tbDetalleCaja (nroComprobante,tipDoc,nroDoc,fechaEmision,persona,total,abono,pay,idEntidadFinanciera)
	SELECT nroComprobante = 'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento)
		  ,doc = td.codigo
		  ,nroDoc    =   CASE td.codigo WHEN 'A'  THEN (
														SELECT 'A' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(an.nroDoc)
														FROM dbo.Anticipo an WITH (NOLOCK) 
														INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = an.codEstab
														WHERE an.idAnticipo = cd.idComprobante
														)  
										WHEN 'IC' THEN  (
														SELECT 'IC' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(mc.nroDoc)
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = mc.codEstab
														WHERE mc.idMovimientoCaja = cd.idComprobante
														)
						  END 
		,fechaEmsion =    CASE td.codigo WHEN 'A'  THEN (
														SELECT an.fechaEmision FROM dbo.Anticipo an WITH (NOLOCK) WHERE an.idAnticipo = cd.idComprobante
														)  
										 WHEN 'IC' THEN (
														SELECT mc.fechaEmision FROM dbo.MovimientoCaja mc WITH (NOLOCK) WHERE mc.idMovimientoCaja = cd.idComprobante
														)
						   END 
		,agenteEconomico = CASE td.codigo WHEN 'A' THEN 
														(
														SELECT cl.nombreFiscal
														FROM dbo.Anticipo an WITH (NOLOCK) 
														INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = an.idCliente
														WHERE an.idAnticipo = cd.idComprobante
														)  
										  WHEN 'IC' THEN 
														(
														SELECT em.nombreCompleto 
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN dbo.Empleado em WITH (NOLOCK) ON em.idEmpleado = mc.idEmpleado
														WHERE mc.idMovimientoCaja = cd.idComprobante
														)
							END
		,total            = CASE td.codigo WHEN 'A'  THEN 
														(
														SELECT an.valor FROM dbo.Anticipo an WITH (NOLOCK) WHERE an.idAnticipo = cd.idComprobante
														)  
										   WHEN 'IC' THEN 
														(
														SELECT mc.valor FROM dbo.MovimientoCaja mc WITH (NOLOCK) WHERE mc.idMovimientoCaja = cd.idComprobante
														)
							END 
		,cd.abono 
		,pay              = CASE td.codigo WHEN 'A'  THEN 
														(
														SELECT sf.descripcion
														FROM dbo.Anticipo an WITH (NOLOCK) 
														INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = an.idSubEntidadFinanciera
														WHERE an.idAnticipo = cd.idComprobante
														)  
										   WHEN 'IC' THEN 
														(
														SELECT sf.descripcion
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
														WHERE mc.idMovimientoCaja = cd.idComprobante
														)
							END
		,idEntidadFinanciera =  CASE td.codigo WHEN 'A'  THEN 
														(
														SELECT sf.idEntidadFinanciera
														FROM dbo.Anticipo an WITH (NOLOCK) 
														INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = an.idSubEntidadFinanciera
														WHERE an.idAnticipo = cd.idComprobante
														)  
											  WHEN 'IC' THEN 
														(
														SELECT sf.idEntidadFinanciera
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
														WHERE mc.idMovimientoCaja = cd.idComprobante
														)
								END
	FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab             = ci.codEstab
	INNER JOIN dbo.CobroDocumento  cd WITH (NOLOCK) ON cd.idComprobanteIngreso = ci.idComprobanteIngreso
	INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento      = cd.idTipoDocumento
	WHERE td.codigo IN ('A','IC') AND ci.estado = 1 AND ci.idControlCaja = @idControlCaja

	INSERT INTO @tbDetalleCaja (nroComprobante,tipDoc,nroDoc,fechaEmision,persona,total,abono,pay,idEntidadFinanciera)
	SELECT nroComprobante = 'CE' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ce.nroDocumento)
		  ,doc = td.codigo
		  ,nroDoc        = CASE td.codigo  WHEN 'EC' THEN 
														(
														SELECT 'IC' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(mc.nroDoc)
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = mc.codEstab
														WHERE mc.idMovimientoCaja = pd.idComprobante
														)
						   END 
		,fechaEmsion     = CASE td.codigo WHEN 'EC' THEN 
														(
														SELECT mc.fechaEmision FROM dbo.MovimientoCaja mc WITH (NOLOCK) WHERE mc.idMovimientoCaja = pd.idComprobante
														)
						   END 
		,agenteEconomico = CASE td.codigo WHEN 'EC' THEN 
														(
														SELECT em.nombreCompleto 
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN dbo.Empleado em WITH (NOLOCK) ON em.idEmpleado = mc.idEmpleado
														WHERE mc.idMovimientoCaja = pd.idComprobante
														)
							END
		,total            = CASE td.codigo WHEN 'EC' THEN 
														(
														SELECT mc.valor FROM dbo.MovimientoCaja mc WITH (NOLOCK) WHERE mc.idMovimientoCaja = pd.idComprobante
														)
							END * -1
		,pd.abono * -1
		,pay              = CASE td.codigo WHEN 'EC' THEN 
														(
														SELECT sf.descripcion
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
														WHERE mc.idMovimientoCaja = pd.idComprobante
														)
							END
		,idEntidadFinanciera =  CASE td.codigo WHEN 'EC' THEN 
														(
														SELECT sf.idEntidadFinanciera
														FROM dbo.MovimientoCaja mc WITH (NOLOCK) 
														INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
														WHERE mc.idMovimientoCaja = pd.idComprobante
														)
								END
	FROM dbo.ComprobanteEgreso     ce WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab             = ce.codEstab
	INNER JOIN dbo.PagoDocumento   pd WITH (NOLOCK) ON pd.idComprobanteEgreso  = ce.idComprobanteEgreso
	INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento      = pd.idTipoDocumento
	WHERE td.codigo = 'EC' AND ce.estado = 1 AND ce.idControlCaja = @idControlCaja

	INSERT INTO @tbDocuments (serieComprobante,tipDoc,abono,total)
	SELECT nroDoc,tipDoc,SUM(abono),total FROM @tbDetalleCaja WHERE cobro = 1 GROUP BY tipDoc,total,nroDoc

	-- ================================ FORMAS DE PAGOS TOTALIZADAS ========================================
	SELECT @chequesPosf     = SUM(td.total) FROM @tbDetalleCaja td INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = td.idEntidadFinanciera WHERE cobro = 0 AND ef.codigo = 'CHE'
	
	SELECT @efectivoSistema = SUM(td.abono)    FROM @tbDetalleCaja td INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = td.idEntidadFinanciera WHERE cobro = 1 AND ef.codigo = 'EFE'
	
	SELECT @otros           = SUM(td.abono)    FROM @tbDetalleCaja td INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = td.idEntidadFinanciera WHERE cobro = 1 AND ef.codigo NOT IN ('EFE','DOC')


	-- ============================== CUADRES DE CAJA  ========================================================
	SELECT @efectivoArqueo = totalArqueo FROM  dbo.ControlCaja WITH (NOLOCK) WHERE idControlCaja = @idControlCaja 

	SELECT @totalSistema = ISNULL(@efectivoSistema,0) + ISNULL(@otros,0)
	
	SELECT @totalArqueo  = ISNULL(@efectivoArqueo,0)  + ISNULL(@otros,0)

	SELECT @direfencia = @totalArqueo - @totalSistema 

	IF @direfencia != 0
		BEGIN
			SET	@color = '#FB0909'
		END 

	-- ====== INFORMACION PRINCIPAL DEL CONTROL DE CAJA =================================
	 SELECT 
		 nroControl         = cc.idControlCaja
		,caja               = ca.descripcion
		,apertura           = FORMAT(cc.fechaApertura, 'dd/MM/yyyy HH:mm')
		,cierre             = FORMAT(cc.fechaCierre, 'dd/MM/yyyy HH:mm') 
		,usuario            = us.nombreCompleto
		,estado             = CASE WHEN cc.estado = 1 THEN 'ABIERTA' ELSE 'CERRADA' END
		,entrada            = CAST(cc.entrada AS numeric(15,2))
		,efectivoSistema    = CAST(ISNULL(@efectivoSistema,0) AS numeric(15,2))
		,efectivoArqueo     = CAST(ISNULL(@efectivoArqueo,0) AS numeric(15,2))
		,otros              = CAST(ISNULL(@otros,0) AS numeric(15,2))
		,totalSistema       = CAST(ISNULL(@totalSistema,0) AS numeric(15,2))
		,totalArqueo        = CAST(ISNULL(@totalArqueo,0)  AS numeric(15,2))
		,diferencia         = CAST(ISNULL(@direfencia,0)   AS numeric(15,2))
		,color              = @color
	 FROM dbo.ControlCaja cc WITH (NOLOCK)
	 INNER JOIN dbo.Caja           ca WITH (NOLOCK) ON ca.idCaja    = cc.idCaja
	 INNER JOIN dbo.AsignacionCaja ac WITH (NOLOCK) ON ac.idCaja   = ca.idCaja
	 INNER JOIN dbo.Usuario        us WITH (NOLOCK) ON us.idUsuario = ac.idUsuario
	 WHERE cc.idControlCaja = @idControlCaja

	
	 -----------------------------------RESUMEN TOTALIZADO EN LAS FORMAS DE PAGO----------------------------------------
	 SELECT  
		 formaPago = ef.descripcion
	    ,ingreso   = CAST(ISNULL((SELECT sum(abono) FROM @tbDetalleCaja WHERE tipDoc != 'EC' AND idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1),0) AS numeric(15,2))
		,egreso    = CAST(ISNULL((SELECT sum(abono) FROM @tbDetalleCaja WHERE tipDoc  = 'EC' AND idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1),0) * -1 AS numeric(15,2))		
	 FROM EntidadFinanciera ef WITH (NOLOCK)
	 WHERE ef.estado = 1 AND ef.codigo NOT IN ('DOC')
	 ORDER BY ef.fechaRegistro ASC
	 -------------------------------------------------END----------------------------------------------------------------


	 -----------------------------------RESUMEN TOTALIZADO DE DOCUMENTOS--------------------------------------------------

	 SELECT 
		tipDoc   = td.descripcion
	   ,total    = CAST(ISNULL((SELECT SUM(ac.total) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0) AS numeric(15,2))
	   ,abono    = CAST(ISNULL((SELECT SUM(ac.abono) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0) AS numeric(15,2))
	   ,saldo    = CAST(ISNULL((SELECT SUM(ac.total) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0)  - ISNULL((SELECT SUM(ac.abono) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0) AS numeric(18,5))
	   ,cantidad = (ISNULL((    SELECT COUNT(*)      FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0))
	 FROM dbo.TipoDocumento td WITH (NOLOCK)
	 WHERE td.codigo IN ('FV','NE','IC','EC')
	 
	  -------------------------------------------------END-----------------------------------------------------------------

	 -----------------------------HISTORIAL DE MOVIMIENTO POR DOCUMENTO DEL CONTROL DE CAJA-----------------------------
	  SELECT tipoDoc = td.codigo
	        ,nroDoc  = JSON_VALUE(dbo.f_sanitize_json(co.infoCobro),'$.nro')
		    ,fechaEmision = CASE td.codigo WHEN 'NC' THEN (SELECT TOP 1 FORMAT(de.fechaEmision, 'dd/MM/yyyy HH:mm') FROM dbo.DocumentoElectronico de WITH (NOLOCK) WHERE de.idDocumentoElectronico = co.idComprobante AND de.codDoc = '04')
								           WHEN 'RV' THEN (SELECT TOP 1 FORMAT(rv.fechaEmision, 'dd/MM/yyyy HH:mm') FROM dbo.RetencionVenta       rv WITH (NOLOCK) WHERE rv.idRetencionVenta  = co.idComprobante)
								           WHEN 'RC' THEN (SELECT TOP 1 dd.fechaEmision                             FROM FactElect.DocRelacionado dr WITH (NOLOCK) INNER JOIN Recepcion.DocumentoRecibido dd WITH (NOLOCK) ON dd.idDocumento = dr.idDocumentoRecibido WHERE dr.idDocRelacionado = co.idComprobante)
								           WHEN 'A'  THEN (SELECT TOP 1 FORMAT(an.fechaEmision, 'dd/MM/yyyy HH:mm') FROM dbo.Anticipo             an WITH (NOLOCK) WHERE an.idAnticipo = co.idComprobante)
							END
		  ,cliente = ci.nombreFiscal
		  ,total   = CAST(co.abono as numeric(18,2))
		  ,co.idTipoDocumento
		  ,co.idComprobante
	 FROM dbo.ComprobanteIngreso       ci WITH (NOLOCK)
	 INNER JOIN dbo.Cobro              co WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
	 INNER JOIN dbo.EntidadFinanciera  ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
	  LEFT JOIN dbo.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento      = co.idTipoDocumento
	 WHERE ci.idControlCaja = @idControlCaja AND ci.estado = 1 AND ef.codigo = 'DOC' 
	 

	 ------------------------------------------------END----------------------------------------------------------------
	
	 SELECT 
	       nroComprobante 
		  ,tipDoc = IIF(tipDoc='FV','FE',tipDoc)
		  ,nroDoc
		  ,fechaEmision = dbo.AFTConvertDate(fechaEmision)+dbo.AFTConvertHora(fechaEmision)
		  ,persona
		  ,total = CAST(total AS numeric(15,2))
		  ,abono = CAST(abono AS numeric(15,2))
		  ,saldo = CAST(saldo AS numeric(15,2))
		  ,pay =   pay
	 FROM @tbDetalleCaja
	 WHERE cobro = 1
	 ORDER BY pay,nroDoc,nroComprobante ASC 

	 SELECT chequePosfechado = CAST(ISNULL(@chequesPosf,0)as numeric(18,2))
	       ,anticipos        = CAST(ISNULL((SELECT SUM(dc.total) FROM @tbDetalleCaja dc WHERE dc.tipDoc = 'A' ),0)as numeric(18,2))
	 
	 
END 
