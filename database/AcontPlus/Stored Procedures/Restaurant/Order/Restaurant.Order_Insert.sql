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
            bodegaId INT '$.bodegaId'
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

            INSERT INTO @tblItems(uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total, obs)
            SELECT uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total, obs
            FROM OPENJSON(@itemsJson)
                WITH (
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
                        feeId INT         '$.feeId',
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
            , @userId   = idUsuario 
    FROM v_usuario
    WHERE idUsuarioRol = @userRoleId

	BEGIN TRY
		BEGIN TRAN
            ----------------ORDER------------------
            IF NOT EXISTS (SELECT 1 FROM Restaurant.[Order] WHERE Uuid = @uuid)
                BEGIN
                    SET @serie = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @sequence, DEFAULT)) 
                    
                    INSERT INTO Restaurant.[Order](EstablecimientoId, puntoEmisionId, TableId, [Sequence], Serie, CustomerCompanyId
                                                    , Tax, Discount, Total, [Enabled], UserId)
                    VALUES(@establecimientoId, @puntoEmisionId, @tableId, @sequence, @serie, @customerCompanyId
                           , @tax, @discount, @total, 1, @userId)

	                SET @orderId = (SELECT SCOPE_IDENTITY())
                    
                    INSERT INTO Restaurant.OrderItem(OrderId, Uuid, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost
                                                    , Price, Discount, Total, [Enabled], UserId, FeeId, Obs, BodegaId)
                    SELECT @orderId
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
                            , ISNULL(@bodegaId, 0)
                     FROM @tblItems
                    
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
                    JOIN (  SELECT cd.idConfiguracionDocumento
                                    , cd.secuencial
			                FROM Config.v_ConfigDocumento cd
				            INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			                WHERE pa.idUsuarioRol = @userRoleId
			                AND cd.codDoc = 'OR'
                    ) AS vcf ON cf.idConfiguracionDocumento = vcf.idConfiguracionDocumento
                END
            ELSE
                BEGIN
                   SET @orderId = (SELECT Id FROM Restaurant.[Order] WHERE Uuid = @uuid)
                END
            -----------------END ORDER -----------------

            ----------------VENTA RAPIDA------------
            IF @quickSale = 1
                BEGIN
                    

                    EXEC Restaurant.Order_Document_Insert @userRoleId, @orderId, @json, @payload
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
