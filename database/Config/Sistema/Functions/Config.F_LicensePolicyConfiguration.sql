Use Acontplus
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Scalar Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE OR ALTER FUNCTION Config.F_LicensePolicyConfiguration 
(
	-- Add the parameters for the function here
	@idEntidad INT
   ,@codePolice VARCHAR(50)
   ,@codeApp VARCHAR(50)
)
RETURNS NVARCHAR(100)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @LicenseTypeId INT
           ,@message       VARCHAR(500)
           ,@PolicyType    INT
           ,@startDate     DATETIME2
           ,@endDate       DATETIME2
           ,@isActive      BIT

	SELECT @LicenseTypeId = t5.LicenseTypeId
          ,@startDate     = t2.StartDate
          ,@endDate       = t2.EndDate
	FROM Sales.SuscripcionDetalle     t1 WITH (NOLOCK)
	INNER JOIN Sales.Suscripcion      t2 WITH (NOLOCK) ON t2.Id   = t1.SuscripcionId
	INNER JOIN Config.LicenciaDetalle t3 WITH (NOLOCK) ON t3.Id   = t1.LicenciaDetalleId
	INNER JOIN Config.Company	     t4 WITH (NOLOCK) ON t4.Id   = t2.CompanyId
	INNER JOIN Config.Licencia        t5 WITH (NOLOCK) ON t5.Id   = t3.LicenciaId
    INNER JOIN Config.Aplicacion      t6 WITH (NOLOCK) ON t6.Id   = t3.AplicacionId
	INNER JOIN dbo.Entidad                 t7 WITH (NOLOCK) ON t7.Uuid = t4.Uuid
	WHERE t2.IsActive = 1
	  AND(t2.Paid IS NULL OR t2.Paid = 0)
	  AND t2.IsDeleted = CAST(0 AS BIT)
      AND t6.Code      = @codeApp
      AND t7.idEntidad = @idEntidad

	-- Add the T-SQL statements to compute the return value here
    IF @codePolice = 'MAX_DOCUMENTS'
        BEGIN
            DECLARE @countDocuments INT
                   ,@PolicyValue INT

            SELECT @countDocuments = COUNT(*) FROM FactElect.v_DocElectronico WHERE idEntidad = @idEntidad AND fechaRegistro BETWEEN @startDate AND @endDate

            SELECT TOP 1 @message = t2.Description, @PolicyValue = t1.PolicyValue
            FROM Config.LicensePolicyConfiguration t1
            INNER JOIN Config.PolicyType           t2 ON t2.Id = t1.PolicyTypeId          
            WHERE t1.LicenseTypeId = @LicenseTypeId
              AND t2.Code = @codePolice

            IF @PolicyValue <= @countDocuments
                SET @message = NULL

        END
    


	-- Return the result of the function
	RETURN @message

END
GO

