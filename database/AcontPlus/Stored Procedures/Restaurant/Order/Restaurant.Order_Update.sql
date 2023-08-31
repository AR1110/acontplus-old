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
        uuid UNIQUEIDENTIFIER '$.uuid',  
        items NVARCHAR(MAX) '$.items' AS JSON,
        taxes NVARCHAR(MAX) '$.taxes' AS JSON,
        establecimientoId INT '$.establecimientoId',
        puntoEmisionId INT '$.puntoEmisionId',       
        tableId INT '$.tableId',        
        customerCompanyId INT '$.customerCompanyId',       
        tax NUMERIC(18,5) '$.tax',        
        discount NUMERIC(18,5) '$.discount',        
        total NUMERIC(18,5) '$.total',
        obs VARCHAR(500) '$.obs',
        saveDoc BIT '$.saveDoc',
        updateOrder BIT '$.updateOrder'
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
                    orderItemId INT NOT NULL,
                    uuid UNIQUEIDENTIFIER NOT NULL,
                    itemId INT NOT NULL,
                    taxId INT NOT NULL,
                    taxPercentId INT NOT NULL,
                    feeId INT NOT NULL,
                    taxValue NUMERIC (18,5) NOT NULL,
                    quantity NUMERIC (18,5) NOT NULL,
                    cost NUMERIC(18,5) NOT NULL,
                    price NUMERIC(18,5) NOT NULL,
                    discount NUMERIC(18,5),
                    total NUMERIC(18,5) NOT NULL,
                    obs VARCHAR(500)
                )

                INSERT INTO @tblItems(orderItemId,uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total, obs)
                SELECT orderItemId,uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total, obs
                FROM OPENJSON(@itemsJson)
                    WITH (
                            orderItemId INT '$.orderItemId',
                            uuid UNIQUEIDENTIFIER '$.uuid',
                            itemId INT '$.itemId',
                            taxId INT '$.taxId',
                            taxPercentId INT '$.taxPercentId',
                            feeId INT '$.feeId',
                            taxValue NUMERIC (18,5)'$.taxValue',
                            quantity NUMERIC (18,5) '$.quantity',
                            cost NUMERIC(18,5) '$.cost',
                            price NUMERIC(18,5) '$.price',
                            discount NUMERIC(18,5) '$.discount',
                            total NUMERIC(18,5) '$.total',
                            obs NVARCHAR(500) '$.obs'
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
                    
                    ------ INSERT IF NOT EXISTS -----
                    INSERT INTO Restaurant.OrderItem(OrderId, Uuid, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost
                                                    , Price, Discount, Total, [Enabled], UserId, FeeId, Obs)
                    
                    SELECT @id
                        , uuid
                        , itemId
                        , taxId
                        , taxPercentId
                        , taxValue
                        , quantity
                        , cost
                        , price
                        , discount
                        , total
                        , 1
                        , @userId
                        , feeId
                        , obs
                    FROM @tblItems ti
                    WHERE ti.itemId NOT IN(SELECT rr.ItemId FROM Restaurant.OrderItem rr WHERE rr.OrderId = @id)
                    
                    ---- SELECT NOT EXITS ----
                    SELECT ro.OrderId, ro.ItemId
                    INTO #selectNotExist
                    FROM Restaurant.OrderItem ro WHERE ro.OrderId = @id  AND ro.ItemId NOT IN(SELECT itemId FROM @tblItems)

                    IF EXISTS(SELECT TOP 1 1 FROM #selectNotExist)
                        BEGIN
                             UPDATE u
                             SET u.[Enabled]   = 0
                                 ,u.Deleted    = 1
                                 ,u.UpdatedAt  = dbo.ufnGetDateEcuador()
                             FROM Restaurant.OrderItem u
                             INNER JOIN #selectNotExist t1 ON t1.OrderId = u.OrderId 
                             WHERE u.ItemId = t1.ItemId
                        END
                        
                    ---- SELECT EXISTS ---
                    SELECT ro.OrderId, ro.ItemId
                    INTO #selectExist
                    FROM Restaurant.OrderItem ro WHERE ro.OrderId = @id AND ro.ItemId IN (SELECT itemId FROM @tblItems)

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
                            FROM Restaurant.OrderItem u
                            INNER JOIN #selectExist si ON si.OrderId = u.OrderId
                            INNER JOIN @tblItems t1 ON t1.itemId = si.ItemId
                            WHERE u.ItemId  = si.ItemId
                            AND u.Id        = t1.orderItemId
                            AND u.Uuid      = t1.uuid
                        END
                    
                    ---- SET DATA -----
                     SET @payload = (SELECT orderId = @id FOR JSON PATH)
                 END

            IF @saveDoc = 1
                BEGIN 
                    EXEC Restaurant.Order_Document_Insert @userRoleId, @id, @json, @response
                    SET @payload = @response 
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