USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz - Ignacio Manchu
-- Create date: 2024-02-07
-- Description:	SP for get orders
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Insert @userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

     --> Global
    DECLARE @secuencia          VARCHAR(30)
           ,@orderId            INT
           ,@sequence           INT
           ,@enabled            BIT
           ,@estab              VARCHAR(3)
           ,@ptoEmi             VARCHAR(3)
           ,@idTipoDocumento    INT
           ,@serie              VARCHAR(18)
           ,@userId             INT
           ,@datetime           DATETIME

    --> Data Json
    DECLARE @order VARCHAR(MAX), @details VARCHAR(MAX)

    --> Set values
	SET @userId     = (SELECT idUsuario FROM v_Usuario WHERE idUsuarioRol = @userRoleId)
    SET @enabled    = 1
    SET @datetime   = (SELECT dbo.ufnGetdateEcuador())
    
    
    DECLARE @tbOrder AS TABLE (
        uuid VARCHAR(100) NOT NULL
       ,establecimientoId INT NOT NULL
       ,puntoEmisionId INT NOT NULL
       ,customerCompanyId INT NOT NULL
       ,orderStatusId INT NULL
       ,obs VARCHAR(500) NULL
       ,userId INT NOT NULL
    )

    DECLARE @tbDetails AS TABLE(
        uuid VARCHAR(100) NOT NULL
       ,deviceId INT NOT NULL
       ,obs VARCHAR(500) NULL
       ,userId INT NOT NULL
    )
        
    --> Data Json 
    SELECT @order       = [order]
          ,@details     = details
    FROM OPENJSON(@json) WITH 
    (
         [order]        NVARCHAR(MAX) AS JSON
        ,details        NVARCHAR(MAX) AS JSON
    )

    --> Insert to temp Table
    INSERT INTO @tbOrder
          (uuid, establecimientoId, puntoEmisionId, customerCompanyId, orderStatusId, obs, userId)
    SELECT uuid, establecimientoId, puntoEmisionId, customerCompanyId, orderStatusId, obs, userId
    FROM OPENJSON(@order) WITH
    (
        uuid                 VARCHAR(100)    '$.uuid'
        ,establecimientoId   INT             '$.idEstablecimiento'
        ,puntoEmisionId      INT             '$.idPuntoEmision'
        ,customerCompanyId   INT             '$.idCliente'
        ,orderStatusId       INT             '$.idOrderStatus'
        ,obs                 VARCHAR(100)    '$.obs'
        ,userId              INT             '$.userId'
    )

    ---> Validations order.
    IF NOT EXISTS(SELECT 1 FROM @tbOrder)
        BEGIN
            SELECT Common.ufnSpResponse('0', 'No se pudo recuperar el orden', NULL)
            RETURN
        END

    --> Insert to temp Table
    INSERT INTO @tbDetails
            (uuid, deviceId, obs, userId)
    SELECT uuid, deviceId, obs, userId
    FROM OPENJSON(@details) WITH
    (
        uuid         VARCHAR(100)    '$.uuid'
        ,deviceId    INT             '$.idDevice'
        ,obs         VARCHAR(100)    '$.obs'
        ,userId      INT             '$.userId'
    )

    ---> Validation details
    IF NOT EXISTS(SELECT 1 FROM @tbDetails)
        BEGIN
            SELECT Common.ufnSpResponse('0', 'No se pudo recuperar el detalle', NULL)
            RETURN
        END

    SELECT @sequence        = cd.secuencial
        , @estab            = pa.estab
        , @ptoEmi           = pa.ptoEmi
        , @idTipoDocumento  = cd.idTipoDocumento
	FROM Config.v_ConfigDocumento cd
    INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab 
    AND cd.idPuntoEmision = (SELECT puntoEmisionId FROM @tbOrder)
    WHERE pa.idUsuarioRol = @userRoleId
    AND cd.codDoc = 'OTS'

    ---> Serie
    SET @serie = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @sequence, DEFAULT)) 
    
    ---> Validations if exist doc.
    IF NOT EXISTS (SELECT TOP 1 1 FROM Config.v_ConfigDocumento cd
				                  INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab 
                                  AND cd.idPuntoEmision = (SELECT puntoEmisionId FROM @tbOrder)
			                      WHERE pa.idUsuarioRol = @userRoleId
			                      AND cd.codDoc = 'OTS')
    BEGIN       
        SELECT Common.ufnSpResponse('0', 'Aun no se ha configurado el secuencial, para Soporte Técnico',  DEFAULT)
        RETURN
    END

	BEGIN TRY
		BEGIN TRAN
            ---> Inser data - Order.
            INSERT INTO TechnicalSupport.[Order]
                  (Uuid,EstablecimientoId,PuntoEmisionId,[Sequence],Serie,CustomerCompanyId,Obs,OrderStatusId ,CreatedAt,Enabled, UserId)
            SELECT uuid,establecimientoId,puntoEmisionId,@sequence ,@serie,customerCompanyId,obs,orderStatusId,@datetime,@enabled,@userId
            FROM @tbOrder

            SET @orderId = @@IDENTITY

            ---> Inser data - Details
            INSERT INTO TechnicalSupport.OrderDetail
                   (Uuid, OrderId, Deviceid, Obs, CreatedAt, [Enabled], UserId)
            SELECT uuid, @orderId, deviceId, obs, @datetime, @enabled, @userId
            FROM @tbDetails

			SELECT Common.ufnSpResponse('1', 'Grave registrado', NULL)
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		 SELECT Common.ufnSpResponse('0', 'Error al guardar la orden', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'TechSupport/Order/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END
GO


