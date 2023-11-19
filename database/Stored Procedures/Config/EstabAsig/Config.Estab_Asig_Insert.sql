USE [AcontPlus]
GO
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
IF OBJECT_ID(N'Config.Estab_Asig_Insert', N'P') IS NOT NULL
DROP PROCEDURE Config.Estab_Asig_Insert
GO
CREATE PROCEDURE Config.Estab_Asig_Insert @userRoleId INT ,@json VARCHAR(MAX) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab_Asig VARCHAR(150)
	DECLARE @message VARCHAR(200)
	DECLARE @predeterminado BIT

    --> Data json
    DECLARE @id INT ,@idUsuarioRol INT ,@codEstab VARCHAR(25)

	BEGIN TRY 
		
        SELECT @id = id, @idUsuarioRol = idUsuarioRol, @codEstab = codEstab FROM OPENJSON(@json) WITH (id INT, idUsuarioRol INT, codEstab VARCHAR(50))

		SELECT @codEstab_Asig = NEWID()

		SET @predeterminado = IIF ((SELECT COUNT(*) FROM Config.Estab_Asig WHERE idUsuarioRol = @idUsuarioRol ) = 0,1,0)

        IF EXISTS (SELECT 1 FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol AND codEstab = @codEstab)
            BEGIN
                SELECT Common.ufnSpResponse('0','Ya existe este Acceso',NULL)
                RETURN 
            END 

		BEGIN TRAN 
			IF @id = 0 
				BEGIN
					INSERT INTO Config.Estab_Asig(codEstab_Asig,idUsuarioRol,codEstab,predeterminado,usuario,fechaRegistro)
					SELECT @codEstab_Asig,idUsuarioRol,@codEstab,@predeterminado,nombreUsuario,dbo.ufnGetDateEcuador() FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
					SET @message = 'Registrado Correctamente' 

				END 
			ELSE IF @id > 0
				BEGIN
					DELETE FROM Config.Estab_Asig WHERE idEstab_Asig = @id
					SET @message = 'Eliminado Correctamente' 
				END 
		COMMIT TRAN
		SELECT Common.ufnSpResponse('1',@message,NULL)
	END TRY 

	BEGIN CATCH 
		SELECT Common.ufnSpResponse('0',ERROR_MESSAGE(),NULL)
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
	END CATCH 
END 
GO
