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
-- Author:		Ivan Paz
-- Create date: 2022-12-29
-- Description:	sp for save printer config
-- =============================================
IF OBJECT_ID(N'Restaurant.ConfigPrinter_Insert', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConfigPrinter_Insert
GO
CREATE PROCEDURE Restaurant.ConfigPrinter_Insert @idRol INT
,@estado BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab VARCHAR(50) 
	DECLARE @idUsuario INT = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol)

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1

	IF NOT EXISTS (SELECT 1 FROM Restaurant.ConfigPrinter WHERE codEstab = @codEstab)
		BEGIN
			INSERT INTO Restaurant.ConfigPrinter (codEstab, estado, idUsuario)
			VALUES(@codEstab, @estado, @idUsuario)
			SELECT '1' code, 'Configuración Exitosa' as 'message'
		END
	ELSE
		BEGIN
		UPDATE Restaurant.ConfigPrinter SET estado = @estado WHERE codEstab = @codEstab
		SELECT '1' code, 'Configuración Exitosa' as 'message'
	END

END
GO
