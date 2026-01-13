USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPMarcaInsert]    Script Date: 10/11/2022 10:41:30 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2026-01-08
-- Description:	SP pára registrar marcas 
-- =============================================
CREATE OR ALTER PROCEDURE Inventory.BrandInsert
     @UserRoleId INT
    ,@Json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON
	SET LANGUAGE SPANISH;

    --> Globales
    DECLARE @UserId INT ,@CompanyId INT

    DECLARE @TbBrand AS TABLE
    (
        Code VARCHAR(20) NOT NULL
       ,[Description] VARCHAR(300) NOT NULL
       ,[CreatedByUserId] INT NOT NULL
       ,[CompanyId] INT NOT NULL
    )

    BEGIN TRY
         --> Globales
        SELECT TOP 1 @UserId = idUsuario ,@CompanyId = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        INSERT INTO @TbBrand
              (Code,[Description],[CreatedByUserId],CompanyId)
        SELECT Code,[Description],@UserId          ,@CompanyId
        FROM OPENJSON(@Json)
        WITH
        (
            code VARCHAR(20)
           ,[description] VARCHAR(300)
        )

        --> Validate
        IF EXISTS (SELECT 1 FROM @TbBrand)
            BEGIN;
                THROW 50002, 'Error en la información', 1;
            END

        IF EXISTS (SELECT 1 FROM @TbBrand tp INNER JOIN Inventory.Brand br ON br.Code = tp.Code)
            BEGIN;
                THROW 50002, 'Este codigo ya se encuentra registrado', 1;
            END

        IF EXISTS (SELECT 1 FROM @TbBrand tp INNER JOIN Inventory.Brand br ON br.[Description] = tp.[Description] AND br.CompanyId = tp.CompanyId)
            BEGIN;
                THROW 50002, 'Esta marca ya se encuentra registrada', 1;
            END

        BEGIN TRAN
            INSERT INTO Inventory.Brand
                  (Code,[Description],CreatedByUserId,CompanyId)
            SELECT Code,[Description],CreatedByUserId,CompanyId FROM @TbBrand
        COMMIT TRAN
        SELECT '1'code,'Registrado Correctamente'[message]
    END TRY

    BEGIN CATCH
        IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END 

		INSERT INTO dbo.ErroresSistema
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/brand/insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@UserId

        SELECT '0'code,'Error en el procedimiento'[message]
    END CATCH 

END
