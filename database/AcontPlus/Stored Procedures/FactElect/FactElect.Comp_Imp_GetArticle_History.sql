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
-- Author:		Ivan Paz
-- Create date: 2022-09-19
-- Description:	SP PARA OBTENER LOS ARTICULOS SIMILARES A LOS IMPORTADOS
-- =============================================
--FactElect.Comp_Imp_GetArticle_History 38, 100
IF OBJECT_ID(N'FactElect.Comp_Imp_GetArticle_History ', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Comp_Imp_GetArticle_History
GO
CREATE PROCEDURE FactElect.Comp_Imp_GetArticle_History 
@idRol INT
,@id INT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idEntidad INT

	SELECT @idEntidad = idEntidad FROM AFTDataRol(@idRol)
	

	SELECT p.nombreFiscal proveedor
	--,ISNULL(fc.estab,'') + ' - ' + 
	,fc.puntoEmision + ' - ' + CONVERT(VARCHAR, fc.nroDocumento) nroDocumento
	,fc.fechaEmision
	,fcd.cantidad
	,fcd.precioCosto precioUnitario
	INTO #Temp
	FROM dbo.Articulo a  
	INNER JOIN FacturaCompraDetalle fcd ON a.idArticulo = fcd.idArticulo
	INNER JOIN FacturaCompra fc ON fcd.idFacturaCompra = fc.idFacturaCompra 
	AND fc.idEntidad = @idEntidad
	INNER JOIN Proveedor p ON fc.idProveedor = p.idProveedor 
	AND p.idEntidad = @idEntidad
	WHERE  a.idArticulo = @id
	ORDER BY fc.fechaEmision DESC
	
	SELECT TOP 10 * FROM #Temp fc 
	GROUP BY fc.proveedor
	,fc.nroDocumento
	,fc.fechaEmision
	,fc.cantidad
	,fc.precioUnitario
	ORDER BY fechaEmision DESC
	DROP TABLE #Temp

END
GO
