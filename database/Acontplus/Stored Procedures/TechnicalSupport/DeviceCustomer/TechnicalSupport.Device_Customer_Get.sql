USE Acontplus
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2024-12-02
-- Description:	Sp for get customer by device
-- =============================================
CREATE OR ALTER PROC TechnicalSupport.Device_Customer_Get
@userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @deviceId INT
			,@tipo    INT

	SELECT @tipo = tipo, @deviceId = deviceId FROM OPENJSON(@json) WITH
	(
		tipo		INT '$.tipo'
	   ,deviceId	INT '$.deviceId'
	)

    IF @tipo = 1
        BEGIN
            SELECT td.Id
            ,td.SerialNumber
            ,td.Warranty
            ,td.Enabled
            ,td.CustomerCompanyId
            ,c.BusinessName
            FROM TechnicalSupport.DeviceCustomer td
            INNER JOIN v_Cliente c ON c.idCliente = td.CustomerCompanyId
            WHERE td.DeviceId = @deviceId
        END
END
GO