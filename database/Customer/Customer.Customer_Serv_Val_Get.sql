USE [Acontplus]
GO
/****** Object:  StoredProcedure [Customer].[Customer_Serv_Val_Get]    Script Date: 10/2/2026 10:12:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-07-0
-- Description:	sp for get clients to validate in SRI
-- =============================================
CREATE OR ALTER   PROCEDURE [Customer].[Customer_Serv_Val_Get] @top INT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY

	    SELECT 
		TOP (@top)
	    id, IdCard numeroIdentificacion, ti.codigoSri, C.SriValidation, C.BusinessName
	    FROM Customer.Customer c WITH (NOLOCK)
            INNER JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON c.IdTypeId = ti.idTipoIdentificacion
	    WHERE (c.SriValidation IS NULL OR c.SriValidation=0) AND
		ti.codigoSri IN ('04', '05')
	    AND c.IsDeleted = CAST(0 AS BIT)
	    ORDER BY c.Id DESC
--	 	UPDATE Customer.Customer SET IsDeleted=1 WHERE id=142416

    END TRY
    BEGIN CATCH
        INSERT INTO ErroresSistema(method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage)
		VALUES('WS_Customer_Validation/Get',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),'Customer.Customer_Serv_Val_Get',ERROR_LINE(),ERROR_MESSAGE());
        THROW;
    END CATCH
END
