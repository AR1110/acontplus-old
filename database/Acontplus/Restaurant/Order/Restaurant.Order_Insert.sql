USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz - Ignacio Manchu
-- Create date: 2023-08-14
-- Description:	sp for insert order restaurant
-- =============================================
-- Restaurant.Order_Insert 139, '{"orderId":0,"establecimientoId":454,"puntoEmisionId":124,"bodegaId":128,"tableId":3,"customerCompanyId":11752,"subtotalSinImpuestos":8.7,"tax":1.04,"taxPercent":0,"discount":0,"total":9.74,"items":[{"orderItemId":0,"uuid":"92423d48-93a3-4a98-84f9-4131a65b156c","itemId":29,"feeId":528,"taxId":1,"taxPercentId":2,"productId":77508,"taxValue":0.6,"quantity":1,"cost":1.5,"price":5,"discount":0,"total":5,"obs":"","itemTypeCode":"ITEM","menuId":0,"bodegaId":128,"envioSri":false},{"orderItemId":0,"uuid":"0f3755df-249f-46fa-b48a-adf08bcd773c","itemId":28,"feeId":528,"taxId":1,"taxPercentId":2,"productId":77507,"taxValue":0.44400000000000006,"quantity":1,"cost":3,"price":3.7,"discount":0,"total":3.7,"obs":"","itemTypeCode":"ITEM","menuId":0,"bodegaId":128,"envioSri":false}],"taxes":[{"uuid":"92423d48-93a3-4a98-84f9-4131a65b156c","taxId":1,"taxPercentId":2,"taxBase":5,"taxValue":0.6},{"uuid":"0f3755df-249f-46fa-b48a-adf08bcd773c","taxId":1,"taxPercentId":2,"taxBase":3.7,"taxValue":0.44400000000000006}],"payments":{},"tip":0,"obs":"","codDoc":"OR","quickSale":false,"fechaEmision":"2023-09-24T18:02:22.152Z","uuid":"799ec59e-03b3-4c26-9cd9-07191e91df44","updateOrder":false,"saveDoc":false}'
CREATE OR ALTER PROCEDURE Restaurant.Order_Insert @userRoleId INT ,@json NVARCHAR(MAX)
AS
BEGIN 
    SET NOCOUNT ON;
	SET LANGUAGE SPANISH

    --> GLOBAL
	DECLARE @UserId INT,@CompanyId INT ,@orderId INT ,@payload NVARCHAR(MAX) ,@idTipoDocumento INT

    --> DataJson
    DECLARE @orderDocument VARCHAR(MAX) ,@items VARCHAR(MAX)

    --> Order 
    DECLARE @uuid UNIQUEIDENTIFIER
           ,@puntoEmisionId INT  
           ,@sequence INT
           ,@serie VARCHAR(18) 
           ,@estab VARCHAR(10)
           ,@ptoEmi VARCHAR(10)

    DECLARE @tbOrder AS TABLE(
        Uuid UNIQUEIDENTIFIER NOT NULL 
       ,PuntoEmisionId INT NOT NULL 
       ,TableId INT NULL
       ,CustomerCompanyId INT NOT NULL  
       ,Discount NUMERIC(18,5) NOT NULL
       ,Tip NUMERIC(18,5) NULL
       ,Total NUMERIC(18,5) NOT NULL
       ,Obs VARCHAR(500) NULL
       ,QuickSale BIT
       ,UserId INT
       ,BodegaId INT
       ,TaxPercentId INT
    )

    DECLARE @tblItems AS TABLE(
        Uuid UNIQUEIDENTIFIER NOT NULL
       ,ItemTypeId INT NOT NULL
       ,MenuId INT NULL
       ,ItemId INT NULL
       ,TaxId INT NOT NULL
       ,TaxPercentId INT NOT NULL
       ,FeeId INT NOT NULL
       ,TaxValue NUMERIC(18,5) NOT NULL
       ,Quantity NUMERIC(18,5) NOT NULL
       ,Cost NUMERIC(18,5) NOT NULL
       ,Price NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5)
       ,Total NUMERIC(18,5) NOT NULL
       ,RemainingQuantity NUMERIC(18,5) NOT NULL
       ,Obs VARCHAR(500) NULL
       ,BodegaId INT NOT NULL
       ,MedidaId INT NOT NULL
       ,Cooking BIT NOT NULL
    )

    
	BEGIN TRY
        
        --> DataJson
        SELECT @orderDocument = orderDocument
              ,@items         = items
        FROM OPENJSON(@json) WITH 
        (
             orderDocument NVARCHAR(MAX) as json
            ,items         NVARCHAR(MAX) as json 
        )
        
        --> OrderDocument
        INSERT INTO @tbOrder 
              (uuid,PuntoEmisionId,TableId,CustomerCompanyId,Discount,Tip,Total,Obs,QuickSale,UserId)
        SELECT uuid,PuntoEmisionId,TableId,CustomerCompanyId,Discount,Tip,Total,Obs,QuickSale,UserId
        FROM OPENJSON(@json)WITH
        (
             uuid              UNIQUEIDENTIFIER 
            ,puntoEmisionId    INT 
            ,tableId           INT 
            ,customerCompanyId INT 
            ,tax               NUMERIC(18,5) 
            ,discount          NUMERIC(18,5) 
            ,tip               NUMERIC(18,5) 
            ,total             NUMERIC(18,5) 
            ,obs               VARCHAR(500) 
            ,quickSale         BIT 
            ,userId            INT
        )

        --> Item Detailt
        INSERT INTO @tblItems
              (uuid,ItemTypeId,menuId,itemId,taxId,taxPercentId,feeId,taxValue,quantity,cost,price,discount,total,obs,bodegaId,medidaId)
        SELECT uuid,ItemTypeId,menuId,itemId,taxId,taxPercentId,feeId,taxValue,quantity,cost,price,discount,total,obs,bodegaId,medidaId
        FROM OPENJSON(@items) WITH 
        (
             uuid         UNIQUEIDENTIFIER
            ,ItemTypeId   INT
            ,menuId       INT
            ,itemId       INT
            ,taxId        INT
            ,taxPercentId INT
            ,feeId        INT
            ,taxValue     NUMERIC(18,5)
            ,quantity     NUMERIC(18,5)
            ,cost         NUMERIC(18,5)
            ,price        NUMERIC(18,5)
            ,discount     NUMERIC(18,5)
            ,total        NUMERIC(18,5)
            ,obs          NVARCHAR(500)
            ,bodegaId     INT
            ,medidaId     INT
        )

        --> Capturando Variables
        SELECT TOP 1 @puntoEmisionId = PuntoEmisionId 
                    ,@uuid           = Uuid 
                    ,@estab          = es.estab
                    ,@ptoEmi         = pe.ptoEmi
        FROM @tbOrder ot
        INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = ot.PuntoEmisionId
        INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
        
        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM TipoDocumento WITH (NOLOCK) WHERE codigo = 'OR'

        SELECT TOP 1 @sequence = ultimaSecuencia FROM dbo.ConfiguracionDocumento WITH (NOLOCK) WHERE idPuntoEmision = @puntoEmisionId AND idTipoDocumento = @idTipoDocumento

        SELECT @serie = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@sequence)

        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbOrder)
            BEGIN
                SELECT '0' code,'Error en la info del pedido' AS 'message'
				RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblItems)
            BEGIN
                SELECT '0' code,'Error en la info del detalle' AS 'message'
				RETURN
            END 

        IF @sequence IS NULL
            BEGIN
                SELECT '0' code, 'Aun no se ha configurado el secuencial, para ordenes de restaurante'  as 'message'
                RETURN
            END 

        IF EXISTS (SELECT 1 FROM Restaurant.[Order] WITH (NOLOCK) WHERE PuntoEmisionId = @puntoEmisionId AND [Sequence] = @sequence )
            BEGIN
                SELECT '0' code,'Este número de orden ya se encuentra registrado' as 'message'
				RETURN
            END 

		BEGIN TRAN
            ----------------ORDER------------------
            IF NOT EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE Uuid = @uuid)
                BEGIN
                    INSERT INTO Restaurant.[Order] 
                          (puntoEmisionId,TableId,CustomerCompanyId,Discount,Total,UserId,obs,Uuid,[Sequence],Serie)
                    SELECT puntoEmisionId,TableId,CustomerCompanyId,Discount,Total,UserId,obs,Uuid,@sequence,@Serie
                    FROM @tbOrder

	                SET @orderId = (SELECT SCOPE_IDENTITY())
                    
                    INSERT INTO Restaurant.OrderItem
                           (OrderId,Uuid,ItemId,TaxId,TaxPercentId,TaxValue,Quantity,Cost,Price,Discount,Total,FeeId,Obs,BodegaId,ItemTypeId,MenuId,RemainingQuantity,medidaId)
                    SELECT @orderId,Uuid,ItemId,TaxId,TaxPercentId,TaxValue,Quantity,Cost,Price,Discount,Total,FeeId,Obs,BodegaId,ItemTypeId,MenuId,RemainingQuantity,medidaId
                    FROM @tblItems 

                    IF EXISTS(SELECT 1 FROM @tblItems WHERE Cooking = 1)
                        BEGIN
                            INSERT INTO Restaurant.[OrderKitchen] (OrderId, [Enabled], Completed)
                            VALUES(@orderId, 1, 0)
                        END 
                           
                    --> Mesa Asignada
                    IF EXISTS (SELECT 1 FROM @tbOrder WHERE TableId > 0)
                        BEGIN
                            DECLARE @tableId INT

                            SELECT TOP 1 @tableId = TableId FROM @tbOrder

                            UPDATE Restaurant.[Table] SET Assigned = 1 WHERE Id = @tableId
                        END

                    --> Actualizacion Secuencial
			        UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @puntoEmisionId AND idTipoDocumento = @idTipoDocumento 

                    SET @payload = (SELECT orderId = @orderId)
                END
            -----------------END ORDER -----------------
            
            ----------------VENTA RAPIDA------------
            IF EXISTS (SELECT 1 FROM @tbOrder WHERE QuickSale = 1)
                BEGIN
                    EXEC Restaurant.Order_Document_Insert @userRoleId, @orderId, @json, @payload OUTPUT
                END
            ----------------END VENTA RAPIDA--------
		COMMIT TRAN
        SELECT '1' code, 'Exitos al guardar'  as 'message', @payload payload
    END TRY
	BEGIN CATCH
        IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Order/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@userId

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH
END
GO
