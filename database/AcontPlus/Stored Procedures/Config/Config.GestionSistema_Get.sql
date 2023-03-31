USE AcontPlus
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
IF OBJECT_ID(N'Config.GestionSistema_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.GestionSistema_Get 
GO
CREATE PROCEDURE Config.GestionSistema_Get @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT 
		gs.idGestionSistema
	   ,gs.idCliente
	   ,gs.idTipoIva
	   ,gs.idArticulo
	   ,gs.idMetodoValoracion
	   ,gs.searchCode
	   ,llevaInventario = IIF(gs.llevaInventario = 'SI',CAST(1 AS BIT),CAST(0 AS BIT))
	   ,customerDefault = IIF(gs.idCliente IS NULL ,CAST(0 AS BIT),CAST(1 AS BIT))
	   ,taxesDefault =    IIF(gs.idTipoIva IS NULL ,CAST(0 AS BIT),CAST(1 AS BIT))
	   ,articleDefault = IIF(gs.idArticulo IS NULL,CAST(0 AS BIT),CAST(1 AS BIT))
	   ,nombreFiscal = cl.nombreFiscal
	   ,descripcion = a.descripcion
	FROM Config.GestionSistema gs
	LEFT JOIN dbo.Cliente cl ON cl.idCliente = gs.idCliente
	LEFT JOIN dbo.Articulo a ON a.idArticulo = gs.idArticulo
	WHERE gs.idEntidad = @idEntidad
	
END
GO
