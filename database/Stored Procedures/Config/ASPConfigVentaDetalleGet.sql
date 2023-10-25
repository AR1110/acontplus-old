
USE [AcontPlus]


IF OBJECT_ID('ASPConfigVentaDetalleGet')IS NOT NULL
	DROP PROCEDURE ASPConfigVentaDetalleGet
GO

CREATE PROCEDURE ASPConfigVentaDetalleGet @idRol INT, @json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT = (SELECT idEntidad FROM dbo.AFTDataRol(@idRol));

	SELECT 	
	*
	FROM ConfigVentaDetalle WHERE idEntidad = @idEntidad


END 