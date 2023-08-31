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
    ,@paymentsJson NVARCHAR(MAX)
    ,@establecimientoId INT
    ,@puntoEmisionId INT
    ,@bodegaId INT
    ,@tableId INT
    ,@sequence INT    
    ,@fechaEmision DATETIME2
    ,@customerCompanyId INT
    ,@subtotalSinImpuestos NUMERIC(18,5)
    ,@tax NUMERIC(18,5)
    ,@taxPercent NUMERIC(4,2)
    ,@discount NUMERIC(18,5)
    ,@tip NUMERIC(18,5)
    ,@total NUMERIC(18,5)
    ,@obs VARCHAR(500)
    ,@codDoc VARCHAR(2)
    ,@quickSale BIT
    ,@userId INT
    ,@estadoPagoId INT
    ,@ambiente INT
    ,@autoSriAuth BIT
    ,@saveDoc BIT
    ,@updateOrder BIT
    ,@response NVARCHAR(MAX)
    ,@payload NVARCHAR(MAX)
    ,@itemsJson NVARCHAR(MAX)
    ,@taxesJson NVARCHAR(MAX)

     SELECT @uuid               = uuid
        ,@itemsJson             = items
        ,@taxesJson             = taxes
        ,@paymentsJson          = payments
        ,@establecimientoId     = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId
        ,@bodegaId              = bodegaId
        ,@tableId               = tableId
        ,@fechaEmision          = fechaEmision
        ,@customerCompanyId     = customerCompanyId
        ,@subtotalSinImpuestos  = subtotalSinImpuestos
        ,@taxPercent            = taxPercent
        ,@tax                   = tax
        ,@discount              = discount
        ,@tip                   = tip
        ,@total                 = total
        ,@obs                   = obs
        ,@codDoc                = codDoc
        ,@quickSale             = quickSale
        ,@saveDoc               = saveDoc
        ,@updateOrder           = updateOrder
    FROM OPENJSON(@json)
    WITH(
        uuid UNIQUEIDENTIFIER '$.uuid',  
        items NVARCHAR(MAX) '$.items' AS JSON,
        taxes NVARCHAR(MAX) '$.taxes' AS JSON,
        payments NVARCHAR(MAX) '$.payments' AS JSON,
        establecimientoId INT '$.establecimientoId',
        puntoEmisionId INT '$.puntoEmisionId',
        bodegaId INT '$.bodegaId',
        tableId INT '$.tableId',
        fechaEmision DATETIME2 '$.fechaEmision',
        customerCompanyId INT '$.customerCompanyId',
        subtotalSinImpuestos NUMERIC(18,5) '$.subtotalSinImpuestos',
        tax NUMERIC(18,5) '$.tax',
        taxPercent NUMERIC(4,2) '$.taxPercent',
        discount NUMERIC(18,5) '$.discount',
        tip NUMERIC(18,5) '$.tip',
        total NUMERIC(18,5) '$.total',
        obs VARCHAR(500) '$.obs',
        codDoc VARCHAR(2) '$.codDoc',
        quickSale BIT '$.quickSale',
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

            INSERT INTO @tblItems(orderItemId,uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total)
            SELECT orderItemId,uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total 
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
                        total NUMERIC(18,5) '$.total'
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
                        ,[Enabled]          = 1
                    WHERE Id = @id
                                        ------ INSERT -----
                    INSERT INTO Restaurant.OrderItem(OrderId, Uuid, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost, Price, Discount, Total, [Enabled], UserId, FeeId)
                    SELECT @id, uuid, itemId, taxId, taxPercentId, taxValue, quantity, cost, price, discount, total, 1, @userId, feeId
                    FROM @tblItems ti
                    WHERE ti.itemId NOT IN(SELECT rr.ItemId FROM Restaurant.OrderItem rr WHERE rr.OrderId = @id)
                    
                    ---- UPDATE ----
                    SELECT *
                    INTO #SelectNotExist
                    FROM Restaurant.OrderItem ro 
                    WHERE ro.OrderId = @id AND ro.ItemId NOT IN(SELECT itemId FROM @tblItems)

                    UPDATE u
                    SET u.Enabled = 0
                        ,u.Deleted = 1
                    FROM Restaurant.OrderItem u
                    INNER JOIN #SelectNotExist t1 ON t1.OrderId = u.OrderId 
                    WHERE u.ItemId = t1.ItemId
                    
                    DECLARE @totalCook INT = 0
                    SET @totalCook = (SELECT COUNT(*) FROM Restaurant.Item i INNER JOIN @tblItems ii ON i.Id = ii.ItemId WHERE i.Cooking = 1)

                    IF (@totalCook > 0)
                        INSERT INTO Restaurant.[OrderKitchen] (OrderId, [Enabled], Completed, UserId)
                        VALUES(@id, 1, 0, @userId)
                        
                    UPDATE cf SET cf.ultimaSecuencia = vcf.secuencial + 1 
                    FROM ConfiguracionDocumento cf WITH (ROWLOCK)
                        JOIN (
                                SELECT cd.idConfiguracionDocumento, cd.secuencial
			                        FROM Config.v_ConfigDocumento cd
				                        INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab 
                                                                    AND cd.idPuntoEmision = @puntoEmisionId
			                        WHERE pa.idUsuarioRol = @userRoleId
			                        AND cd.codDoc = 'OR'
                        ) AS vcf ON cf.idConfiguracionDocumento = vcf.idConfiguracionDocumento
                                               
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