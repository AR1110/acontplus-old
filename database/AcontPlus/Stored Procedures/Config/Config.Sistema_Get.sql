USE AcontPlus;

IF OBJECT_ID('Config.Sistema_Get')IS NOT NULL
	DROP PROCEDURE Config.Sistema_Get
GO


-- =============================================
-- Author:		Ramirez Alexis.
-- Create date: 5/09/2023 11:57 AM
-- Description:	GET para traer la configuracion del sistema
-- =============================================

CREATE PROCEDURE Config.Sistema_Get @idUsuarioRol INT, @json VARCHAR(300)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad AS INT
	DECLARE @codConfig AS VARCHAR(5)

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
	
	SELECT @codConfig = codConfig FROM OPENJSON(@json) WITH (codConfig VARCHAR(5) '$.codConfig')

	SELECT jsonConfig FROM Config.Sistema WHERE idEntidad = @idEntidad AND codConfig = @codConfig


END
GO
