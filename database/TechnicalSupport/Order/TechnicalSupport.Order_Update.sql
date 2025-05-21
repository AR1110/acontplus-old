USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-14
-- Description:	SP for update orders
-- =============================================
-- TechnicalSupport.Order_Update 25, '{"customerCompanyId": 63963,"establecimientoId": 339,"fechaEmision": "2024-02-08","obs": "test","orderDetails": [{"deviceId": 2,"deviceName": "Mac Mini PRO","name": "Mac Mini PRO","obs": "obs","uuid": "14e9c6ee-7694-47b2-a418-9b99a882fc06"}],"orderStatusId": 1,"puntoEmisionId": 2,"userId": 1,"uuid": "f0b789be-fb86-4c5d-8308-75d3e7e85b49"}'
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Update @userRoleId INT
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

     --> Global
    DECLARE @secuencia          VARCHAR(30)
           ,@enabled            BIT 
           ,@idTipoDocumento    INT 
           ,@userId             INT
           ,@datetime           DATETIME
           ,@orderStatusId      INT

    --> Data Json
    DECLARE @details VARCHAR(MAX)

    DECLARE @tbOrder AS TABLE (
        id INT
       ,uuid VARCHAR(100) NOT NULL
       ,establecimientoId INT NOT NULL
       ,puntoEmisionId INT NOT NULL
       ,customerCompanyId INT NOT NULL 
       ,obs VARCHAR(500) NULL
       ,userId INT NOT NULL
       ,fechaEmision DATETIME2 NOT NULL
       ,assignedUserId INT
    )

    DECLARE @tbDetails AS TABLE(
        id INT
       ,uuid VARCHAR(100) NOT NULL
       ,deviceCustomerId INT NOT NULL
       ,deviceId INT NOT NULL
       ,deviceSerie VARCHAR(300)
       ,deviceWarranty DATETIME2
       ,obs VARCHAR(500) NULL
       ,assignedUserId INT
    )
        
   

	BEGIN TRY
                --> Set values
	    SET @userId     = (SELECT idUsuario FROM v_Usuario WHERE idUsuarioRol = @userRoleId)
        SET @enabled    = 1
        SET @datetime   = (SELECT dbo.ufnGetdateEcuador())
        
             --> Data Json 
        SELECT @details = orderDetails FROM OPENJSON(@json) WITH (orderDetails  NVARCHAR(MAX) AS JSON )
        --> Insert to temp Table
        INSERT INTO @tbOrder
              (id, uuid, establecimientoId, puntoEmisionId, customerCompanyId, obs, userId, fechaEmision, assignedUserId)
        SELECT @id, uuid, establecimientoId, puntoEmisionId, customerCompanyId, obs, userId, fechaEmision, assignedUserId
        FROM OPENJSON(@json) WITH
        (
            uuid                 VARCHAR(100)    '$.uuid'
            ,establecimientoId   INT             '$.establecimientoId'
            ,puntoEmisionId      INT             '$.puntoEmisionId'
            ,customerCompanyId   INT             '$.customerCompanyId' 
            ,obs                 VARCHAR(100)    '$.obs'
            ,userId              INT             '$.userId'
            ,fechaEmision        DATETIME2       '$.fechaEmision'
            ,assignedUserId      INT
        )
        
        ---> Validations order.
        IF NOT EXISTS(SELECT 1 FROM @tbOrder)
            BEGIN
                SELECT '0' code, 'No se pudo recuperar el orden'as 'message'
                RETURN
            END

                SET @orderStatusId = (SELECT CASE
                                        WHEN 
                                            (SELECT TOP 1 assignedUserId FROM @tbOrder) = 0 THEN  (SELECT Id FROM TechnicalSupport.OrderStatus WITH (NOLOCK) WHERE code = 'PA')
                                        ELSE 
                                            (SELECT Id FROM TechnicalSupport.OrderStatus WITH (NOLOCK) WHERE code = 'EP')
                                        END )

        --> Insert to temp Table
        INSERT INTO @tbDetails(id, uuid, deviceCustomerId, deviceId, deviceSerie, deviceWarranty, obs, assignedUserId)
        SELECT id, uuid, deviceCustomerId, deviceId, deviceSerie, deviceWarranty, obs, assignedUserId
                        FROM OPENJSON(@details) WITH
                        (
                            id INT
                            ,uuid         VARCHAR(100)    '$.uuid'
                            ,deviceCustomerId INT       '$.deviceCustomerId'
                            ,deviceId    INT             '$.deviceId'
                            ,deviceSerie    VARCHAR(300)             '$.deviceSerie'
                            ,deviceWarranty    DATETIME2             '$.deviceWarranty'
                            ,obs         VARCHAR(100)    '$.obs'
                            ,assignedUserId INT
                        )

        ---> Validation details
        IF NOT EXISTS(SELECT 1 FROM @tbDetails)
            BEGIN
                SELECT '0' code, 'No se pudo recuperar el detalle'as 'message'
                RETURN
            END

		BEGIN TRAN
            ---> Inser data - Order.
            
            UPDATE o SET
                fechaEmision = temp.fechaEmision
                ,customerCompanyId = temp.customerCompanyId
                ,obs = temp.obs
                ,OrderStatusId = @orderStatusId
                ,UpdatedAt = @datetime 
                ,UserId = @userId
                ,AssignedUserId = IIF(temp.assignedUserId = 0, NULL, temp.assignedUserId)
            FROM TechnicalSupport.[Order] o WITH (NOLOCK)
                INNER JOIN @tbOrder temp ON o.Id = temp.id

            ---> Inser data - Details
            INSERT INTO TechnicalSupport.OrderDetail
                   (Uuid, OrderId, Deviceid, Obs, CreatedAt, [Enabled], UserId)
            SELECT uuid, @id, deviceId, obs, @datetime, @enabled, @userId
            FROM @tbDetails
            WHERE id = 0
        
            INSERT INTO TechnicalSupport.DeviceCustomer(CustomerCompanyId, DeviceId, SerialNumber, WarrantyEndDate)
            SELECT (SELECT TOP 1 o.customerCompanyId FROM @tbOrder o), deviceId, deviceSerie, deviceWarranty
            FROM @tbDetails 
            WHERE deviceCustomerId = 0 
		COMMIT TRAN
        SELECT '1' code, 'Actualizada correctamente' as 'message'
	END TRY
	BEGIN CATCH
		 SELECT '0' code, 'Error al guardar la orden' as 'message'
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'TechSupport/Order/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END
GO