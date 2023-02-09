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
ALTER PROCEDURE Config.PlanCliente_GetAccess @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @menu NVARCHAR(MAX)
		   ,@subMenu NVARCHAR(MAX)
		   ,@accion NVARCHAR(MAX)


	SELECT 
		m.idMenu
	   ,m.descripcion
	   ,m.codigo
	FROM Config.PlanCliente pl
	INNER JOIN Config.LicenciaPlan lp ON lp.idLicenciaPlan = pl.idLicencia
	INNER JOIN Config.AplicacionMenu am ON am.idAplicacion = lp.idAplicacion
	INNER JOIN Config.Menu m ON m.idMenu = am.idMenu
	WHERE pl.idEntidad = @id
END
GO
