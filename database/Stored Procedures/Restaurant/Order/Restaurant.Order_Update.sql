USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2023-08-30
-- Description:	sp for update order restaurant
-- Restaurant.Order_Update 139, 365, '{"orderId":0,"establecimientoId":454,"puntoEmisionId":124,"bodegaId":0,"tableId":3,"customerCompanyId":45408,"subtotalSinImpuestos":14.5,"tax":1.74,"taxPercent":0,"discount":0,"total":16.24,"items":[{"orderItemId":666,"uuid":"039e0e20-39a7-4870-a695-e95cf8151158","itemId":1,"feeId":528,"taxId":1,"taxPercentId":2,"description":"MAITO","productId":77483,"taxValue":0.57,"quantity":2,"cost":22.4,"price":4.75,"discount":0,"total":9.5,"obs":"","itemTypeCode":"ITEM","menuId":null,"bodegaId":128},{"orderItemId":667,"uuid":"e87f08c6-4cfb-476c-95f8-0e981b408b84","itemId":3,"feeId":528,"taxId":1,"taxPercentId":2,"description":"SECO DE POLLO","productId":77476,"taxValue":0.3,"quantity":2,"cost":12.4,"price":2.5,"discount":0,"total":5,"obs":"","itemTypeCode":"ITEM","menuId":null,"bodegaId":128}],"taxes":[],"payments":{},"tip":0,"obs":"","codDoc":"FV","quickSale":true,"fechaEmision":"2023-09-25T16:11:11.059Z","uuid":"338c9734-ebeb-41bf-8573-f7428a2de9ac","updateOrder":false,"saveDoc":true,"itemsToPay":[{"orderItemId":666,"uuid":"039e0e20-39a7-4870-a695-e95cf8151158","itemId":1,"feeId":528,"taxId":1,"taxPercentId":2,"description":"MAITO","productId":77483,"taxValue":0.57,"quantity":2,"cost":22.4,"price":4.75,"discount":0,"total":9.5,"obs":"","itemTypeCode":"ITEM","menuId":null,"bodegaId":128},{"orderItemId":667,"uuid":"e87f08c6-4cfb-476c-95f8-0e981b408b84","itemId":3,"feeId":528,"taxId":1,"taxPercentId":2,"description":"SECO DE POLLO","productId":77476,"taxValue":0.3,"quantity":2,"cost":12.4,"price":2.5,"discount":0,"total":5,"obs":"","itemTypeCode":"ITEM","menuId":null,"bodegaId":128}]}'
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Order_Update 
@userRoleId INT
,@id		INT
,@json		NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @uuid UNIQUEIDENTIFIER
    ,@establecimientoId INT
    ,@puntoEmisionId INT    
    ,@tableId INT
    ,@customerCompanyId INT   
    ,@tax NUMERIC(18,5)    
    ,@discount NUMERIC(18,5)   
    ,@total NUMERIC(18,5)
    ,@obs VARCHAR(500)
    ,@userId INT    
    ,@saveDoc BIT
    ,@updateOrder BIT
    ,@response NVARCHAR(MAX)
    ,@payload NVARCHAR(MAX)
    ,@itemsJson NVARCHAR(MAX)
    ,@taxesJson NVARCHAR(MAX)
    ,@code CHAR(1)

     SELECT @uuid               = uuid
        ,@itemsJson             = items
        ,@taxesJson             = taxes       
        ,@establecimientoId     = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId       
        ,@tableId               = tableId        
        ,@customerCompanyId     = customerCompanyId
        ,@tax                   = tax
        ,@discount              = discount
        ,@total                 = total
        ,@obs                   = obs
        ,@saveDoc               = saveDoc
        ,@updateOrder           = updateOrder
        ,@userId                = userId
    FROM OPENJSON(@json)
    WITH(
        uuid                UNIQUEIDENTIFIER '$.uuid',  
        items               NVARCHAR(MAX) '$.items' AS JSON,
        taxes               NVARCHAR(MAX) '$.taxes' AS JSON,
        establecimientoId   INT '$.establecimientoId',
        puntoEmisionId      INT '$.puntoEmisionId',       
        tableId             INT '$.tableId',        
        customerCompanyId   INT '$.customerCompanyId',       
        tax                 NUMERIC(18,5) '$.tax',        
        discount            NUMERIC(18,5) '$.discount',        
        total               NUMERIC(18,5) '$.total',
        obs                 VARCHAR(500) '$.obs',
        saveDoc             BIT '$.saveDoc',
        updateOrder         BIT '$.updateOrder',
        userId              INT '$.userId'
    )
    
    IF NOT EXISTS (SELECT 1 FROM Config.v_ConfigDocumento cd 
                   INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			       WHERE pa.idUsuarioRol = @userRoleId
			       AND cd.codDoc = 'OR')
        BEGIN
            SELECT Common.ufnSpResponse('0', 'Aun no se ha configurado el secuencial, para ordenes de restaurante',  DEFAULT)
            RETURN
        END

    IF (ISJSON(@itemsJson) = 1)
            BEGIN
                DECLARE @tblItems AS TABLE(
                    orderItemId     INT NOT NULL,
                    uuid            UNIQUEIDENTIFIER NOT NULL,
                    itemId          INT NULL,
                    menuId          INT NULL,
                    taxId           INT NOT NULL,
                    taxPercentId    INT NOT NULL,
                    feeId           INT NOT NULL,
                    taxValue        NUMERIC (18,5) NOT NULL,
                    quantity        NUMERIC (18,5) NOT NULL,
                    cost            NUMERIC(18,5) NOT NULL,
                    price           NUMERIC(18,5) NOT NULL,
                    discount        NUMERIC(18,5),
                    total           NUMERIC(18,5) NOT NULL,
                    obs             VARCHAR(500) NULL,
                    bodegaId        INT NULL,
                    itemTypeCode    VARCHAR(8) NOT NULL
                )

               INSERT INTO @tblItems(orderItemId,uuid, itemId, menuId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price
                                      , discount, total, obs, bodegaId, itemTypeCode)
               
               SELECT orderItemId
                    , uuid
                    , itemId
                    , menuId
                    , taxId
                    , taxPercentId
                    , feeId
                    , taxValue
                    , quantity
                    , cost
                    , price
                    , discount
                    , total
                    , obs
                    , bodegaId
                    , itemTypeCode
                FROM OPENJSON(@itemsJson)
                WITH (  orderItemId     INT '$.orderItemId',
                        uuid            UNIQUEIDENTIFIER '$.uuid',
                        itemId          INT '$.itemId',
                        menuId          INT '$.menuId',
                        taxId           INT '$.taxId',
                        taxPercentId    INT '$.taxPercentId',
                        feeId           INT '$.feeId',
                        taxValue        NUMERIC (18,5)'$.taxValue',
                        quantity        NUMERIC (18,5) '$.quantity',
                        cost            NUMERIC(18,5) '$.cost',
                        price           NUMERIC(18,5) '$.price',
                        discount        NUMERIC(18,5) '$.discount',
                        total           NUMERIC(18,5) '$.total',
                        obs             NVARCHAR(500) '$.obs',
                        bodegaId        INT '$.bodegaId',
                        itemTypeCode    VARCHAR(8) '$.itemTypeCode'
                )
                
                IF (SELECT COUNT(*) FROM @tblItems) = 0
                    BEGIN
                        SELECT Common.ufnSpResponse('0', 'No se pudo recuperar el detalle', NULL)
                        RETURN
                    END
            END
    ELSE
        BEGIN
            SELECT Common.ufnSpResponse('0', 'El detalle no es valido', NULL)
            RETURN
        END

    IF @saveDoc IS NULL OR @saveDoc = ''
        BEGIN
            SET @saveDoc = 0
        END

    IF (@userId = 0)
        BEGIN
            SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        END

    BEGIN TRY
        BEGIN TRAN
            IF @updateOrder = 1
                BEGIN 
                    UPDATE Restaurant.[Order]
                    SET TableId             = @tableId
                        ,CustomerCompanyId  = @customerCompanyId
                        ,Tax                = @Tax
                        ,Discount           = @Discount
                        ,Total              = @Total
                        ,Obs                = @obs                        
                    WHERE Id = @id
                    
                           -- ========= SELECT EXISTS ========= --
                    SELECT ro.OrderId, ro.ItemId, ro.MenuId, it.Code
                    INTO #selectExist
                    FROM Restaurant.OrderItem ro
                    INNER JOIN Restaurant.ItemType it ON it.Id = ro.ItemTypeId
                    INNER JOIN @tblItems t1 ON t1.itemTypeCode = it.Code  AND ro.Id = t1.orderItemId          
                    WHERE ro.OrderId = @id 
                    --GROUP BY ro.OrderId, ro.ItemId, ro.MenuId, it.Code
                    IF EXISTS(SELECT TOP 1 1 FROM #selectExist)
                        BEGIN                           
                            UPDATE u
                            SET u.FeeId         = t1.feeId
                                ,u.TaxId        = t1.taxId
                                ,u.TaxPercentId = t1.taxPercentId
                                ,u.TaxValue     = t1.taxValue
                                ,u.Quantity     = t1.quantity
                                ,u.RemainingQuantity = t1.quantity
                                ,u.Cost         = t1.cost
                                ,u.Price        = t1.price
                                ,u.Discount     = t1.discount
                                ,u.Total        = t1.total
                                ,u.Obs          = t1.obs
                                ,u.UpdatedAt    = dbo.ufnGetDateEcuador()
                                ,u.BodegaId     = t1.bodegaId
                            FROM Restaurant.OrderItem u
                            INNER JOIN #selectExist si ON si.OrderId = u.OrderId
                            INNER JOIN @tblItems t1 ON t1.itemTypeCode = si.Code AND u.Id = t1.orderItemId
                        END
                    
                    --=========== INSERT IF NOT EXISTS =============--
                    INSERT INTO Restaurant.OrderItem(OrderId, Uuid, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost
                                                    , Price, Discount, Total, [Enabled], UserId, FeeId, Obs, BodegaId, ItemTypeId, RemainingQuantity)
                    SELECT @id
                        ,ti.uuid
                        ,ti.itemId
                        ,ti.taxId
                        ,ti.taxPercentId
                        ,ti.taxValue
                        ,ti.quantity
                        ,ti.cost
                        ,ti.price
                        ,ti.discount
                        ,ti.total
                        ,1
                        ,@userId
                        ,ti.feeId
                        ,ti.obs
                        ,ti.bodegaId
                        ,it.Id
                        ,ti.quantity
                    FROM @tblItems ti
                    INNER JOIN Restaurant.ItemType it ON it.Code = ti.itemTypeCode
                    WHERE ti.orderItemId = 0
                                            
                    -- ========= SELECT NOT EXITS ========= --
                    SELECT ro.OrderId, ro.Id, ro.ItemId, ro.MenuId, it.Code
                    INTO #selectNotExist
                    FROM Restaurant.OrderItem ro
                    INNER JOIN Restaurant.ItemType it ON it.Id = ro.ItemTypeId
                    WHERE ro.OrderId = @id
                    AND ro.Uuid NOT IN (SELECT ttp.Uuid FROM @tblItems ttp)
                    --GROUP BY ro.OrderId, ro.ItemId, ro.MenuId, it.Code

                    IF EXISTS(SELECT TOP 1 1 FROM #selectNotExist)
                        BEGIN
                             UPDATE u
                             SET u.Deleted    = 1
                                ,u.[Enabled]  = 0
                                ,u.UpdatedAt  = dbo.ufnGetDateEcuador()
                             FROM Restaurant.OrderItem u
                             INNER JOIN #selectNotExist si ON u.Id = si.Id
                        END                       
                   
                    ---- SET DATA -----
                     SET @payload = (SELECT orderId = @id FOR JSON PATH)
                 END

            IF @saveDoc = 1
                BEGIN
                   EXEC Restaurant.Order_Document_Insert @userRoleId, @id, @json, @payload OUTPUT
                END
        COMMIT TRAN
        SELECT Common.ufnSpResponse('1', 'Exitos al actualizar', @payload)
    END TRY
    BEGIN CATCH
        SELECT Common.ufnSpResponse('0', 'Error al guardar el orden', NULL)
        
        IF (@@TRANCOUNT > 0) ROLLBACK TRAN

        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Order/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
    END CATCH
END