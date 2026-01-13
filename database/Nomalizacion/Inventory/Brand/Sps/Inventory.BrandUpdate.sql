USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Marca_Update]    Script Date: 1/7/2023 9:31:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-21
-- Description:	SP para Actualizar marcas
-- =============================================
CREATE OR ALTER PROCEDURE Inventory.BrandUpdate
     @UserRoleId INT
    ,@Id INT
    ,@Json VARCHAR(MAX)
	
AS
BEGIN
	SET NOCOUNT ON
	SET LANGUAGE SPANISH;

    --> Globales
    DECLARE @UserId INT 

    DECLARE @TbBrand AS TABLE
    (
        Code VARCHAR(20) NOT NULL
       ,[Description] VARCHAR(300) NOT NULL
       ,[CreatedByUserId] INT NOT NULL
    )

    BEGIN TRY
        BEGIN TRAN

        COMMIT TRAN 
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
