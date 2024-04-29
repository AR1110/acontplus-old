USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-26
-- Description:	SP for update orders details
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.OrderDetail_Update @userRoleId INT
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON; 
    DECLARE @tblDetails AS TABLE (
        id INT NOT NULL,
        obs VARCHAR(300) NOT NULL,
        serie VARCHAR(150),
        warranty NUMERIC(18,5)
    )
    DECLARE @userId INT,
        @deviceId INT,
        @orderId INT,
        @customerCompanyId INT
	BEGIN TRY
        SELECT @orderId = orderId, @deviceId = DeviceId FROM TechnicalSupport.OrderDetail WITH (NOLOCK) WHERE Id = @id
        SET @customerCompanyId = (SELECT CustomerCompanyId FROM TechnicalSupport.[Order] WITH (NOLOCK) WHERE Id = @orderId)

        INSERT INTO @tblDetails(id, obs, serie, warranty)
        SELECT id, obs, deviceSerie, deviceWarranty FROM OPENJSON(@json) WITH (id INT, obs VARCHAR(300), deviceSerie VARCHAR(100), deviceWarranty NUMERIC(18,5))

		SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        BEGIN TRAN
			UPDATE od SET 
                od.Obs = td.obs,
                od.UpdatedAt = dbo.ufnGetDateEcuador(),
                od.UserId = @userId
            FROM TechnicalSupport.OrderDetail od WITH (ROWLOCK) 
                INNER JOIN @tblDetails td ON od.Id = td.id

            UPDATE  TechnicalSupport.DeviceCustomer SET Warranty = (SELECT warranty FROM @tblDetails)
                ,SerialNumber = (SELECT serie FROM @tblDetails)
            WHERE DeviceId = @deviceId 
                AND CustomerCompanyId = @customerCompanyId
		COMMIT TRAN
        SELECT '1' code, 'Actualizado correctamente' as 'message'
	END TRY
	BEGIN CATCH
		 SELECT '0' code, 'Error al guardar la orden' as 'message'
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'TechSupport/OrderDetail/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END
GO