USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-01-07
-- Description:	sp for copy customers and suppliers to anothers company
-- =============================================
CREATE OR ALTER PROCEDURE Config.Inventory_Copy
    @rucOrigen VARCHAR(25),
    @rucDestino VARCHAR(25)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @companyOrigenId INT,
        @companyDestinoId INT,
        @productsCopied INT = 0

    BEGIN TRY
        -- Retrieve company IDs based on provided RUCs
        SET @companyOrigenId = (SELECT idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE ruc = @rucOrigen);
        SET @companyDestinoId = (SELECT idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE ruc = @rucDestino);

        -- Validate company IDs
        IF @companyOrigenId IS NULL OR @companyDestinoId IS NULL
        BEGIN
            THROW 50001, 'Invalid company RUC provided. Please check the input values.', 1;
        END

        BEGIN TRANSACTION;

        

        SET @productsCopied = @@ROWCOUNT;
		 
        END

        COMMIT TRANSACTION;

        -- Return success message
        SELECT 
            'Successful' AS Status,
            @productsCopied AS ProductsCopied,
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of error
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRANSACTION;

        -- Log error details
        INSERT INTO dbo.ErroresSistema(
            [method], [errorNumber], [errorSeverity], [errorState], 
            [errorProcedure], [errorLine], [errorMessage]
        )
        VALUES (
            'Copy customers and suppliers', 
            ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), 
            ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE()
        );

        -- Re-throw the error for external handling
        THROW;
    END CATCH
END
GO

