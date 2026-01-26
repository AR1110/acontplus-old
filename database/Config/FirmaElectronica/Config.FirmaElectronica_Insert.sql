USE [AcontPlus]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2021-11-04
-- Description:	sp para guardar firmas electronicas
-- =============================================
CREATE OR ALTER PROCEDURE Config.FirmaElectronica_Insert @userRoleId INT
	,@contrasenia VARCHAR(300)
	,@fileName VARCHAR(300)
	,@firma VARBINARY(MAX)
	,@contentType NVARCHAR(50)
	,@fechaCaducidad DATETIME
    ,@demoStepId INT
    ,@fromMobile BIT
AS
BEGIN 
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

	DECLARE @idUsuario INT,
        @username VARCHAR(100),
	    @idEntidad INT,
        @uuid UNIQUEIDENTIFIER,
        @companyId INT;

	BEGIN TRY
	     
		SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad, @uuid = uuid, @username = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId;
        SET @companyId = (SELECT Id FROM Config.Company WITH(NOLOCK) WHERE Uuid = @uuid);

		IF EXISTS (SELECT 1 FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad)
			BEGIN
				SELECT '0' code,'La empresa ya cuenta con una firma en el sistema' as 'message';
				RETURN 
			END

		BEGIN TRAN
            IF (@demoStepId > 0)
                BEGIN
                    IF NOT EXISTS (SELECT TOP 1 1 FROM Config.CompanyDemoStep WITH (NOLOCK) 
                                                    WHERE Uuid        = @uuid 
                                                    AND DemoStepId    = @demoStepId)
                        BEGIN
                            INSERT INTO Config.CompanyDemoStep(DemoStepId, CompanyId, Uuid, IsMobileRequest, CreatedBy)
                            VALUES(@demoStepId, @companyId, @uuid, @fromMobile, @username);
                        END
                END

			INSERT INTO dbo.FirmaElectronica(idEntidad,contrasenia,nombreArchivo,mimeType,fechaRegistro,idUsuario,firma,fechaCaducidad, fromMobile)
			SELECT @idEntidad,@contrasenia,@fileName,@contentType,dbo.ufnGetDateEcuador(),@idUsuario,@firma,@fechaCaducidad, @fromMobile

			SELECT '1'code,'Exitos al guardar' as 'message'
		COMMIT TRAN	
	END TRY

	BEGIN CATCH	
		 IF (@@TRANCOUNT > 0)
		    ROLLBACK TRAN;  

        INSERT INTO dbo.ErroresSistema
             (method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,idUsuario)
	    SELECT '/FirmaElectronica/Post',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(), @idUsuario
	    SELECT '0' code, 'Error en el procedimiento' as 'message'
	END CATCH

END
