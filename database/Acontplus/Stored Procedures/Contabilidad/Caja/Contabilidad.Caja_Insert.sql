USE [Acontplus]
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
CREATE OR ALTER PROCEDURE Contabilidad.Caja_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @idUsuarioRegistro INT ,@idEntidad INT ,@id INT

    --> Datajson
    DECLARE @idTurno INT ,@idUsuario INT ,@descripcion VARCHAR(150)

    BEGIN TRY
        
        --> Recuperando Datos
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuarioRegistro = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT @idTurno     = idTurno
              ,@idUsuario   = idUsuario
              ,@descripcion = descripcion
        FROM OPENJSON(@json) WITH 
        (
            idTurno     INT
		   ,idUsuario   INT
           ,descripcion VARCHAR(100)
        )

        --> Validacion de informacion
        IF EXISTS(SELECT 1 FROM dbo.AsignacionCaja WITH (NOLOCK) WHERE idUsuario = @idUsuario AND idEntidad = @idEntidad)
		    BEGIN
			    SELECT [Common].[ufnSpResponse]('0','Este Usuario ya cuenta con una Caja asignada en la empresa',DEFAULT)
			    RETURN 
		    END

        BEGIN TRAN 
            INSERT INTO Caja (descripcion, idEntidad, idUsuario) 
			SELECT LTRIM(RTRIM(@descripcion)), @idEntidad,@idUsuario
            
            SELECT @id = SCOPE_IDENTITY()
            
            INSERT INTO AsignacionCaja 
				   (idCaja,idTurno,idUsuario,idUsuarioRegistro,idEntidad)
			SELECT @id    ,@idTurno,@idUsuario,@idUsuarioRegistro,@idEntidad

        COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1','Registrado Correctamen',DEFAULT)
    END TRY 

    BEGIN CATCH
        IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
		SELECT [Common].[ufnSpResponse]( '0','Info: Error en el procedimiento',DEFAULT)

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Caja/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuarioRegistro
    END CATCH

END
GO
