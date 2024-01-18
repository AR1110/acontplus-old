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
    DECLARE @asignacion VARCHAR(MAX) ,@descripcion VARCHAR(150)

    DECLARE @tbAsig AS TABLE(
        idTurno INT NOT NULL
       ,idUsuario INT NOT NULL
    )

    BEGIN TRY
        
        --> Recuperando Datos
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuarioRegistro = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT @asignacion = asignacion ,@descripcion = descripcion FROM OPENJSON(@json) WITH (asignacion NVARCHAR(MAX) as json,descripcion VARCHAR(100))

        INSERT INTO @tbAsig 
              (idTurno,idUsuario)
        SELECT idTurno,idUsuario FROM OPENJSON(@asignacion) WITH (idUsuario INT, idTurno INT)

        --> Validacion de informacion
        IF (SELECT COUNT(*) FROM @tbAsig) = 0 
            BEGIN
			    SELECT [Common].[ufnSpResponse]('0','Error en la asignacion de usuario',DEFAULT)
			    RETURN 
		    END

        IF EXISTS(SELECT 1 FROM dbo.AsignacionCaja WITH (NOLOCK) WHERE idUsuario IN (SELECT idUsuario FROM @tbAsig) AND idEntidad = @idEntidad)
		    BEGIN
			    SELECT [Common].[ufnSpResponse]('0','Este Usuario ya cuenta con una Caja asignada en la empresa',DEFAULT)
			    RETURN 
		    END

        BEGIN TRAN 
            INSERT INTO Caja (descripcion, idEntidad, idUsuario) 
			SELECT LTRIM(RTRIM(@descripcion)), @idEntidad,@idUsuarioRegistro
            
            SELECT @id = SCOPE_IDENTITY()
            
            INSERT INTO AsignacionCaja 
				   (idCaja,idTurno,idUsuario,idUsuarioRegistro,idEntidad)
			SELECT @id    ,idTurno,idUsuario,@idUsuarioRegistro,@idEntidad FROM @tbAsig

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
