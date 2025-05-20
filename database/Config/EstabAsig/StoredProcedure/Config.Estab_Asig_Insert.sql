USE [AcontPlus]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Config.Estab_Asig_Insert @userRoleId INT 
    ,@json VARCHAR(MAX)
    ,@fromMobile BIT
    ,@errorCode INT = 0 OUT
	,@errorMessage NVARCHAR(MAX) = '' OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @predeterminado BIT,
        @idUsuario INT,
        @idEstablecimiento INT,
        @codEstab_Asig VARCHAR(150);

    --> Data json
    DECLARE @id INT 
        ,@idUsuarioRol INT 
        ,@codEstab VARCHAR(25)

    DECLARE @code CHAR(1),
		@message VARCHAR(MAX),
		@trancount BIT = 0;

	BEGIN TRY 
		
        SET @codEstab_Asig = (SELECT NEWID())

        SET @idUsuario = (SELECT TOP 1 idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

        SELECT @id = id
            ,@idUsuarioRol = idUsuarioRol
            ,@codEstab = codEstab 
        FROM OPENJSON(@json) WITH (id INT, idUsuarioRol INT, codEstab VARCHAR(50))

        SET @idEstablecimiento = (SELECT TOP 1 idEstablecimiento FROM Sri.Establecimiento WITH(NOLOCK) WHERE codEstab = @codEstab)

		SET @predeterminado = IIF ((SELECT COUNT(*) FROM Config.Estab_Asig WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol ) = 0,1,0)

        IF @id = 0 
            BEGIN 
                IF EXISTS (SELECT 1 FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol AND codEstab = @codEstab)
                    BEGIN
                        SELECT '0' code,'Ya existe este Acceso' as 'message'
                        RETURN 
                    END 
            END 

		IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END
			IF @id = 0 OR @id IS NULL
				BEGIN
					INSERT INTO Config.Estab_Asig(codEstab_Asig,idUsuarioRol,codEstab,predeterminado,usuario,idEstablecimiento,fechaRegistro, idUsuario, fromMobile)
					SELECT @codEstab_Asig,idUsuarioRol,@codEstab,@predeterminado,nombreUsuario,@idEstablecimiento,dbo.ufnGetDateEcuador(), @idUsuario, @fromMobile
                    FROM v_usuario WHERE idUsuarioRol = @idUsuarioRol
                     

					SET @message = 'Registrado Correctamente' 
				END 
			ELSE IF @id > 0
				BEGIN
					DELETE FROM Config.Estab_Asig WHERE idEstab_Asig = @id
					SET @message = 'Eliminado Correctamente' 
				END 
		IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '1'; 
			END
		ELSE
			BEGIN
				SET @code = '0';
                SET @message = 'No se ejecuto ninguna transacción';
			END

	  IF (@trancount = 1)
		BEGIN
			COMMIT;
			SELECT @code as code, @message as 'message';
		 END
	END TRY 

	BEGIN CATCH 
        IF (@trancount = 1)
			BEGIN
				IF (@@TRANCOUNT > 0)
					ROLLBACK TRAN;  

                INSERT INTO ErroresSistema
                      (method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,idUsuario)
		        SELECT '/EstabAsign/Post',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),@idUsuario
		        SELECT '0' code, 'Error en el procedimiento' as 'message'
            END
		ELSE
			SET @errorCode = ERROR_NUMBER()
			SET @errorMessage = ERROR_MESSAGE()
	END CATCH 
END 
GO
