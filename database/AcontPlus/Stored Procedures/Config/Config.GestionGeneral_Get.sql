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
--EXEC Config.GestionGeneral_Get 24,'[]'
-- =============================================
ALTER PROCEDURE Config.GestionGeneral_Get @idRol INT,@jsonParams NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @byEntidad INT 

	SELECT @byEntidad = idEntidad FROM AFTDataRol(@idRol)

	EXEC [Config].[CantidadDecimal_Get]  @idRol,@jsonParams

	SELECT 
		 codigoTipoIva = ti.codigo
		,valorTipoIva = ti.porcentaje
		,tipoIva = ti.descripcion
	FROM dbo.ConfigPorcentaje cp 
	INNER JOIN dbo.TipoIva ti ON ti.idTipoIva = cp.idTipoIva
	WHERE cp.idEntidad = @byEntidad

END
GO
