USE AcontPlus;
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('Ventas.Cliente_Get_Data_Form')IS NOT NULL
	DROP PROCEDURE Ventas.Cliente_Get_Data_Form
GO
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 22-04-2023 20h43 
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE Ventas.Cliente_Get_Data_Form
	@idUsuarioRol INT, 
	@json VARCHAR(800)
AS
BEGIN
	
	SET NOCOUNT ON;
	DECLARE @idEntidad INT = (SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
    
	-- Insert statements for procedure here
	SELECT codigoSri, codigo, idTipoIdentificacion, descripcion FROM TipoIdentificacion WHERE codigo IN('C','R','P','CF')
	
	SELECT idSubContribuyente, descripcion, codigo FROM SubContribuyente WHERE estado = 1 ORDER BY idSubContribuyente desc
	
	SELECT idTiempoCredito, descripcion, diasCredito, numeroCuota, entrada, tipo 
	FROM TiempoCredito 
	WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

	SELECT c.idCiudad, ciudad = c.descripcion, c.codigo, c.estado, c.idProvincia, provincia = pr.descripcion
	FROM Ciudad c
	INNER JOIN Provincia pr ON pr.idProvincia = c.idProvincia
	
END
GO
