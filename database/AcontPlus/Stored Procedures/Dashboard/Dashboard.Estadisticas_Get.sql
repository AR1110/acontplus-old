USE [AcontPlus]

GO
/****** Object:  StoredProcedure [dbo].[ASPDashboardGestionCantidad]    Script Date: 05/21/2023 9:07:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-09-10
-- Description:	SP para contar la cantidad de datos por empresa
-- =============================================
IF OBJECT_ID('Dashboard.Estadisticas_Get') IS NOT NULL
DROP PROCEDURE Dashboard.Estadisticas_Get
GO
CREATE PROCEDURE Dashboard.Estadisticas_Get @idUsuarioRol INT
,@json VARCHAR(MAX) = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 

	DECLARE @cantidadArticulo INT 
		   ,@cantidadCliente INT 
		   ,@cantidadProveedor INT 
		   ,@cantidadUsuario INT 
		   ,@idEntidad INT = (SELECT idEntidad FROM App.UsuarioRol WHERE idUSuarioRol = @idUsuarioRol)
		   ,@facturaVenta int 
		   ,@notaEntrega int 
		   ,@proforma int 
		   ,@facturaCompra int 
		
	SET @cantidadArticulo  =(SELECT COUNT(*) FROM Articulo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @cantidadUsuario   =(SELECT COUNT(*) FROM Usuario WITH (NOLOCK) WHERE idUsuario IN (SELECT idUsuario FROM Rol WHERE idEntidad = @idEntidad))
	SET @cantidadProveedor =(SELECT COUNT(*) FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad and estado = 1)
	SET @cantidadCliente   =(SELECT COUNT(*) FROM Cliente WITH (NOLOCK) WHERE idEntidad = @idEntidad and estado = 1)
	SET @facturaVenta	   =(SELECT COUNT(*) FROM Factura WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @notaEntrega	   =(SELECT COUNT(*) FROM NotaEntrega WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @proforma		   =(SELECT COUNT(*) FROM Proforma WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @facturaCompra	   =(SELECT COUNT(*) FROM FacturaCompra WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	
	
	 SELECT @cantidadUsuario   as cantidadUsuario,
		@cantidadArticulo  as cantidadArticulo,
		@cantidadCliente   as cantidadCliente,
		@cantidadProveedor as cantidadProveedor,
		@facturaVenta	   as cantidadFacturaV,
		@facturaCompra	   as cantidadFacturaC,
		@proforma		   as cantidadProforma,
		@notaEntrega	   as cantidadNotaEntrega

END

GO

--DROP PROCEDURE IF EXISTS [dbo].[ASPDashboardGestionCantidad]