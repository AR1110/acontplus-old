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
CREATE PROCEDURE Config.LicenciaPlan_Get @json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT 
		 lp.idLicenciaPlan
		,lp.idLicencia
		,lp.idAplicacion
		,lp.costo
		,lp.descuento
		,lp.impuesto
		,licencia = l.descripcion
		,aplicacion = apl.descripcion
	FROM Config.LicenciaPlan lp
	INNER JOIN Config.Licencia l ON l.idLicencia = lp.idLicencia
	INNER JOIN Aplicacion apl ON apl.idAplicacion = lp.idAplicacion
END
GO
