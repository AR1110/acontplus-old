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
ALTER PROCEDURE Config.AplicacionMenu_Get @json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON
	SET LANGUAGE SPANISH;

	SELECT 
		 am.idAplicacionMenu
		,am.idAplicacion
		,am.idMenu
		,am.idSubMenu
		,am.estado
		,aplicacion = a.descripcion
		,menu = m.descripcion
		,subMenu = sm.descripcion
	FROM Config.AplicacionMenu am 
	INNER JOIN Config.Aplicacion a ON a.idAplicacion = am.idAplicacion
	INNER JOIN Config.Menu m ON m.idMenu = am.idMenu
	INNER JOIN Config.SubMenu sm ON sm.idSubMenu = am.idSubMenu

END
GO
