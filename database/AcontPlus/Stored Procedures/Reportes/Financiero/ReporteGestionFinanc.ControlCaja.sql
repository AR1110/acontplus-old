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
-- exec ReporteGestionFinanc.ControlCaja '[{"id":"35"}]'
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
	DECLARE @idEntidad INT
	DECLARE @idControlCaja INT 
	DECLARE @color VARCHAR(200) = '#000000'
	DECLARE @fechaApertura DATETIME
	DECLARE @efectivoSistema DECIMAL(15,5)
	DECLARE @totalSistema DECIMAL(15,5)
	DECLARE @totalArqueo DECIMAL(15,5)
	DECLARE @efectivoArqueo DECIMAL(15,5)
	DECLARE @otros DECIMAL(15,5)
	DECLARE @chequesPosf DECIMAL(15,5)
	DECLARE @direfencia DECIMAL(15,5)

	DECLARE @idRol  INT ;
	

	SELECT @idControlCaja = idControlCaja, @idRol = idUsuarioRol  FROM OPENJSON(@json) WITH (idControlCaja INT '$.id', idUsuarioRol INT '$.idUsuarioRol') AS jsonValues

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol


	SELECT @fechaApertura = fechaApertura FROM dbo.ControlCaja WITH (NOLOCK) WHERE idControlCaja = @idControlCaja
	
	SELECT @chequesPosf     = SUM(abono)  FROM AFTAdministracionCaja() WHERE idControlCaja = @idControlCaja AND cobro = 0 AND estado = 1 AND codpay = 'CHE'  
	
	SELECT @efectivoSistema = SUM(abono)  FROM AFTAdministracionCaja() WHERE idControlCaja = @idControlCaja AND cobro = 1 AND estado = 1 AND codPay = 'EFE'
	
	SELECT @otros           = SUM(abono)  FROM AFTAdministracionCaja() WHERE idControlCaja = @idControlCaja AND cobro = 1 AND estado = 1 AND codPay != 'EFE'

	SELECT @efectivoArqueo = totalArqueo FROM  dbo.ControlCaja WITH (NOLOCK) WHERE idControlCaja = @idControlCaja 

	SELECT @totalSistema = @efectivoSistema + @otros
	
	SELECT @totalArqueo  = @efectivoArqueo  + @otros

	SELECT @direfencia = @totalArqueo - @totalSistema 

	IF @direfencia != 0
		BEGIN
			SET	@color = '#FB0909'
		END 

	----info Ds 
	 SELECT 
		nroControl         = cc.idControlCaja,
		caja               = c.descripcion,
		apertura           = dbo.AFTConvertDate(cc.fechaApertura)+dbo.AFTConvertHora(cc.fechaApertura),
		cierre             = ISNULL(dbo.AFTConvertDate(cc.fechaCierre)+dbo.AFTConvertHora(cc.fechaCierre),'Pendiente'),
		usuario            = u.nombreCompleto,
		estado             = CASE WHEN cc.estado = 1 THEN 'ABIERTA' ELSE 'CERRADA' END,
		entrada            = CAST(cc.entrada AS numeric(15,2)),
		efectivoSistema    = CAST(ISNULL(@efectivoSistema,0) AS numeric(15,2)),
		efectivoArqueo     = CAST(ISNULL(@efectivoArqueo,0) AS numeric(15,2)),
		otros              = CAST(ISNULL(@otros,0) AS numeric(15,2)),
		totalSistema       = CAST(ISNULL(@totalSistema,0) AS numeric(15,2)),
		totalArqueo        = CAST(ISNULL(@totalArqueo,0)  AS numeric(15,2)),
		diferencia         = CAST(ISNULL(@direfencia,0)   AS numeric(15,2)),
		color              = @color
	 FROM dbo.ControlCaja cc WITH (NOLOCK)
	 INNER JOIN dbo.Caja            c WITH (NOLOCK) ON c.idCaja    = cc.idCaja
	 INNER JOIN dbo.AsignacionCaja ac WITH (NOLOCK) ON ac.idCaja   = c.idCaja
	 INNER JOIN dbo.Usuario         u WITH (NOLOCK) ON u.idUsuario = ac.idUsuario
	 WHERE cc.idControlCaja = @idControlCaja

	



	 -----------------------------------RESUMEN TOTALIZADO EN LAS FORMAS DE PAGO----------------------------------------
	 SELECT  
		formaPago = ef.descripcion,
	    ingreso   = CAST(ISNULL((SELECT sum(abono) FROM AFTAdministracionCaja() WHERE estado = 1 AND tipo!= 4 AND idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1 AND idControlCaja = @idControlCaja),0) AS numeric(15,2) ),
		egreso    = CAST(ISNULL((SELECT sum(abono) FROM AFTAdministracionCaja() WHERE estado = 1 AND tipo = 4 AND idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1 AND idControlCaja = @idControlCaja),0) * -1 AS numeric(15,2))		
	 FROM EntidadFinanciera ef WITH (NOLOCK)
	 ORDER BY EF.fechaRegistro ASC
	 -------------------------------------------------END----------------------------------------------------------------



	 -----------------------------------RESUMEN TOTALIZADO DE DOCUMENTOS--------------------------------------------------

	 SELECT 
		tipDoc   = td.descripcion
	   ,total    = CAST(ISNULL((SELECT SUM(ac.total) FROM AFTAdministracionCaja() ac WHERE ac.idcontrolcaja = @idControlCaja AND ac.tipDoc = td.codigo AND ac.cobro = 1 ),0) AS numeric(15,2))
	   ,abono    = CAST(ISNULL((SELECT SUM(ac.abono) FROM AFTAdministracionCaja() ac WHERE ac.idcontrolcaja = @idControlCaja AND ac.tipDoc = td.codigo AND ac.cobro = 1 ),0) AS numeric(15,2))
	   ,cantidad =     (ISNULL((SELECT COUNT(*)      FROM AFTAdministracionCaja() ac WHERE ac.idcontrolcaja = @idControlCaja AND ac.tipDoc = td.codigo),0))
	 FROM dbo.TipoDocumento td WITH (NOLOCK)
	 WHERE td.codigo IN ('FV','NE','IC','EC','A')
	 
	  -------------------------------------------------END-----------------------------------------------------------------


	 SELECT 
		tipoDoc = codigo,
		nroDoc ,
		fechaEmision = dbo.AFTConvertDate(fechaEmision)+dbo.AFTConvertHora(fechaEmision),
		cliente,
		total = CAST(total as numeric(15,2))
	 FROM AFTDocumentoForPayment() 
	 WHERE gestion = 1 AND idEntidad = @idEntidad AND CAST(fechaEmision AS date) = CAST(@fechaApertura AS date)


	 -----------------------------HISTORIAL DE MOVIMIENTO POR DOCUMENTO DEL CONTROL DE CAJA-----------------------------
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
	 WHERE estado = 1 AND idEntidad = @idEntidad AND idControlCaja = @idControlCaja
	 ORDER BY tipo,nroDoc,nroCobro ASC 

	 ------------------------------------------------END----------------------------------------------------------------
	

	 SELECT @chequesPosf as chequePosfechado
	 
END 
