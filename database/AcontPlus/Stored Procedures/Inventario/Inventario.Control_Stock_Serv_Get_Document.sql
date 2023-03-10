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
IF OBJECT_ID(N'Inventario.Control_Stock_Serv_Get_Document', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Control_Stock_Serv_Get_Document 
GO
CREATE PROCEDURE Inventario.Control_Stock_Serv_Get_Document @idArticulo INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @idEntidad AS INT 
    DECLARE @ruc AS VARCHAR(20)
	DECLARE @saldo AS DECIMAL(15,5)
	
	
	SELECT TOP 1 @idEntidad = idEntidad FROM dbo.Articulo WITH (NOLOCK) WHERE idArticulo = @idArticulo 
	SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

	SELECT @saldo = SUM(dbo.AFTStockBodega(@idArticulo,b.idBodega))
	FROM dbo.Bodega b WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento e ON e.codEstab = b.codEstab
	WHERE e.ruc = @ruc

	SELECT saldo = ISNULL(@saldo,0)
END
GO
