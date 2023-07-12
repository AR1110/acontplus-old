USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Get]    Script Date: 12/15/2022 11:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-10-06
-- Description:	SP para listar los clietes
-- =============================================
-- Ventas.Aprob_Document_Get_Id 14
IF OBJECT_ID(N'Ventas.Aprob_Document_Get_Id', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Get_Id 
GO

-- exec Ventas.Aprob_Document_Get_Id 9
CREATE PROCEDURE Ventas.Aprob_Document_Get_Id @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @uniqueId VARCHAR(150)
	DECLARE @idTipoDocumento INT 
	
	SELECT @uniqueId = uniqueId FROM Ventas.Aprob_Document WHERE idAprob_Document = @id
	SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

	SELECT 
		d.idAprob_Document
	   ,d.uniqueId
	   ,idTiempoCredito = ISNULL(cl.idTiempoCredito, 0)
	   ,d.idPuntoEmision
	   ,d.estab
	   ,d.ptoEmi
	   ,serieComprobante = d.estab+'-'+d.ptoEmi+'-'+Helper.F_Auto_Sequential(d.secuencial)
	   ,d.identificacionComprador
	   ,d.codDoc
	   ,d.docOrigen
	   ,d.fechaEmision	 
	   ,d.observacion
	   ,codigoPorcentaje = CONVERT(VARCHAR(3), d.codigoPorcentaje)
	   ,totalSinImpuestos
	   ,totalDescuento
	   ,totalConImpuestos
	   ,propina
	   ,importeTotal	   
	FROM Ventas.Aprob_Document d
	INNER JOIN Cliente cl ON cl.idCliente = d.idCliente
	WHERE d.idAprob_Document = @id

	SELECT 
		cl.idCliente,
		cl.nombreComercial,
		cl.nombreFiscal,
		cl.numeroIdentificacion,
		direccion = ISNULL(cl.direccion,'')
		,tipoIdentificacion = ti.codigo 
	FROM Ventas.Aprob_Document aprob_doc
	INNER JOIN Cliente cl WITH(NOLOCK) ON cl.idCliente = aprob_doc.idCliente
	LEFT JOIN TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
	WHERE aprob_doc.idAprob_Document = @id;

	SELECT 
		idAprob_Document_Detailt
	   ,a.idArticulo
	   ,m.idMedida
	   ,t.idTipoIva
	   ,dt.idTarifa
	   ,dt.idBodega
	   ,a.codigo
	   ,dt.descripcion
	   ,medida = m.descripcion
	   ,dt.cantidad
	   ,dt.precioUnitario	
	   ,precioConIva = CAST(((dt.precioUnitario * (dt.tarifa / 100)) + dt.precioUnitario) AS decimal(18, 2)) -- dt.precioUnitario + dt.valor
	   ,porcentajeDescuento = CASE WHEN dt.precioUnitario=0 THEN 0 ELSE  (dt.descuento / dt.precioUnitario) * 100   END   
	   ,precioTotalSinImpuesto = (dt.precioUnitario - dt.descuento) * dt.cantidad
	   ,dt.descuento
	   ,totalDescuento = dt.cantidad * dt.descuento
	   ,nombreTipoIva = t.descripcion
	   ,valor = t.porcentaje
	   ,codigoTipoIva = t.codigo
	   ,codigoPorcentaje = CONVERT(VARCHAR(4), dt.codigoPorcentaje)
	   ,tarifa = dt.tarifa
	   ,datosAdicionales = a.datosAdicionales
	FROM  Ventas.Aprob_Document_Detailt dt
	INNER JOIN dbo.Articulo a ON a.code_unique      = dt.codArticulo
	INNER JOIN dbo.Medida   m ON m.codigo           = dt.codMedida
	INNER JOIN dbo.TipoIva  t ON t.codigoPorcentaje = dt.codigoPorcentaje
	WHERE dt.uniqueId = @uniqueId AND dt.estado = 1 ORDER BY dt.idAprob_Document_Detailt ASC 

	SELECT 
		 tipoDoc  = CASE WHEN codDocumento = 'PR' THEN 'Proforma' 
			             WHEN codDocumento = 'NE' THEN 'NotaEntrega' 
			             ELSE '' END 
		,serieComprobante = serie
	FROM Ventas.Aprob_Document_Hist WHERE uniqueId = @uniqueId
	
	SELECT 
		ia.idInfoAdicionalDoc,
		ia.nombre,
		ia.valor,
		ia.estado
	FROM InfoAdicionalDoc ia
	WHERE ia.idComprobante = @id AND ia.idTipoDocumento = @idTipoDocumento

	-----------------------------------------------------Datos Adicionales de Articulo------------------------------------
	SELECT h.idDocumento, h.idHistoryInfoAdicional, selected = CAST(1 as BIT), i.* FROM Ventas.HistoryInfoAdicional h WITH(NOLOCK)
	INNER JOIN Compra.InfoAdicional i WITH(NOLOCK) ON i.idInfoAdicional = h.idInfoAdicional
	WHERE h.codDoc='APR' AND h.idDocumento = @id	
	


END

