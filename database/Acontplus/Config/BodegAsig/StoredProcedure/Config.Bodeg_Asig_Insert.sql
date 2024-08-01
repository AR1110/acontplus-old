USE AcontPlus
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
 
CREATE OR ALTER PROCEDURE Config.Bodeg_Asig_Insert @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@fromMobile BIT
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @idUsuario INT,
        @usuario VARCHAR(150),
        @predeterminado BIT,
        @idEstab_Asig INT;

    DECLARE @id INT,
        @codEstab_Asig VARCHAR(150),
	    @idBodega INT;

    DECLARE @code CHAR(1),
		@message VARCHAR(MAX),
		@trancount BIT = 0;

	BEGIN TRY
		
         SELECT @id = idBodeg_Asig
             ,@codEstab_Asig = codEstab_Asig
	         ,@idBodega = idBodega
        FROM OPENJSON(@json)
        WITH(
            idBodeg_Asig INT
            ,codEstab_Asig VARCHAR(150)
	        ,idBodega INT
        );

		SELECT @idUsuario = idUsuario, @usuario = nombreUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId;

        SET @idEstab_Asig = (SELECT TOP 1 idEstab_Asig FROM Config.Estab_Asig WITH(NOLOCK) WHERE codEstab_Asig = @codEstab_Asig);

		SET @predeterminado = IIF ((SELECT COUNT(*) FROM Config.Bodeg_Asig WHERE codEstab_Asig = @codEstab_Asig ) = 0,1,0)

	    IF (@@TRANCOUNT = 0)
			BEGIN
				BEGIN TRANSACTION;
				SET @trancount = 1;
			END
			IF @id = 0 OR @id IS NULL
				BEGIN
					INSERT INTO Config.Bodeg_Asig(codEstab_Asig,idBodega,predeterminado,usuario, idEstab_Asig, idUsuario, fechaRegistro, fromMobile)
					SELECT @codEstab_Asig,@idBodega,@predeterminado,@usuario, @idEstab_Asig, @idUsuario, dbo.ufnGetDateEcuador(), @fromMobile
					SET @message = 'Registrado Correctamente'
				END 
			IF @id > 0 
				BEGIN
					DELETE FROM Config.Bodeg_Asig WHERE idBodeg_Asig = @id
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
		        SELECT '/Bodeg_Asig/Post',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),@idUsuario
		        SELECT '0' code, 'Error en el procedimiento' as 'message'
            END
		ELSE
			SET @errorCode = ERROR_NUMBER()
			SET @errorMessage = ERROR_MESSAGE()
	END CATCH 
END
GO
