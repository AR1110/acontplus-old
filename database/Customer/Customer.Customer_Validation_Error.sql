USE [Acontplus]
GO
/****** Object:  StoredProcedure [Customer].[Customer_Validation_Error]    Script Date: 10/2/2026 10:08:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-04-30
-- Description:	SP FOR NOT EXISTS CUSTOMERS IN SRI
-- =============================================
CREATE OR ALTER   PROCEDURE [Customer].[Customer_Validation_Error] @id INT
AS
BEGIN
	SET NOCOUNT OFF;
	SET XACT_ABORT ON;

	BEGIN TRY
        BEGIN TRAN
			UPDATE Customer.Customer SET SriValidation = CAST(0 AS BIT),
			Deleted = CAST(1 AS BIT),
			IsDeleted = CAST(1 AS BIT),
			IsActive = CAST(0 AS BIT),
			[Enabled] = CAST(0 AS BIT),
			UpdatedAt = GETDATE()
			WHERE id = @id
	    COMMIT TRAN
	END TRY
	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
		INSERT INTO ErroresSistema(method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage)
		VALUES('/WS_Customer_Validation/Error',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE())
	END CATCH
	END
 