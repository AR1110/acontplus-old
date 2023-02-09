-- ================================================
-- Template generated from Template Explorer using:
-- Create Multi-Statement Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
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
ALTER FUNCTION App.F_MenuLicencia_Get
(
	@idEntidad INT
)
RETURNS 
@table TABLE 
(
	-- Add the column definitions for the TABLE variable here
	id INT IDENTITY(1,1),
	menu NVARCHAR(MAX),
	subMenu NVARCHAR(MAX),
	accion NVARCHAR(MAX)
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set
	DECLARE @menu NVARCHAR(MAX),
			@subMenu NVARCHAR(MAX),
			@accion NVARCHAR(MAX)

		SET @menu = (SELECT m.idMenu,m.codigo,m.icono,m.urlMenu,0 as estado 
					 FROM Config.PlanCliente pcl
					 INNER JOIN Config.LicenciaPlan lp ON lp.idLicencia = pcl.idLicencia
					 INNER JOIN Config.AplicacionMenu am ON am.idAplicacion = lp.idAplicacion
					 INNER JOIN Config.Menu m ON m.idMenu = am.idMenu
					 WHERE pcl.idEntidad = @idEntidad 
					 GROUP BY m.idMenu,m.codigo,m.icono,m.urlMenu
					 FOR JSON PATH)

		SET @subMenu = (SELECT am.idAplicacionMenu,sm.idSubMenu,sm.idMenu,sm.codigo,sm.codMenu,sm.icono,sm.urlSubMenu,0 as estado 
						FROM Config.PlanCliente pcl
						INNER JOIN Config.LicenciaPlan lp ON lp.idLicencia = pcl.idLicencia
						INNER JOIN Config.AplicacionMenu am ON am.idAplicacion = lp.idAplicacion
						INNER JOIN Config.SubMenu sm ON sm.idSubMenu = am.idSubMenu
						WHERE pcl.idEntidad = @idEntidad 
						FOR JSON PATH)

		SET @accion = (SELECT a.idAsignacion,ac.idAccion,ac.descripcion,ac.codigo,a.idSubMenu,a.codSubMenu , 0 as estado
					   FROM Config.PlanCliente pcl
					   INNER JOIN Config.LicenciaPlan lp ON lp.idLicencia = pcl.idLicencia
					   INNER JOIN Config.AplicacionMenu am ON am.idAplicacion = lp.idAplicacion
					   INNER JOIN Config.SubMenu sm ON sm.idSubMenu = am.idSubMenu
					   INNER JOIN Config.Asignacion a ON a.idSubMenu = sm.idSubMenu
					   INNER JOIN Config.Accion ac ON ac.idAccion = a.idAccion
					   WHERE pcl.idEntidad = @idEntidad 
					   FOR JSON PATH)

		INSERT INTO @table (menu,subMenu,accion)
		SELECT @menu,@subMenu,@accion
	RETURN 
END
GO