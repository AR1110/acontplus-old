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
-- Restaurant.Order_Update 139, 365, '{"orderId":365,"establecimientoId":454,"puntoEmisionId":124,"bodegaId":128,"tableId":3,"customerCompanyId":11752,"subtotalSinImpuestos":32.84,"tax":3.94,"discount":0,"total":36.78,"items":[{"orderItemId":653,"uuid":"c6f033a6-8f5a-4da4-99af-b052035697ad","itemId":27,"feeId":528,"taxId":1,"taxPercentId":2,"description":"INGREDIENTE 02","productId":77506,"taxValue":0.312,"quantity":2,"cost":2,"price":2.6,"discount":0,"total":5.2,"obs":"","itemTypeCode":"ITEM","menuId":null,"bodegaId":128},{"orderItemId":655,"uuid":"e6fa5207-b60c-4059-b2e2-49288331d617","itemId":18,"feeId":528,"taxId":1,"taxPercentId":2,"description":"REPE LOJANO","productId":77497,"taxValue":0.18,"quantity":2,"cost":1.6,"price":1.5,"discount":0,"total":3,"obs":"","itemTypeCode":"ITEM","menuId":null,"bodegaId":128},{"orderItemId":654,"uuid":"02427f7c-2be0-41f2-9c8a-e27549b37d05","itemId":null,"feeId":528,"taxId":1,"taxPercentId":2,"description":"TEST COMBO","productId":77512,"taxValue":1.4784,"quantity":2, "cost":4,"price":12.32,"discount":0,"total":24.64,"obs":"","itemTypeCode":"MENU","menuId":5,"bodegaId":128}],"taxes":[],"payments":{},"tip":0,"obs":"","codDoc":"OR","quickSale":false,"fechaEmision":"2023-09-25T15:01:06.143Z","updateOrder":true,"saveDoc":false}'
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
        updateOrder         BIT '$.updateOrder'        
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
                    
                    --=========== INSERT IF NOT EXISTS =============--
                    INSERT INTO Restaurant.OrderItem(OrderId, Uuid, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost
                                                    , Price, Discount, Total, [Enabled], UserId, FeeId, Obs, BodegaId)
                    
                    SELECT @id
                        , ti.uuid
                        , ti.itemId
                        , ti.taxId
                        , ti.taxPercentId
                        , ti.taxValue
                        , ti.quantity
                        , ti.cost
                        , ti.price
                        , ti.discount
                        , ti.total
                        , 1
                        , @userId
                        , ti.feeId
                        , ti.obs
                        , ti.bodegaId
                    FROM @tblItems ti
                    WHERE ti.itemTypeCode                     
                    NOT IN(SELECT it.Code 
                           FROM Restaurant.OrderItem rr
                           INNER JOIN Restaurant.ItemType it ON it.Id = rr.ItemTypeId 
                           WHERE rr.OrderId = @id
                    )
                           
                     -- ========= SELECT EXISTS ========= --
                    SELECT ro.OrderId, ro.ItemId, ro.MenuId, it.Code
                    INTO #selectExist
                    FROM Restaurant.OrderItem ro
                    INNER JOIN Restaurant.ItemType it ON it.Id = ro.ItemTypeId
                    INNER JOIN @tblItems t1 ON t1.itemTypeCode = it.Code                    
                    WHERE ro.OrderId = @id
                    AND it.Code = t1.itemTypeCode
                    GROUP BY ro.OrderId, ro.ItemId, ro.MenuId, it.Code
                      
                    IF EXISTS(SELECT TOP 1 1 FROM #selectExist)
                        BEGIN                           
                            UPDATE u
                            SET u.FeeId         = t1.feeId
                                ,u.TaxId        = t1.taxId
                                ,u.TaxPercentId = t1.taxPercentId
                                ,u.TaxValue     = t1.taxValue
                                ,u.Quantity     = t1.quantity
                                ,u.Cost         = t1.cost
                                ,u.Price        = t1.price
                                ,u.Discount     = t1.discount
                                ,u.Total        = t1.total
                                ,u.Obs          = t1.obs
                                ,u.UpdatedAt    = dbo.ufnGetDateEcuador()
                                ,u.BodegaId     = t1.bodegaId
                            FROM Restaurant.OrderItem u
                            INNER JOIN #selectExist si ON si.OrderId = u.OrderId
                            INNER JOIN @tblItems t1 ON t1.itemTypeCode = si.Code
                            WHERE u.Id      = t1.orderItemId
                        END
                                            
                    -- ========= SELECT NOT EXITS ========= --
                    SELECT ro.OrderId, ro.ItemId, ro.MenuId, it.Code
                    INTO #selectNotExist
                    FROM Restaurant.OrderItem ro
                    INNER JOIN Restaurant.ItemType it ON it.Id = ro.ItemTypeId
                    WHERE ro.OrderId = @id
                    AND it.Code NOT IN(SELECT itemTypeCode FROM @tblItems)
                    GROUP BY ro.OrderId, ro.ItemId, ro.MenuId, it.Code

                    IF EXISTS(SELECT TOP 1 1 FROM #selectNotExist)
                        BEGIN
                             UPDATE u
                             SET u.Deleted    = 1
                                 ,u.UpdatedAt  = dbo.ufnGetDateEcuador()
                             FROM Restaurant.OrderItem u
                             INNER JOIN #selectNotExist si ON si.OrderId = u.OrderId 
                             INNER JOIN @tblItems t1 ON t1.itemTypeCode = si.Code
                             WHERE u.Id      = t1.orderItemId
                             AND u.Uuid      = t1.uuid
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