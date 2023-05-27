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


	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	IF @tipo = 2
		BEGIN
			DECLARE @idComprobanteIngreso AS INT 

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
			WHERE idComprobanteIngreso = @idComprobanteIngreso

			SELECT co.idCobro
				  ,co.valor
				  ,co.abono
				  ,fechaEmision = FORMAT(co.fechaEmision, 'MM/dd/yyyy')
				  ,subEntidadFinanciera = ISNULL(sf.descripcion, ef.descripcion)
				  ,co.infoCobro
				  ,posfechado = CASE WHEN co.posfechado = 1 THEN  'SI' ELSE 'NO' END 
			      ,estado     = CASE WHEN co.cobro = 1 THEN 'COBRADO' ELSE 'POR COBRAR' END
			FROM dbo.Cobro                   co WITH (NOLOCK) 
			INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
			 LEFT JOIN SubEntidadFinanciera  sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
			 LEFT JOIN Banco                 bc WITH (NOLOCK) ON bc.idBanco                = co.idBanco
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso

			SELECT cd.idCobroDetalle
			      ,cd.idCobro 
				  ,codDoc = td.codigo
				  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				  ,cx.nroCuota
				  ,cx.cuota
				  ,cd.abono
				  ,saldo = cx.cuota - cd.abono
				  ,serieComprobante = CASE td.codigo WHEN 'FV' THEN (
																	  SELECT es.estab  + '-' + pe.ptoEmi + '-' + Helper.F_Auto_Sequential(fe.nroFactura) 
																	  FROM dbo.Factura               fe WITH (NOLOCK) 
																	  INNER JOIN dbo.puntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = fe.idPuntoEmision
																	  INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
																	  WHERE fe.idFactura = cx.idComprobante
																	)
												     WHEN 'NE' THEN (
																	  SELECT es.estab  + '-' + pe.ptoEmi + '-' + Helper.F_Auto_Sequential(ne.nroDocumento) 
																	  FROM dbo.NotaEntrega           ne WITH (NOLOCK) 
																	  INNER JOIN dbo.puntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision
																	  INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
																	  WHERE ne.idNotaEntrega = cx.idComprobante
																	)
	   END 
			FROM dbo.CobroDetalle        cd WITH (NOLOCK)
			INNER JOIN dbo.Cobro         co WITH (NOLOCK) ON co.idCobro         = cd.idCobro
			INNER JOIN dbo.CuotaXCobrar  cx WITH (NOLOCK) ON cx.idCuotaXCobrar  = cd.idCuotaXCobrar
			INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = cx.idTipoDocumento
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso
		END

END
GO
