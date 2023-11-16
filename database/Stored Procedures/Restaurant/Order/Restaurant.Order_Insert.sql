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
CREATE OR ALTER PROCEDURE Restaurant.Order_Insert @userRoleId INT
,@json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @uuid UNIQUEIDENTIFIER
    ,@itemsJson NVARCHAR(MAX)
    ,@establecimientoId INT
    ,@puntoEmisionId INT   
    ,@tableId INT
    ,@sequence INT
    ,@serie VARCHAR(18)    
    ,@customerCompanyId INT   
    ,@tax NUMERIC(18,5)   
    ,@discount NUMERIC(18,5)
    ,@tip NUMERIC(18,5)
    ,@total NUMERIC(18,5)
    ,@obs VARCHAR(500)    
    ,@quickSale BIT
    ,@userId INT
    ,@bodegaId INT
    ,@payload NVARCHAR(MAX)
       
    SELECT @uuid                = uuid
        ,@itemsJson             = items
        ,@establecimientoId     = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId       
        ,@tableId               = tableId        
        ,@customerCompanyId     = customerCompanyId
        ,@tax                   = tax
        ,@discount              = discount
        ,@tip                   = tip
        ,@total                 = total
        ,@obs                   = obs       
        ,@quickSale             = quickSale
        ,@bodegaId              = bodegaId
        ,@userId                = userId
    FROM OPENJSON(@json)
        WITH(
            uuid UNIQUEIDENTIFIER '$.uuid',
            items NVARCHAR(MAX) '$.items' AS JSON,
            establecimientoId INT '$.establecimientoId',
            puntoEmisionId INT '$.puntoEmisionId',
            tableId INT '$.tableId',
            customerCompanyId INT '$.customerCompanyId',
            tax NUMERIC(18,5) '$.tax',
            discount NUMERIC(18,5) '$.discount',
            tip NUMERIC(18,5) '$.tip',
            total NUMERIC(18,5) '$.total',
            obs VARCHAR(500) '$.obs',
            quickSale BIT '$.quickSale',
            bodegaId INT '$.bodegaId',
            userId              INT '$.userId'
        )

    IF NOT EXISTS (SELECT TOP 1 1 FROM Config.v_ConfigDocumento cd
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
                uuid UNIQUEIDENTIFIER NOT NULL,
                itemTypeCode VARCHAR(8) NOT NULL,
                menuId INT NULL,
                itemId INT NULL,
                taxId INT NOT NULL,
                taxPercentId INT NOT NULL,
                feeId INT NOT NULL,
                taxValue NUMERIC (18,5) NOT NULL,
                quantity NUMERIC (18,5) NOT NULL,
                cost NUMERIC(18,5) NOT NULL,
                price NUMERIC(18,5) NOT NULL,
                discount NUMERIC(18,5),
                total NUMERIC(18,5) NOT NULL,
                obs VARCHAR(500) NULL,
                bodegaId int not null
            )

            INSERT INTO @tblItems(uuid, itemTypeCode, menuId, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total, obs, bodegaId)
            SELECT uuid, itemTypeCode, menuId, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total, obs, bodegaId
            FROM OPENJSON(@itemsJson)
                WITH (
                        uuid UNIQUEIDENTIFIER '$.uuid',
                        itemTypeCode VARCHAR(8) '$.itemTypeCode',
                        menuId INT '$.menuId',
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
                        feeId INT         '$.feeId',
                        obs NVARCHAR(500) '$.obs',
                        bodegaId int '$.bodegaId'
                      )

            IF NOT EXISTS(SELECT 1 FROM @tblItems)
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
        
    DECLARE @companyId INT
    ,@ruc VARCHAR(13)
    ,@estab VARCHAR(3)
    ,@ptoEmi VARCHAR(3)
    ,@idTipoDocumento INT
    ,@orderId INT 
    ,@tiempoCreditoId INT = 1
    ,@tipoDocumentoId INT

    SELECT @sequence        = cd.secuencial
        , @estab            = pa.estab
        , @ptoEmi           = pa.ptoEmi
        , @idTipoDocumento  = cd.idTipoDocumento
	FROM Config.v_ConfigDocumento cd
    INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
    WHERE pa.idUsuarioRol = @userRoleId AND cd.codDoc = 'OR'

    SELECT @companyId   = idEntidad
            , @ruc      = rucEmpresa
    FROM v_usuario
    WHERE idUsuarioRol = @userRoleId
    
    
    IF (@userId = 0)
        BEGIN
            SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        END

	BEGIN TRY
		BEGIN TRAN
            ----------------ORDER------------------
            IF NOT EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE Uuid = @uuid)
                BEGIN
                    SET @serie = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @sequence, DEFAULT)) 
                    
                    INSERT INTO Restaurant.[Order](EstablecimientoId, puntoEmisionId, TableId, [Sequence], Serie, CustomerCompanyId
                                                    , Tax, Discount, Total, [Enabled], UserId, obs, CreatedAt, Uuid)
                    VALUES(@establecimientoId, @puntoEmisionId, @tableId, @sequence, @serie, @customerCompanyId
                           , @tax, @discount, @total, 1, @userId, ISNULL(@obs, NULL), dbo.ufnGetDateEcuador(), @uuid)

	                SET @orderId = (SELECT SCOPE_IDENTITY())
                    
                    IF (@tableId > 0)
                        BEGIN
                            UPDATE Restaurant.[Table] SET Assigned = 1 WHERE Id = @tableId
                        END

                    INSERT INTO Restaurant.OrderItem(OrderId, Uuid, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost
                                                    , Price, Discount, Total, [Enabled], UserId, FeeId, Obs, BodegaId, ItemTypeId, MenuId, RemainingQuantity)
                    SELECT @orderId
                            ,uuid
                            ,IIF(itemId = 0, NULL, itemId)
                            ,taxId
                            ,taxPercentId
                            ,taxValue
                            ,quantity
                            ,cost
                            ,price
                            ,discount
                            ,total
                            ,1
                            ,@userId
                            ,feeId
                            ,obs
                            ,i.bodegaId
                            ,mt.Id
                            ,IIF(i.menuId = 0, NULL, i.menuId)
                            ,i.quantity
                    FROM @tblItems i
                    INNER JOIN Restaurant.ItemType mt ON mt.Code = i.itemTypeCode


                    IF NOT EXISTS (SELECT 1 FROM Restaurant.OrderItem WHERE OrderId = @orderId)
                        BEGIN
                            ROLLBACK TRAN
                            SELECT Common.ufnSpResponse('0', 'Error al guardar items', (SELECT * FROM @tblItems for json path))	
                            RETURN
                        END
                    
                    DECLARE @totalCook INT = 0

                    SET @totalCook = (SELECT COUNT(*) 
                                      FROM Restaurant.Item i 
                                      INNER JOIN @tblItems ii ON i.Id = ii.ItemId 
                                      WHERE i.Cooking = 1)

                    IF (@totalCook > 0)
                        BEGIN
                            INSERT INTO Restaurant.[OrderKitchen] (OrderId, [Enabled], Completed, UserId)
                            VALUES(@orderId, 1, 0, @userId)
                        END
                                            
                    UPDATE cf 
                    SET cf.ultimaSecuencia = vcf.secuencial + 1 
                    FROM ConfiguracionDocumento cf WITH (ROWLOCK)
                    JOIN (SELECT cd.idConfiguracionDocumento
                                    , cd.secuencial
			                FROM Config.v_ConfigDocumento cd
				            INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			                WHERE pa.idUsuarioRol = @userRoleId
			                AND cd.codDoc = 'OR'
                    ) AS vcf ON cf.idConfiguracionDocumento = vcf.idConfiguracionDocumento
                    
                    SET @payload = (SELECT orderId = @orderId)
                END
            ELSE
                BEGIN
                   SET @orderId = (SELECT Id FROM Restaurant.[Order] WHERE Uuid = @uuid)
                   
                   SET @payload = (SELECT orderId = @orderId)
                END
            -----------------END ORDER -----------------
            
            ----------------VENTA RAPIDA------------
            IF @quickSale = 1
                BEGIN
                    EXEC Restaurant.Order_Document_Insert @userRoleId, @orderId, @json, @payload OUTPUT
                END
            ----------------END VENTA RAPIDA--------
		COMMIT TRAN
        IF (@orderId > 0)
            SELECT Common.ufnSpResponse('1', 'Exitos al guardar', @payload)
        ELSE
            SELECT Common.ufnSpResponse('0', 'No se pudo guardar la orden', NULL)	
    END TRY
	BEGIN CATCH
		 SELECT Common.ufnSpResponse('0', 'Error al guardar el orden', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Order/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END
GO
