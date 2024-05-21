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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- ============================================= 
CREATE OR ALTER PROCEDURE Config.PtoEmi_Asig_Insert 
	@userRoleId INT
   ,@json VARCHAR(MAX)
   
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	DECLARE @usuario VARCHAR(150)
	DECLARE @predeterminado BIT 
	DECLARE @ptoEmi VARCHAR(5)
	DECLARE @message VARCHAR(150)

    DECLARE @id INT 
    DECLARE @codEstab_Asig VARCHAR(150)
    DECLARE @idPuntoEmision INT

    SELECT 
        @codEstab_Asig = codEstab_Asig
        ,@idPuntoEmision = idPuntoEmision
        ,@id             = idPtoEmi_Asig
    FROM OPENJSON(@json)
    WITH(
        codEstab_Asig VARCHAR(150)
        ,idPuntoEmision INT
        ,idPtoEmi_Asig INT
    )

	BEGIN TRY
		
		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

		SELECT @usuario = nombreUsuario FROM dbo.Usuario WHERE idUsuario = @idUsuario

		SELECT @ptoEmi = ptoEmi FROM dbo.PuntoEmision WHERE idPuntoEmision = @idPuntoEmision

		SET @predeterminado = IIF ((SELECT COUNT(*) FROM Config.PtoEmi_Asig WHERE codEstab_Asig = @codEstab_Asig ) = 0,1,0)

		BEGIN TRAN 
			IF @id = 0
				BEGIN
					INSERT INTO Config.PtoEmi_Asig(codEstab_Asig,idPuntoEmision,ptoEmi,predeterminado,usuario,fechaRegistro)
					SELECT @codEstab_Asig,@idPuntoEmision,@ptoEmi,@predeterminado,@usuario,dbo.ufnGetDateEcuador()
					SET @message = 'Registrado Correctamente'

				END 
			IF @id > 0 
				BEGIN
					DELETE FROM Config.PtoEmi_Asig WHERE idPtoEmi_Asig = @id
					SET @message = 'Eliminado Correctamente'
				END 
		COMMIT TRAN  
        SELECT [Common].[ufnSpResponse]('1',@message,DEFAULT)
		RETURN 
	END TRY 

	BEGIN CATCH	 
        SELECT [Common].[ufnSpResponse]('0',ERROR_MESSAGE(),DEFAULT)

		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
	END CATCH 

END
GO
