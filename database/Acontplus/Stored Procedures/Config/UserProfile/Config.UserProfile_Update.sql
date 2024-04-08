USE AcontPlus
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2027-04-03
-- Description:	GET DATA FOR USER PROFILE
-- =============================================
-- Config.UserProfile_Get  264, '', '' 35

-- Config.UserProfile_Update 35, '{"perfil": {"contrasenia": "sheyla1234"}}'
CREATE OR ALTER PROC Config.UserProfile_Update
@id	INT
, @json VARCHAR(500)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    DECLARE @contrasenia NVARCHAR(50)
    DECLARE @contraseniaHash BINARY(64)
    DECLARE @data VARCHAR(500)
    
    SELECT @data    =  perfil
    FROM OPENJSON(@json) WITH (
        perfil NVARCHAR(MAX) AS JSON
    )

    SELECT @contrasenia = contrasenia 
    FROM OPENJSON(@data) 
    WITH(
        contrasenia NVARCHAR(50) '$.contrasenia'
    )

    IF (@id = 0 OR @data IS NULL)
        BEGIN
            SELECT '0' code, 'Ups, error inesperado' as 'message'
		    RETURN
        END

    SET @contraseniaHash = HASHBYTES('SHA2_512',@contrasenia)

    BEGIN TRY
        BEGIN TRAN
            UPDATE dbo.Usuario SET contrasenia = @contraseniaHash WHERE idUsuario = @id
        COMMIT TRAN
        SELECT '1' code, 'Actualizado exitosamente' as 'message'
		RETURN
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
        SELECT '0' code, 'Error en actualizar datos de perfil' + ERROR_MESSAGE() as 'message'
		RETURN
    END CATCH   
END
GO