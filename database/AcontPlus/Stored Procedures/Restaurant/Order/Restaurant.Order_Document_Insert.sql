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
-- Restaurant.Order_Document_Insert 
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Order_Document_Insert
@userRoleId INT
,@orderId   INT
,@json      NVARCHAR(MAX)
,@payload   NVARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @documentoId    INT
    ,@nroDocumento          INT
    ,@serieDocument         VARCHAR(18)
    ,@companyId             INT
    ,@ruc                   VARCHAR(13)
    ,@estab                 VARCHAR(3)
    ,@ptoEmi                VARCHAR(3) 
    ,@tiempoCreditoId       INT = 1
    ,@tipoDocumentoId       INT
    ,@ambiente              INT
    ,@autoSriAuth           BIT
    ,@customerCompanyId     INT
    ,@puntoEmisionId        INT
    ,@userId                INT
    ,@codDoc                VARCHAR(2)
    ,@fechaEmision          DATETIME2
    ,@tax                   NUMERIC(18,5)
    ,@taxPercent            NUMERIC(4,2)
    ,@discount              NUMERIC(18,5)
    ,@tip                   NUMERIC(18,5)
    ,@total                 NUMERIC(18,5)
    ,@establecimientoId     INT
    ,@obs                   VARCHAR(500)
    ,@estadoPagoId          INT 
    ,@tableId               INT
    ,@subtotalSinImpuestos  NUMERIC(18,5)
    ,@subTotalIva DECIMAL(18,5)
    ,@subTotalNetoIva DECIMAL(18,5)
    ,@subTotalIvaCero DECIMAL(18,5)
    ,@subTotalNetoIvaCero DECIMAL(18,5)
    ,@subTotalNoObjetoIva DECIMAL(18,5)
    ,@subTotalNetoNoObjetoIva DECIMAL(18,5)
    ,@subTotalExentoIva DECIMAL(18,5)
    ,@subTotalNetoExentoIva DECIMAL(18,5)
    ,@totalDescuento DECIMAL(18,5)
    ,@porcentajeDescuento DECIMAL(18,5)
    ,@totalIce DECIMAL(18,5)
    ,@propina DECIMAL(18,5)
    ,@iva DECIMAL(18,5)
    ,@recargo DECIMAL(18,5)
    ,@transporte DECIMAL(18,5)
    ,@itemsToPay NVARCHAR(MAX)
    ,@customDetail NVARCHAR(MAX)

    
    DECLARE @tblItems AS TABLE(
        uuid            UNIQUEIDENTIFIER NOT NULL,
        itemTypeId      INT NULL,
        menuId          INT NULL,
        itemId          INT NULL,
        taxId           INT NOT NULL,
        taxPercentId    INT NOT NULL,
        feeId           INT NOT NULL,
        taxValue        NUMERIC (18,5) NOT NULL,
        quantity        NUMERIC (18,5) NOT NULL,
        cost            NUMERIC(18,5) NOT NULL,
        price           NUMERIC(18,5) NOT NULL,
        discount        NUMERIC(18,5),
        total           NUMERIC(18,5) NOT NULL,
        obs             VARCHAR(500),
        bodegaId        INT,
        envioSri        BIT NULL DEFAULT 0,
        idArticulo      INT NULL DEFAULT 0,
        [description]   VARCHAR(500) NULL ,
        remainingQuantity NUMERIC(18,5)
    )
    
    DECLARE @tblTaxes AS TABLE (
        uuid            UNIQUEIDENTIFIER NOT NULL,
        taxId           INT NOT NULL,
        taxPercentId    INT NOT NULL,
        taxBase         NUMERIC(18,5) NOT NULL,
        taxValue        NUMERIC(18,5) NOT NULL
    )

    DECLARE @FacturaDetalleInsert AS TABLE(        
        idArticulo              INT NOT NULL
        , idTarifa              INT NOT NULL
        , idBodega              INT NOT NULL
        , idMedida              INT NOT NULL
        , ice                   NUMERIC(18,5) NULL
        , cantidad              NUMERIC(18,5) NULL
        , precioVenta           NUMERIC(18,5) NOT NULL
        , precioSinSubsidio     NUMERIC(18,5) NULL
        , precioConIva          NUMERIC(18,5) NOT NULL
        , valorDescuento        NUMERIC(18,5) NOT NULL
        , porcentajeDescuento   NUMERIC(18,5) NULL
        , total                 NUMERIC(18,5) NOT NULL
        , nota                  NVARCHAR(100) NULL
        , descripcion           NVARCHAR(200) NULL
        , precioCosto           NUMERIC(18,5) NOT NULL
        , idTipoIva             INT NULL
        , porcentajeIva         NUMERIC(18,5) NULL
        , iva                   NUMERIC(18,5) NULL
        , uuid                  UNIQUEIDENTIFIER NOT NULL
        , envioSri              BIT NOT NULL
    )

    SELECT @establecimientoId   = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId
        ,@customerCompanyId     = customerCompanyId
        ,@subtotalSinImpuestos  = subtotalSinImpuestos
        ,@taxPercent            = taxPercent
        ,@tax                   = tax
        ,@discount              = discount
        ,@tip                   = tip
        ,@total                 = total
        ,@obs                   = obs
        ,@codDoc                = codDoc       
        ,@tableId               = tableId    
        ,@itemsToPay            = itemsToPay
        ,@customDetail          = customDetail
    FROM OPENJSON(@json)
    WITH(establecimientoId      INT             '$.establecimientoId',
        puntoEmisionId          INT             '$.puntoEmisionId',
        tableId                 INT             '$.tableId',        
        customerCompanyId       INT             '$.customerCompanyId',
        subtotalSinImpuestos    NUMERIC(18,5)   '$.subtotalSinImpuestos',
        tax                     NUMERIC(18,5)   '$.tax',
        taxPercent              NUMERIC(4,2)    '$.taxPercent',
        discount                NUMERIC(18,5)   '$.discount',
        tip                     NUMERIC(18,5)   '$.tip',
        total                   NUMERIC(18,5)   '$.total',
        obs                     VARCHAR(500)    '$.obs',
        codDoc                  VARCHAR(2)      '$.codDoc',       
        tableId                 INT             '$.tableId',
        itemsToPay              NVARCHAR(MAX)   '$.itemsToPay' AS JSON,
        customDetail            NVARCHAR(MAX)   '$.customDetail' AS JSON
    )
    
    SET @fechaEmision = (SELECT dbo.ufnGetDateEcuador())

    SELECT TOP 1 @estadoPagoId = idEstadoPago 
    FROM dbo.EstadoPago WITH(NOLOCK) 
    WHERE codigo = 'PE'

    IF (ISJSON(@itemsToPay) = 1 AND LEN(RTRIM(LTRIM(@itemsToPay))) > 0)
        BEGIN
            INSERT INTO @tblItems(uuid, bodegaId, itemTypeId, menuId, itemId, taxId, taxPercentId, feeId, taxValue
                                 , quantity, cost, price, discount, total)
            SELECT oi.Uuid
                ,oi.bodegaId
                ,itemTypeId
                ,menuId
                ,ItemId
                ,TaxId
                ,TaxPercentId
                ,FeeId
                ,TaxValue
                ,ij.quantity
                ,Cost
                ,ij.price
                ,ij.discount
                ,ij.total               
            FROM Restaurant.OrderItem oi WITH(NOLOCK)
            JOIN (SELECT uuid, quantity, price, discount, total FROM OPENJSON(@itemsToPay)
                    WITH (
                        uuid        UNIQUEIDENTIFIER '$.uuid',
                        quantity    NUMERIC(18,2) '$.quantity',
                        price       NUMERIC(18,5) '$.price',
                        discount    NUMERIC(18,5) '$.discount',
                        total       NUMERIC(18,5) '$.total'
                    )
            ) AS ij ON ij.uuid = oi.uuid
                       
            --- Insert Taxes---
            INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxBase, taxValue)
            SELECT oi.Uuid
                , TaxId
                , TaxPercentId
                , Price
                , TaxValue
            FROM Restaurant.OrderItem oi WITH(NOLOCK)
            JOIN (SELECT uuid FROM OPENJSON(@itemsToPay)
                                    WITH (
                                            uuid UNIQUEIDENTIFIER '$.uuid'
                                            )
                        ) AS ij ON ij.uuid = oi.uuid

            UPDATE oi 
            SET  oi.Paid = IIF((oi.RemainingQuantity - ISNULL(ij.quantity,0)) = 0, 1, NULL) 
            ,oi.RemainingQuantity = (oi.RemainingQuantity - ISNULL(ij.quantity,0))
            
            FROM Restaurant.OrderItem oi WITH(ROWLOCK)
            JOIN (SELECT uuid, quantity FROM OPENJSON(@itemsToPay)
                                    WITH ( uuid UNIQUEIDENTIFIER '$.uuid',
                                            quantity    NUMERIC(18,2) '$.quantity'
                                            )
                        ) AS ij ON ij.uuid = oi.uuid
                        
            UPDATE Restaurant.[Order] WITH (ROWLOCK)
            SET Divided = 1
            WHERE Id = @orderId
            
            IF NOT EXISTS(SELECT 1 FROM Restaurant.OrderItem WITH (NOLOCK) 
                                WHERE orderId = @orderId 
                                    AND Paid IS NULL)
                BEGIN
                    UPDATE Restaurant.[Order] WITH (ROWLOCK)
                    SET Finished = 1
                    WHERE Id = @orderId
                END
        END
    ELSE
        BEGIN
            --- Insert Items ---
            INSERT INTO @tblItems(uuid, bodegaId, itemTypeId, menuId, itemId, taxId
                                  , taxPercentId, feeId, taxValue, quantity, cost
                                  , price, discount, total)
            SELECT Uuid
                , BodegaId
                , itemTypeId
                , menuId
                , ItemId
                , TaxId
                , TaxPercentId
                , FeeId
                , TaxValue
                , Quantity
                , Cost
                , Price
                , Discount
                , Total
            FROM Restaurant.OrderItem
            WHERE OrderId = @orderId
            
            --- Insert Taxes---
            INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxBase, taxValue)
            SELECT Uuid
                , TaxId
                , TaxPercentId
                , Price
                , TaxValue
            FROM Restaurant.OrderItem 
            WHERE OrderId = @orderId
            
            IF NOT EXISTS(SELECT TOP 1 1 FROM @tblItems)
                BEGIN
                    SELECT '0' code, 'No se pudieron recuperar los detalles' as 'message'
                    RETURN
                END

        END

    --- Select ---
    SELECT @companyId   = idEntidad
        , @ruc          = rucEmpresa
        , @userId       =  idUsuario 
    FROM v_usuario 
    WHERE idUsuarioRol  = @userRoleId

    -------------------------DOCUMENTOS DE VENTA-------------------------------
    SELECT @nroDocumento     = cd.secuencial
        , @ambiente          = cd.ambiente
        , @autoSriAuth       = cd.autoSriAuth
        , @tipoDocumentoId   = cd.idTipoDocumento
        , @estab             = pa.estab
        , @ptoEmi            = pa.ptoEmi 
    FROM Config.v_ConfigDocumento cd
    INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab 
    AND cd.idPuntoEmision = @puntoEmisionId
    WHERE pa.idUsuarioRol = @userRoleId AND cd.codDoc = @codDoc
                     
    IF (@customerCompanyId = 0)
        BEGIN 
            SELECT TOP 1 @customerCompanyId = idCliente FROM v_Cliente WHERE codIdentSri = '07'
        END

    IF @taxPercent IS NULL OR @taxPercent = 0
        BEGIN 
            SET @taxPercent = 0
        END       
    
    SELECT  @subtotalIva = SUM(oi.price), @subTotalNetoIva = SUM((oi.price) * oi.quantity) FROM @tblItems oi
                                                                                    INNER JOIN Sri.Impuesto i WITH (NOLOCK) ON oi.taxId = i.idImpuesto 
                                                                                    INNER JOIN Sri.TarifaImpuesto t WITH (NOLOCK) ON oi.taxPercentId = t.idTarifaImpuesto
                                                                                    WHERE i.codigo = '2'
                                                                                    

    SELECT  @subTotalIvaCero = SUM(oi.price), @subTotalNetoIvaCero = SUM((oi.price) * oi.quantity) FROM @tblItems oi
                                                INNER JOIN Sri.Impuesto i WITH (NOLOCK) ON oi.taxId = i.idImpuesto 
                                                INNER JOIN Sri.TarifaImpuesto t WITH (NOLOCK) ON oi.taxPercentId = t.idTarifaImpuesto
                                                WHERE i.codigo = '2'
                                                AND t.codigo = '0'
                                                AND ISNULL(oi.envioSri, 0) = 0 --- Se agrega para diferenciar y calcular los registros que tienen envioSri = 0 por detalle personalizado

    SELECT @subTotalNoObjetoIva = SUM(oi.price), @subTotalNetoNoObjetoIva = SUM((oi.price) * oi.quantity) FROM @tblItems oi
                                                INNER JOIN Sri.Impuesto i WITH (NOLOCK) ON oi.taxId = i.idImpuesto 
                                                INNER JOIN Sri.TarifaImpuesto t WITH (NOLOCK) ON oi.taxPercentId = t.idTarifaImpuesto
                                                WHERE i.codigo = '2'
                                                AND t.codigo = '6'
                                                AND ISNULL(oi.envioSri, 0) = 0 --- Se agrega para diferenciar y calcular los registros que tienen envioSri = 0 por detalle personalizado

    SELECT  @subTotalExentoIva = SUM(oi.price), @subTotalNetoExentoIva =  SUM((oi.price) * oi.quantity) FROM @tblItems oi
                                                INNER JOIN Sri.Impuesto i WITH (NOLOCK) ON oi.taxId = i.idImpuesto 
                                                INNER JOIN Sri.TarifaImpuesto t WITH (NOLOCK) ON oi.taxPercentId = t.idTarifaImpuesto
                                                WHERE  i.codigo = '2'
                                                AND t.codigo = '7'
                                                AND ISNULL(oi.envioSri, 0) = 0 --- Se agrega para diferenciar y calcular los registros que tienen envioSri = 0 por detalle personalizado

    SET @totalIce =  (SELECT SUM(oi.price) FROM @tblItems oi
                                                INNER JOIN Sri.Impuesto i WITH (NOLOCK) ON oi.taxId = i.idImpuesto 
                                                INNER JOIN Sri.TarifaImpuesto t WITH (NOLOCK) ON oi.taxPercentId = t.idTarifaImpuesto
                                                WHERE  i.codigo = '3'
                                                AND ISNULL(oi.envioSri, 0) = 0 --- Se agrega para diferenciar y calcular los registros que tienen envioSri = 0 por detalle personalizado
                                                )

                  
    ---------- INSERT NEW ---------------
    INSERT INTO @FacturaDetalleInsert(idArticulo, idTarifa, idBodega, idMedida, ice, cantidad, precioVenta, precioSinSubsidio    
                                    , precioConIva, valorDescuento, porcentajeDescuento, total, nota, descripcion, precioCosto
                                    , idTipoIva, porcentajeIva, iva, uuid, envioSri)

    SELECT idArticulo = (CASE WHEN i.idArticulo = 0 
                                THEN CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 m.ProductId FROM Restaurant.Menu m WHERE m.id = i.MenuId) 
                                        ELSE (SELECT TOP 1 ii.ProductId FROM Restaurant.Item ii WHERE ii.id = i.ItemId)
                                    END 
                                ELSE i.idArticulo 
                            END)
        ,i.feeId
        ,bodegaId
        ,idMedida = (CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.idMedida FROM Restaurant.Menu m
                                                                                INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                                WHERE m.id = i.MenuId) 
                            ELSE
                            (SELECT TOP 1 a.idMedida FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
                        END)
        
        ,0
        ,i.quantity
        ,i.price
        ,0
        ,i.taxValue + i.price
        ,i.discount
        ,0
        ,i.total
        ,i.obs
        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.descripcion FROM Restaurant.Menu m
                                                                        INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                        WHERE m.id = i.MenuId) 
                ELSE
                    (SELECT TOP 1 a.descripcion FROM Restaurant.Item ii  
                                                INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo 
                                                WHERE ii.id = i.ItemId)
                END


            ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.precioCosto FROM Restaurant.Menu m
                                                                        INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                        WHERE m.id = i.MenuId) 
                ELSE
                (SELECT TOP 1 a.precioCosto FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
                END

        ,(SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo) 
        ,0
        ,(CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.porcentaje FROM Restaurant.Menu m
                                                                        INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                        WHERE m.id = i.MenuId) 
                ELSE
                (SELECT TOP 1 a.porcentaje FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
                END/100) * total
        ,i.uuid
        ,i.envioSri
    FROM @tblItems i
    INNER JOIN Restaurant.ItemType it ON i.itemTypeId = it.Id
    INNER JOIN Sri.TarifaImpuesto sti ON i.taxPercentId = sti.idTarifaImpuesto


    IF (ISJSON(@customDetail) = 1 AND LEN(RTRIM(LTRIM(@customDetail))) > 0)
        BEGIN
                
            INSERT INTO @tblItems(uuid, bodegaId, itemTypeId, menuId, itemId, taxId
                                , taxPercentId, feeId, taxValue, quantity, cost
                                , price, discount, total, envioSri, idArticulo, [description])

            SELECT uuid
                , bodegaId
                , 0 AS itemTypeId
                , 0 AS menuId
                , 0 AS itemId
                , taxId
                , taxPercentId
                , feeId
                , taxValue
                , quantity
                , cost
                , price
                , discount
                , total
                , envioSri
                , productId
                , [description]
            FROM OPENJSON(@customDetail)
            WITH(
                uuid            UNIQUEIDENTIFIER    '$.uuid' 
                ,bodegaId       INT                 '$.bodegaId'
                ,taxId          INT                 '$.taxId'
                ,taxPercentId   INT                 '$.taxPercentId'
                ,feeId          INT                 '$.feeId'
                ,taxValue       NUMERIC(18,5)       '$.taxValue'
                ,quantity       INT                 '$.quantity'
                ,cost           NUMERIC(18,5)       '$.cost'
                ,price          NUMERIC(18,5)       '$.price'
                ,discount       NUMERIC(18,5)       '$.discount'
                ,total          NUMERIC(18,5)       '$.total'
                ,envioSri       BIT                 '$.envioSri' 
                ,productId      INT                 '$.productId'
                ,[description]  VARCHAR(500)        '$.description'
            )

        INSERT INTO @FacturaDetalleInsert(idArticulo, idTarifa, idBodega, idMedida, ice, cantidad, precioVenta, precioSinSubsidio    
            , precioConIva, valorDescuento, porcentajeDescuento, total, nota, descripcion, precioCosto, idTipoIva, porcentajeIva        
            , iva, uuid, envioSri)

        SELECT i.idArticulo 
            ,i.feeId
            ,i.bodegaId
            ,a.idMedida                 AS idMedida
            ,0                          AS ice
            ,i.quantity                 AS cantidad
            ,i.price                    AS precioVenta
            ,0                          AS precioSinSubsidio
            ,i.taxValue + i.price       AS precioConIva
            ,i.discount                 AS valorDescuento
            ,0                          AS porcentajeDescuento
            ,i.total      
            ,''                         AS nota
            ,i.description
            , 0                         AS precioCosto
            , (SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS VARCHAR(1)) = sti.codigo) AS idTipoIva
            , 0                         AS porcentajeIva
            , i.taxValue                AS iva
            , i.uuid
            , i.envioSri
        FROM @tblItems i
        INNER JOIN Sri.TarifaImpuesto sti ON sti.idTarifaImpuesto = i.taxPercentId
        INNER JOIN Inventario.v_Articulo a ON a.idArticulo = i.idArticulo 
        WHERE ISNULL(envioSri, 0) = 1                
    END
     
    ---- NOTA DE ENTREGA ----
    IF @codDoc = 'NE'
        BEGIN
             
            INSERT INTO NotaEntrega 
            (idCliente, idPuntoEmision, idTiempoCredito, nroDocumento, subTotalSinImpuestos, subTotalIva
            ,subTotalNetoIva, subTotalIvaCero, subTotalNetoIvaCero, subTotalNoObjetoIva, subTotalNetoNoObjetoIva
            ,subTotalExentoIva, subTotalNetoExentoIva, totalDescuento, porcentajeDescuento, totalIce
            ,propina, iva, total, tarifa
            ,observacion, fechaRegistro, idUsuario, idEntidad, fechaEmision, fechaVencimiento, idEstadoPago
            , idTipoDocumento)
            
            VALUES(@customerCompanyId, @puntoEmisionId, @tiempoCreditoId, @nroDocumento, @subtotalSinImpuestos, ISNULL(@subTotalIva,0)
            ,ISNULL(@subTotalNetoIva,0), ISNULL(@subTotalIvaCero,0), ISNULL(@subTotalNetoIvaCero,0), ISNULL(@subTotalNoObjetoIva,0), ISNULL(@subTotalNetoNoObjetoIva,0)
            ,ISNULL(@subTotalExentoIva,0), ISNULL(@subTotalNetoExentoIva,0), @discount, 0, ISNULL(@totalIce,0)
            , @tip, @tax, @total, @taxPercent
            , @obs, dbo.ufnGetDateEcuador(), @userId, @companyId,  @fechaEmision, @fechaEmision, @estadoPagoId
            , @tipoDocumentoId)
            
            SET @documentoId = (SELECT SCOPE_IDENTITY())

            IF (@documentoId > 0)
                BEGIN
                    INSERT INTO NotaEntregaDetalle(idNotaEntrega, idArticulo, idBodega, idMedida, descripcion, cantidad, precioVenta
                    ,idTarifa, idTipoIva, iva, precioConIva, valorDescuento, porcentajeDescuento, total, nota, fechaRegistro, uuid)

                    SELECT @documentoId
                        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 m.ProductId FROM Restaurant.Menu m WHERE m.id = i.MenuId) ELSE
                            (SELECT TOP 1 ii.ProductId FROM Restaurant.Item ii WHERE ii.id = i.ItemId)
                        END 
                        ,bodegaId
                        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.idMedida FROM Restaurant.Menu m
                            INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                        WHERE m.id = i.MenuId) ELSE
                            (SELECT TOP 1 a.idMedida FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
                        END 
                        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.descripcion FROM Restaurant.Menu m
                            INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                        WHERE m.id = i.MenuId) ELSE
                            (SELECT TOP 1 a.descripcion FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
                        END 
                        ,i.quantity
                        ,i.price
                        ,i.feeId
                        ,(SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo) 
                        ,i.taxValue
                        ,i.taxValue + i.price
                        ,i.discount
                        ,0
                        ,i.total
                        ,i.obs
                        ,dbo.ufnGetDateEcuador()
                        ,i.uuid
                    FROM @tblItems i
                    INNER JOIN Restaurant.ItemType it ON i.itemTypeId = it.Id
                    --INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                    --INNER JOIN Inventario.v_Articulo a ON ri.ProductId = a.idArticulo
                    INNER JOIN Sri.TarifaImpuesto sti ON i.taxPercentId = sti.idTarifaImpuesto

                    INSERT INTO Ventas.NotaEntregaImpuesto(TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, Uuid, UserId)                    
                    SELECT t.taxId
                        , t.taxPercentId
                        , ti.porcentaje
                        , t.taxBase
                        , t.taxValue
                        , t.uuid
                        , @userId
                    FROM @tblTaxes t
                    INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto

                    UPDATE ne 
                    SET ne.NotaEntregaDetalleId = i.idNotaEntregaDetalle
                    FROM Ventas.NotaEntregaImpuesto ne 
                    JOIN (SELECT ii.uuid, nd.idNotaEntregaDetalle FROM @tblItems ii 
                                                                  INNER JOIN NotaEntregaDetalle nd ON ii.uuid = nd.uuid
                    ) AS i ON ne.Uuid = i.uuid
                END

        END

    --- FACTURA DE VENTA
    IF @codDoc = 'FV'
        BEGIN
            DECLARE @claveAcceso VARCHAR(49)
           
            SET @claveAcceso = (SELECT dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab), '01', @ambiente, 1, dbo.AFTConvertDate(@fechaEmision), @ruc, @estab + @ptoEmi, Helper.F_Auto_Sequential(@nroDocumento)))

            INSERT INTO Factura (idCliente, idPuntoEmision, idEstadoPago, idTipoDocumento, idTiempoCredito, ambiente, porcentaje
                ,idEntidad, idUsuario, claveAcceso, nroFactura, fechaEmision, fechaVencimiento, subTotalSinImpuestos, subTotalIva
                ,subTotalNetoIva, subTotalIvaCero, subTotalNetoIvaCero, subTotalNoObjetoIva, subTotalNetoNoObjetoIva
                ,subTotalExentoIva, subTotalNetoExentoIva, totalDescuento, porcentajeDescuento, totalIce, propina
                ,iva, recargo, transporte, total, observacion, fechaRegistro)
        
            VALUES(@customerCompanyId, @puntoEmisionId, @estadoPagoId, @tipoDocumentoId ,@tiempoCreditoId ,@ambiente, @taxPercent
                ,@companyId, @userId, @claveAcceso, @nroDocumento, @fechaEmision, @fechaEmision, @subtotalSinImpuestos, ISNULL(@subtotalIva,0)
                ,ISNULL(@subTotalNetoIva,0), ISNULL(@subTotalIvaCero,0), ISNULL(@subTotalNetoIvaCero,0), ISNULL(@subTotalNoObjetoIva,0), ISNULL(@subTotalNetoNoObjetoIva,0)
                ,ISNULL(@subTotalExentoIva,0), ISNULL(@subTotalNetoExentoIva,0), @discount, 0, ISNULL(@totalIce,0), @tip
                ,@tax, 0, 0, @total, @obs, dbo.ufnGetdateEcuador())
                                     
            SET @documentoId = (SELECT SCOPE_IDENTITY()) 

            
            --------------------------- INSERT HERE NOW --------------                        
            INSERT INTO FacturaDetalle(idFactura, idArticulo, idTarifa, idBodega, idMedida, ice, cantidad, precioVenta, precioSinSubsidio
                                       ,precioConIva, valorDescuento, porcentajeDescuento, total, nota, descripcion, precioCosto
                                       ,idTipoIva, porcentajeIva, iva, uuid, envioSri)

            SELECT @documentoId
                ,idArticulo
                , idTarifa
                , idBodega
                , idMedida
                , ice
                , cantidad
                , precioVenta
                , precioSinSubsidio    
                , precioConIva
                , valorDescuento
                , porcentajeDescuento
                , total
                , nota
                , descripcion
                , precioCosto
                , idTipoIva
                , porcentajeIva
                , iva
                , uuid
                , envioSri
            FROM @FacturaDetalleInsert

            --SELECT @documentoId
            --     ,CASE WHEN i.idArticulo = 0 THEN CASE WHEN it.code = 'MENU' 
            --                                      THEN (SELECT TOP 1 m.ProductId FROM Restaurant.Menu m WHERE m.id = i.MenuId) 
            --                                 ELSE (SELECT TOP 1 ii.ProductId FROM Restaurant.Item ii WHERE ii.id = i.ItemId)
            --      END 
            --      ELSE i.idArticulo 
            --      END
            --    ,i.feeId
            --    ,bodegaId
            --     ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.idMedida FROM Restaurant.Menu m
            --                INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
            --            WHERE m.id = i.MenuId) ELSE
            --                (SELECT TOP 1 a.idMedida FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
            --            END 
        
            --    ,0
            --    ,i.quantity
            --    ,i.cost
            --    ,0
            --    ,i.taxValue
            --    ,i.discount
            --    ,0
            --    ,i.total
            --    ,i.obs
            --    ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.descripcion FROM Restaurant.Menu m
            --                INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
            --            WHERE m.id = i.MenuId) ELSE
            --                (SELECT TOP 1 a.descripcion FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
            --            END
            --                     ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.precioCosto FROM Restaurant.Menu m
            --                INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
            --            WHERE m.id = i.MenuId) ELSE
            --                (SELECT TOP 1 a.precioCosto FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
            --            END
            --    ,(SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo) 
            --    ,0
            --    ,(CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.porcentaje FROM Restaurant.Menu m
            --                INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
            --            WHERE m.id = i.MenuId) ELSE
            --                (SELECT TOP 1 a.porcentaje FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
            --            END/100) * total
            --    ,i.uuid
            --    ,i.envioSri
            --FROM @tblItems i
            --INNER JOIN Restaurant.ItemType it ON i.itemTypeId = it.Id
            --INNER JOIN Sri.TarifaImpuesto sti ON i.taxPercentId = sti.idTarifaImpuesto

            ---------------------------------------------------------------
                      
            INSERT INTO Ventas.FacturaImpuesto(TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, Uuid, UserId)                    
                    SELECT t.taxId
                        , t.taxPercentId
                        , ti.porcentaje
                        , t.taxBase
                        , t.taxValue
                        , t.uuid
                        , @userId
                    FROM @tblTaxes t
                    INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto

            UPDATE ne 
            SET ne.FacturaDetalleId = i.idFacturaDetalle
            FROM Ventas.FacturaImpuesto ne 
            JOIN (SELECT ii.uuid, nd.idFacturaDetalle FROM @tblItems ii 
                                                            INNER JOIN FacturaDetalle nd ON ii.uuid = nd.uuid
            ) AS i ON ne.Uuid = i.uuid


            --forma de pago
			INSERT INTO dbo.FormaPagoFactura (idFactura, idFormaPagoSri, idTiempoCredito, abono, idUsuario, fechaRegistro)
			SELECT @documentoId, Helper.F_FormaPago_Get_Generate(@documentoId, @tipoDocumentoId), @tiempoCreditoId, @total, @userId ,dbo.ufnGetDateEcuador()
			--forma de pago


            INSERT INTO dbo.DocumentoElectronico(ambiente,codDoc,idDocumento,idContribuyente,nroDocumento,idPuntoEmision,numEstab
                                                ,ptoEmision,claveAcceso,versionComp,isAutomatic,fechaEmision,codigoAutorizacion
                                                ,idUsuario,idEntidad)

            SELECT @ambiente
                , '01'
                , @documentoId
                , @customerCompanyId
                , @nroDocumento
                , @puntoEmisionId
                , @estab
                , @ptoEmi
                , @claveAcceso
                , '1.1.0'
                , @autoSriAuth
                , @fechaEmision
                , @claveAcceso
                , @userId
                , @companyId
        END

    ---- INSERT OrderDocument -----
    INSERT INTO Restaurant.OrderDocument(OrderId, DocumentoId, TipoDocumentoId, [Enabled], UserId)
    VALUES(@orderId, @documentoId, @tipoDocumentoId, 1, @userId)

    UPDATE cf 
    SET cf.ultimaSecuencia = vcf.secuencial + 1
    FROM ConfiguracionDocumento cf WITH (ROWLOCK)
    JOIN (  SELECT cd.idConfiguracionDocumento, cd.secuencial 
            FROM Config.v_ConfigDocumento cd
            INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab 
            AND cd.idPuntoEmision = @puntoEmisionId
            WHERE pa.idUsuarioRol = @userRoleId
            AND cd.codDoc = @codDoc
    ) AS vcf ON cf.idConfiguracionDocumento = vcf.idConfiguracionDocumento

    DECLARE @inventory BIT

    SET @inventory = (SELECT inventario FROM Config.v_Sistema WHERE idEntidad = @companyId AND codConfig = 'CI')

    IF (@inventory = 1)
        BEGIN
            DECLARE @idArticulo         INT
            ,@idBodega                  INT
            ,@idMedida                  INT
            ,@idTarifa                  INT
            ,@cantidad                  NUMERIC(18,2)
            ,@precioUnitario            NUMERIC(18,5)
            ,@precioCosto               NUMERIC(18,5) 
            ,@precioTotalSinImpuesto    NUMERIC(18,5)
            ,@codDocTran                VARCHAR(2)

            DECLARE @tblInventory AS TABLE (
                idArticulo                 INT
                ,idBodega                  INT
                ,idMedida                  INT
                ,idTarifa                  INT
                ,cantidad                  NUMERIC(18,2)
                ,precioUnitario            NUMERIC(18,5)
                ,precioCosto               NUMERIC(18,5) 
                ,precioTotalSinImpuesto    NUMERIC(18,5)
            )

            --INSERT ITEMS
            INSERT INTO @tblInventory(idArticulo, idBodega, idMedida, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto)
            SELECT a.idArticulo, bodegaId, a.idMedida, i.feeId, i.quantity, i.price, a.precioCosto, i.total
            FROM @tblItems i
            INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
            INNER JOIN Articulo a WITH (NOLOCK) ON ri.idArticulo = a.idArticulo 
            WHERE a.llevaInventario = 1

            --INSERT Menu
            INSERT INTO @tblInventory(idArticulo, idBodega, idMedida, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto)
            SELECT a.idArticulo, bodegaId, a.idMedida, i.feeId, i.quantity, i.price, a.precioCosto, i.total
            FROM @tblItems i
                INNER JOIN Restaurant.Menu m ON i.menuId = m.Id
                INNER JOIN Articulo a WITH (NOLOCK) ON m.ProductId = a.idArticulo 
            WHERE a.llevaInventario = 1
            
            --INSERT MENU ITEMS
            INSERT INTO @tblInventory(idArticulo, idBodega, idMedida, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto)
            SELECT a.idArticulo, bodegaId, a.idMedida, i.feeId, i.quantity, i.price, a.precioCosto, i.total
            FROM @tblItems i
                INNER JOIN Restaurant.Menu m ON i.menuId = m.Id
                INNER JOIN Restaurant.MenuItem mi ON m.Id = mi.MenuId
                INNER JOIN Restaurant.Item ii ON mi.itemId = ii.Id
                INNER JOIN Articulo a WITH (NOLOCK) ON ii.ProductId = a.idArticulo 
            WHERE a.llevaInventario = 1

            --INSERT INGREDIENTS ITMES
            INSERT INTO @tblInventory(idArticulo, idBodega, idMedida, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto)
            SELECT a.idArticulo, bodegaId, a.idMedida, i.feeId, r.quantity * i.quantity, i.price, a.precioCosto, i.total
            FROM @tblItems i
                INNER JOIN Restaurant.Recipe r ON i.itemId = r.ItemId
                INNER JOIN Restaurant.Ingredient ing WITH (NOLOCK) ON r.IngredientId = ing.Id
                INNER JOIN Inventario.v_Articulo a On ing.ProductId = a.idArticulo 
            WHERE a.llevaInventario = 1

             --INSERT MENU ITEMS INGREDIENTS
            INSERT INTO @tblInventory(idArticulo, idBodega, idMedida, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto)
            SELECT a.idArticulo, bodegaId, a.idMedida, i.feeId, i.quantity, i.price, a.precioCosto, i.total
            FROM @tblItems i
                INNER JOIN Restaurant.Menu m ON i.menuId = m.Id
                INNER JOIN Restaurant.MenuItem mi ON m.Id = mi.MenuId
                INNER JOIN Restaurant.Item ii ON mi.itemId = ii.Id
                 INNER JOIN Restaurant.Recipe r ON ii.Id = r.ItemId
                INNER JOIN Restaurant.Ingredient ing WITH (NOLOCK) ON r.IngredientId = ing.Id
                INNER JOIN Articulo a WITH (NOLOCK) ON ing.ProductId = a.idArticulo 
            WHERE a.llevaInventario = 1

            SET @codDocTran = (SELECT IIF(@codDoc = 'FV', 'FE', 'NE'))
            
            IF EXISTS (SELECT 1 FROM @tblInventory)
                BEGIN
                    DECLARE cursor_inventory CURSOR LOCAL FOR
                   
                    SELECT idArticulo, idBodega, idMedida, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto FROM @tblInventory

                    OPEN cursor_inventory
                        FETCH NEXT FROM cursor_inventory INTO @idArticulo
                                                            , @idBodega
                                                            , @idMedida
                                                            , @idTarifa
                                                            , @cantidad
                                                            , @precioUnitario
                                                            , @precioCosto
                                                            , @precioTotalSinImpuesto
                        WHILE @@FETCH_STATUS = 0
                            BEGIN
                                EXEC Inventario.Transaccion_Insert 'S', @codDocTran, @fechaEmision, @documentoId,  @idArticulo, @idBodega ,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto, @userId
                                FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida, @idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto
                            END
                    CLOSE cursor_inventory
                    DEALLOCATE cursor_inventory  
                END
        END

    SET @serieDocument = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @nroDocumento, DEFAULT))

        --------------------END DOCUMENTOS---------------------
    DECLARE @codDocCuentaCobrar VARCHAR(2)

    SET @codDocCuentaCobrar = (SELECT IIF(@codDoc = 'FV', '01', 'NE'))
   
    EXEC Contabilidad.CuentaPorCobrar_Insert @codDocCuentaCobrar
                                            , @documentoId
                                            , @puntoEmisionId
                                            , 1
                                            , @customerCompanyId
                                            , @nroDocumento
                                            , @serieDocument
                                            , @fechaEmision
                                            , @fechaEmision
                                            , @total
                                            , @companyId
                                            , @userId

    --------------------PAYLOADS------------------
    DECLARE @payAutomatic BIT
    ,@printerAutomatic BIT
    ,@idCuentaPorCobrar INT                           
    ,@codEstab VARCHAR(15)

    SET @codEstab = (SELECT codEstab FROM Sri.Establecimiento WHERE idEstablecimiento = @establecimientoId)

    SELECT TOP 1 @payAutomatic   = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.payAutomatic')
            , @printerAutomatic  = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.printerAutomatic') 
    FROM Config.Sistema WITH (NOLOCK) 
    WHERE idEntidad = @companyId 
    AND codConfig = 'CV' 
                
    SELECT TOP 1 @idCuentaPorCobrar = idCuentaPorCobrar
    FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK)
    WHERE codDoc = @codDocCuentaCobrar
    AND idDocumento = @documentoId
        
    SET @payload = (SELECT idDocumento      = @documentoId
                        ,idTipoDocumento    = @tipoDocumentoId
                        ,codEstab           = @codEstab
                        ,tiempoCredito      = @tiempoCreditoId
                        ,idCliente          = @customerCompanyId
                        ,codDoc             = @codDocCuentaCobrar
                        ,idCuentaPorCobrar  = @idCuentaPorCobrar
                        ,payAutomatic       = @payAutomatic
                        ,printerAutomatic   = @printerAutomatic
                        ,orderId            = @orderId
                    FOR JSON PATH)
                   
    SET @payload = (SELECT @payload)
END