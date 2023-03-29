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
	
	SELECT @uniqueId = uniqueId FROM Ventas.Aprob_Document WHERE idAprob_Document = @id

	SELECT 
		d.idAprob_Document
	   ,d.uniqueId
	   ,d.idCliente
	   ,idTiempoCredito = ISNULL(cl.idTiempoCredito, 0)
	   ,d.idPuntoEmision
	   ,d.estab
	   ,d.ptoEmi
	   ,cliente = cl.nombreFiscal
	   ,d.identificacionComprador
	   ,direccion = ISNULL(cl.direccion, NULL)
	   ,d.docOrigen
	   ,d.fechaEmision
	   ,total = d.importeTotal
	   ,d.observacion
	   ,codigoPorcentaje = CONVERT(VARCHAR(3), d.codigoPorcentaje)
	FROM Ventas.Aprob_Document d
	INNER JOIN Cliente cl ON cl.idCliente = d.idCliente
	WHERE d.idAprob_Document = @id

	SELECT 
		idAprob_Document_Detailt
	   ,a.idArticulo
	   ,m.idMedida
	   ,t.idTipoIva
	   ,dt.idTarifa
	   ,a.codigo
	   ,dt.descripcion
	   ,medida = m.descripcion
	   ,dt.cantidad
	   ,dt.precioUnitario	
	   ,precioConIva = dt.precioUnitario + dt.valor
	   ,porcentajeDescuento = CASE WHEN dt.precioUnitario=0 THEN 0 ELSE  (dt.descuento / dt.precioUnitario) * 100   END   
	   ,precioTotalSinImpuesto = (dt.precioUnitario - dt.descuento) * dt.cantidad
	   ,dt.descuento
	   ,nombreTipoIva = t.descripcion
	   ,valor = t.porcentaje
	   ,codigoTipoIva = t.codigo
	   ,codigoPorcentaje = CONVERT(VARCHAR(4), dt.codigoPorcentaje)
	   ,tarifa = dt.tarifa
	FROM  Ventas.Aprob_Document_Detailt dt
	INNER JOIN dbo.Articulo a ON a.code_unique      = dt.codArticulo
	INNER JOIN dbo.Medida   m ON m.codigo           = dt.codMedida
	INNER JOIN dbo.TipoIva  t ON t.codigoPorcentaje = dt.codigoPorcentaje
	WHERE dt.uniqueId = @uniqueId AND dt.estado = 1 ORDER BY dt.idAprob_Document_Detailt ASC 

END

