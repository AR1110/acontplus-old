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
IF OBJECT_ID(N'Config.Bodeg_Asig_Insert', N'P') IS NOT NULL
DROP PROCEDURE Config.Bodeg_Asig_Insert
GO
CREATE PROCEDURE Config.Bodeg_Asig_Insert 
	 @idRol INT
	,@id INT
	,@codEstab_Asig VARCHAR(150)
	,@idBodega INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	DECLARE @usuario VARCHAR(150)
	DECLARE @predeterminado BIT 
	DECLARE @message VARCHAR(150)

	BEGIN TRY
		
		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

		SELECT @usuario = nombreUsuario FROM dbo.Usuario WHERE idUsuario = @idUsuario

		SET @predeterminado = IIF ((SELECT COUNT(*) FROM Config.Bodeg_Asig WHERE codEstab_Asig = @codEstab_Asig ) = 0,1,0)

		BEGIN TRAN 
			IF @id = 0
				BEGIN
					INSERT INTO Config.Bodeg_Asig(codEstab_Asig,idBodega,predeterminado,usuario,fechaRegistro)
					SELECT @codEstab_Asig,@idBodega,@predeterminado,@usuario,dbo.ufnGetDateEcuador()
					SET @message = 'Registrado Correctamente'
				END 
			IF @id > 0 
				BEGIN
					DELETE FROM Config.Bodeg_Asig WHERE idBodeg_Asig = @id
					SET @message = 'Eliminado Correctamente'
				END 
		COMMIT TRAN 
		SELECT '1'code,@message as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH	
		SELECT '0'code,ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
	END CATCH 
END
GO
