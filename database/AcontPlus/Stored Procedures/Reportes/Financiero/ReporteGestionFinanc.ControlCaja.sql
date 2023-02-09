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
-- exec ReporteGestionFinanc.ControlCaja 38,'[{"idControlCaja":"2"}]'
-- =============================================
IF OBJECT_ID(N'ReporteGestionFinanc.ControlCaja', N'P') IS NOT NULL
DROP PROCEDURE ReporteGestionFinanc.ControlCaja
GO
CREATE PROCEDURE ReporteGestionFinanc.ControlCaja @idRol INT,@json VARCHAR(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
    DECLARE @chequesPosf DECIMAL(15,5)
    DECLARE @idControlCaja INT 
	DECLARE @fechaApertura DATETIME
	DECLARE @totalSistema DECIMAL(15,5)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol
	
	SELECT @idControlCaja = idControlCaja  FROM OPENJSON(@json) WITH (idControlCaja BIGINT '$.idControlCaja') AS jsonValues

	SELECT @fechaApertura = fechaApertura FROM dbo.ControlCaja WHERE idControlCaja = @idControlCaja
	
	SET @chequesPosf = (SELECT SUM(abono) FROM AFTAdministracionCaja() WHERE estado = 1 AND idEntidad = @idEntidad AND codpay LIKE 'CHE' AND Cobro = 0 AND idControlCaja = @idControlCaja)
	
	SELECT @totalSistema =  sum(abono) FROM AFTAdministracionCaja() WHERE estado = 1 AND idEntidad = @idEntidad AND  cobro = 1 AND idControlCaja = @idControlCaja 

     SELECT 
	      nroComprobante = nroCobro,
		  tipDoc,
		  nroDoc,
		  fechaEmision = dbo.AFTConvertDate(fechaEmision)+dbo.AFTConvertHora(fechaEmision),
		  persona = nombreComercial,
		  total = CAST(total AS numeric(15,2)),
		  abono = CAST(abono AS numeric(15,2)),
		  saldo = CAST(saldo AS numeric(15,2)),
		  pay =   pay
	 FROM AFTAdministracionCaja()
	 WHERE estado = 1 AND  idEntidad = @idEntidad AND idControlCaja = @idControlCaja
	 ORDER BY tipo,nroDoc,nroCobro ASC 

	 SELECT  
		formaPago = ef.descripcion,
	    ingreso   = CAST(ISNULL((SELECT sum(abono) FROM AFTAdministracionCaja() WHERE estado = 1 AND idEntidad = @idEntidad AND tipo != 4 and idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1 AND idControlCaja = @idControlCaja),0)     AS numeric(15,2) ),
		egreso    = CAST(ISNULL((SELECT sum(abono) FROM AFTAdministracionCaja() WHERE estado = 1 AND idEntidad = @idEntidad AND tipo = 4 and idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1 AND idControlCaja = @idControlCaja),0) * -1 AS numeric(15,2))		
	 FROM EntidadFinanciera ef
	 ORDER BY EF.fechaRegistro ASC

	 SELECT 
		tipDoc = CASE WHEN codigo LIKE 'FV' THEN 'FACTURA' ELSE 'NOTA DE ENTREGA' END,
		total = CAST(SUM(total) as numeric(15,2)),
		abono = CAST(SUM(abono) as numeric(15,2)),
		cantidad = COUNT(*)
	 FROM afnCarteraCliente()
	 WHERE idEntidad = @idEntidad AND estado = 1 AND CAST(fechaEmision AS date) = CAST(@fechaApertura AS date)
	 GROUP BY codigo
	 
	 UNION ALL
	 
	 SELECT 
		CASE WHEN tipDoc LIKE 'A'  THEN 'ANTICIPO' 
		     WHEN tipDoc LIKE 'EC' THEN 'EGRESO CAJA'
		     ELSE 'INGRESO CAJA'
		END,
		total = CAST(SUM(total) as numeric(15,2)),
		abono = CAST(SUM(abono) as numeric(15,2)),
		COUNT(*)
	 FROM AFTAdministracionCaja()
	 WHERE tipDoc IN ('IC','EC','A') AND idEntidad = @idEntidad AND estado = 1 AND idControlCaja = @idControlCaja
	 GROUP BY tipDoc


	 SELECT 
		tipoDoc = codigo,
		nroDoc ,
		fechaEmision = dbo.AFTConvertDate(fechaEmision)+dbo.AFTConvertHora(fechaEmision),
		cliente,
		total = CAST(total as numeric(15,2))
	 FROM AFTDocumentoForPayment() 
	 WHERE gestion = 1 AND idEntidad = @idEntidad AND CAST(fechaEmision AS date) = CAST(@fechaApertura AS date)

	 SELECT 
		caja       = c.descripcion,
		arqueo     = CAST(cc.totalArqueo AS numeric(15,2)),
		diferencia = CAST(entrada+ISNULL(@totalSistema,0) - cc.totalArqueo AS numeric(15,2)),
		sistema    = CAST(ISNULL(@totalSistema,0) AS numeric(15,2)),
		total      = CAST(entrada+ISNULL(@totalSistema,0) AS numeric(15,2)),
		usuario    = u.nombreCompleto,
		apertura   = dbo.AFTConvertDate(cc.fechaApertura)+dbo.AFTConvertHora(cc.fechaApertura),
		cierre     = ISNULL(dbo.AFTConvertDate(cc.fechaCierre)+dbo.AFTConvertHora(cc.fechaCierre),'Pendiente'),
		estado     = CASE WHEN cc.estado = 1 THEN 'ABIERTA' ELSE 'CERRADA' END,
		nroControl = cc.idControlCaja,
		entrada    = CAST(cc.entrada AS numeric(15,2))
	 FROM dbo.ControlCaja cc
	 INNER JOIN Caja c ON c.idCaja = cc.idCaja
	 INNER JOIN AsignacionCaja ac ON ac.idCaja = c.idCaja
	 INNER JOIN Usuario u ON u.idUsuario = ac.idUsuario
	 WHERE cc.idControlCaja = @idControlCaja

	 SELECT @chequesPosf as chequePosfechado
	 
END 
