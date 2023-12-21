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
    ,@totalDescuento DECIMAL(18,5)
    ,@porcentajeDescuento DECIMAL(18,5)
    ,@propina DECIMAL(18,5)
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
        remainingQuantity NUMERIC(18,5),
        cantidadStock NUMERIC (18,5) NOT NULL,
        cantidadTransaccion NUMERIC(18,5) NOT NULL,
        medidaId        INT NOT NULL
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
        , medidaId              INT NOT NULL
        , ice                   NUMERIC(18,5) NULL
        , cantidad              NUMERIC(18,5) NULL
        , precioUnitario        NUMERIC(18,5) NOT NULL
        , precioSinSubsidio     NUMERIC(18,5) NULL
        , valorDescuento        NUMERIC(18,5) NOT NULL
        , porcentajeDescuento   NUMERIC(18,5) NULL
        ,precioTotalSinImpuesto NUMERIC(18,5) NOT NULL
        , nota                  NVARCHAR(100) NULL
        , descripcion           NVARCHAR(200) NULL
        , precioCosto           NUMERIC(18,5) NOT NULL
        , idTipoIva             INT NOT NULL
        , codigoPorcentaje      VARCHAR(5) NOT NULL
        , tarifa                NUMERIC(18,5) NOT NULL
        , valorImpuesto         NUMERIC(18,5) NOT NULL
        , uuid                  UNIQUEIDENTIFIER NOT NULL
        , envioSri              BIT NOT NULL
    )

    SELECT @establecimientoId   = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId
        ,@customerCompanyId     = customerCompanyId
        ,@subtotalSinImpuestos  = subtotalSinImpuestos
        ,@tax                   = tax
        ,@discount              = discount
        ,@tip                   = tip
        ,@total                 = total
        ,@obs                   = obs
        ,@codDoc                = codDoc       
        ,@tableId               = tableId    
        ,@itemsToPay            = itemsToPay
        ,@customDetail          = customDetail
        ,@userId                = userId
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
        customDetail            NVARCHAR(MAX)   '$.customDetail' AS JSON,
        userId              INT '$.userId'
    )
    
    SET @fechaEmision = (SELECT dbo.ufnGetDateEcuador())

    SELECT TOP 1 @estadoPagoId = idEstadoPago 
    FROM dbo.EstadoPago WITH(NOLOCK) 
    WHERE codigo = 'PE'

    IF (ISJSON(@itemsToPay) = 1 AND LEN(RTRIM(LTRIM(@itemsToPay))) > 0)
        BEGIN
            INSERT INTO @tblItems(uuid, bodegaId, itemTypeId, menuId, itemId, taxId, taxPercentId, feeId, taxValue
                                 , quantity, cost, price, discount, total, medidaId, cantidadStock, cantidadTransaccion, envioSri)
            SELECT oi.Uuid
                ,oi.bodegaId
                ,itemTypeId
                ,menuId
                ,ItemId
                ,TaxId
                ,oi.TaxPercentId
                ,FeeId
                ,TaxValue
                ,ij.quantity
                ,Cost
                ,ij.price
                ,ij.discount
                ,ij.total               
                ,oi.MedidaId
                ,ISNULL(CASE
					WHEN o.CreatedAt >= (SELECT s.fechaConsolidacion FROM Inventario.Stock s WITH (NOLOCK) WHERE idArticulo = i.ProductId AND idBodega = oi.BodegaId)
						THEN
							ISNULL((SELECT conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = i.ProductId AND idMedida = oi.MedidaID) * ij.Quantity , ij.Quantity) * -1
				ELSE
					0
				END, 0) 

                ,(ISNULL((SELECT conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = i.ProductId AND idMedida = oi.MedidaID) * ij.Quantity , ij.Quantity)) 
                ,1
            FROM Restaurant.OrderItem oi WITH(NOLOCK)
            INNER JOIN Restaurant.[Order] o ON oi.OrderId = o.ID
			INNER JOIN Restaurant.v_Item i ON oi.ItemId = i.Id
            JOIN (SELECT uuid, quantity, price, discount, total FROM OPENJSON(@itemsToPay)
                    WITH (
                        uuid        UNIQUEIDENTIFIER '$.uuid',
                        quantity    NUMERIC(18,2) '$.quantity',
                        price       NUMERIC(18,5) '$.price',
                        discount    NUMERIC(18,5) '$.discount',
                        total       NUMERIC(18,5) '$.total'
                    )
            ) AS ij ON ij.uuid = oi.uuid
            WHERE oi.Deleted IS NULL
                AND oi.[Enabled] = 1
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
            WHERE oi.Deleted IS NULL
                AND oi.[Enabled] = 1

            UPDATE oi 
            SET  oi.Paid = IIF((oi.RemainingQuantity - ISNULL(ij.quantity,0)) = 0, 1, NULL) 
            ,oi.RemainingQuantity = (oi.RemainingQuantity - ISNULL(ij.quantity,0))
            
            FROM Restaurant.OrderItem oi WITH(ROWLOCK)
            JOIN (SELECT uuid, quantity FROM OPENJSON(@itemsToPay)
                                    WITH ( uuid UNIQUEIDENTIFIER '$.uuid',
                                            quantity    NUMERIC(18,2) '$.quantity'
                                            )
                        ) AS ij ON ij.uuid = oi.uuid
            WHERE  oi.Deleted IS NULL
                AND oi.[Enabled] = 1
                        
            UPDATE Restaurant.[Order] WITH (ROWLOCK)
            SET Divided = 1
            WHERE Id = @orderId
            
            IF NOT EXISTS(SELECT 1 FROM Restaurant.OrderItem oi WITH (NOLOCK) 
                                WHERE orderId = @orderId 
                                    AND oi.Deleted IS NULL
                                    AND oi.[Enabled] = 1
                                    AND oi.Paid IS NULL)
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
                                  , price, discount, total, medidaId, cantidadStock, cantidadTransaccion, envioSri)
            SELECT oi.Uuid
                ,BodegaId
                ,itemTypeId
                ,menuId
                ,ItemId
                ,TaxId
                ,oi.TaxPercentId
                ,FeeId
                ,TaxValue
                ,Quantity
                ,Cost
                ,Price
                ,oi.Discount
                ,oi.Total
                ,MedidaId
                ,ISNULL(CASE
					WHEN o.CreatedAt >= (SELECT s.fechaConsolidacion FROM Inventario.Stock s WITH (NOLOCK) WHERE idArticulo = i.ProductId AND idBodega = oi.BodegaId)  
						THEN
							ISNULL((SELECT conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = i.ProductId AND idMedida = oi.MedidaID) * oi.Quantity , oi.Quantity) * -1
				ELSE
					0
				END,0) 
               ,ISNULL((SELECT conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = i.ProductId AND idMedida = oi.MedidaID) * oi.Quantity , oi.Quantity) 
               ,1
           FROM Restaurant.OrderItem oi WITH (NOLOCK)
                INNER JOIN Restaurant.[Order] o WITH (NOLOCK) ON oi.OrderId = o.ID
			    INNER JOIN Restaurant.Item i WITH (NOLOCK) ON oi.ItemId = i.Id
            WHERE OrderId = @orderId
                AND oi.Deleted IS NULL
                AND oi.[Enabled] = 1
            
            --- Insert Taxes---
            INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxBase, taxValue)
            SELECT Uuid
                , TaxId
                , TaxPercentId
                , Price
                , TaxValue
            FROM Restaurant.OrderItem oi
            WHERE OrderId = @orderId
                AND oi.Deleted IS NULL
                AND oi.[Enabled] = 1
            
            IF NOT EXISTS(SELECT TOP 1 1 FROM @tblItems)
                BEGIN
                    SELECT '0' code, 'No se pudieron recuperar los detalles' as 'message'
                    RETURN
                END

            UPDATE oi SET oi.Paid = 1

             FROM Restaurant.OrderItem oi WITH(ROWLOCK)
             WHERE oi.orderId = @orderId
                AND oi.Deleted IS NULL
                AND oi.[Enabled] = 1

              UPDATE Restaurant.[Order] WITH (ROWLOCK)
                    SET Finished = 1
              WHERE Id = @orderId
        END

    --- Select ---
    SELECT @companyId   = idEntidad
        , @ruc          = rucEmpresa
    FROM v_usuario 
    WHERE idUsuarioRol  = @userRoleId

     IF (@userId = 0)
        BEGIN
            SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)
        END

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

   SET @taxPercent = (SELECT porcentaje FROM Sri.TarifaImpuesto ti WITH (NOLOCK) INNER JOIN Restaurant.[Order] o WITH (NOLOCK) ON ti.idTarifaImpuesto = o.TaxPercentId WHERE o.Id = @orderId )
    
    ---------- INSERT NEW ---------------
    INSERT INTO @FacturaDetalleInsert(idArticulo, idTarifa, idBodega, medidaId, ice, cantidad, precioUnitario, precioSinSubsidio    
                                    , valorDescuento, porcentajeDescuento, precioTotalSinImpuesto, nota, descripcion, precioCosto
                                    , idTipoIva,codigoPorcentaje,tarifa,valorImpuesto, uuid, envioSri)

    SELECT idArticulo = (CASE WHEN i.idArticulo = 0 THEN CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 m.ProductId FROM Restaurant.Menu m WHERE m.id = i.MenuId) 
                                                                                    ELSE (SELECT TOP 1 ii.ProductId FROM Restaurant.Item ii WHERE ii.id = i.ItemId)
                                                          END 
                                                    ELSE i.idArticulo 
                         END)
        ,i.feeId
        ,bodegaId
        ,i.medidaId
        ,0
        ,i.quantity
        ,i.price
        ,0
        ,i.discount
        ,0
        ,i.total
        ,i.obs
        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.descripcion FROM Restaurant.Menu m
                                                                     INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                     WHERE m.id = i.MenuId) 

                                    ELSE (SELECT TOP 1 a.descripcion FROM Restaurant.Item ii  
                                                                     INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo 
                                                                     WHERE ii.id = i.ItemId)
         END


        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.precioCosto FROM Restaurant.Menu m
                                                                          INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                          WHERE m.id = i.MenuId) 

                                    ELSE (SELECT TOP 1 a.precioCosto FROM Restaurant.Item ii  
                                                                     INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo 
                                                                     WHERE ii.id = i.ItemId)
         END

        ,(SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo) 
        ,(SELECT TOP 1 codigoPorcentaje FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo)
        ,(SELECT TOP 1 porcentaje FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo)

        ,(CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.porcentaje FROM Restaurant.Menu m
                                                                     INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                     WHERE m.id = i.MenuId) 

                                     ELSE (SELECT TOP 1 a.porcentaje FROM Restaurant.Item ii  INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo WHERE ii.id = i.ItemId)
          END/100) * total
        ,i.uuid
        ,CASE WHEN ISJSON(@customDetail) = 1 AND LEN(RTRIM(LTRIM(@customDetail))) > 0 THEN 0 ELSE 1 END
    FROM @tblItems i
    INNER JOIN Restaurant.ItemType it ON i.itemTypeId = it.Id
    INNER JOIN Sri.TarifaImpuesto sti ON i.taxPercentId = sti.idTarifaImpuesto


    IF (ISJSON(@customDetail) = 1 AND LEN(RTRIM(LTRIM(@customDetail))) > 0)
        BEGIN
                
            INSERT INTO @tblItems(uuid, bodegaId, itemTypeId, menuId, itemId, taxId
                                , taxPercentId, feeId, taxValue, quantity, cost
                                , price, discount, total, envioSri, idArticulo, [description], medidaId, cantidadStock, cantidadTransaccion)

            SELECT uuid
                ,bodegaId
                ,0 AS itemTypeId
                ,0 AS menuId
                ,0 AS itemId
                ,taxId
                ,taxPercentId
                ,feeId
                ,taxValue
                ,quantity
                ,cost
                ,price
                ,discount
                ,total
                ,envioSri
                ,productId
                ,[description]
                ,medidaId
                ,0
                ,0
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
                ,medidaId       INT                 '$.medidaId'
            )

        INSERT INTO @FacturaDetalleInsert(idArticulo, idTarifa, idBodega, medidaId, ice, cantidad, precioUnitario, precioSinSubsidio    
            , valorDescuento, porcentajeDescuento, precioTotalSinImpuesto, nota, descripcion, precioCosto, idTipoIva, tarifa        
            , valorImpuesto, uuid, envioSri)

        SELECT i.idArticulo 
            ,i.feeId
            ,i.bodegaId
            ,i.medidaId
            ,0                          AS ice
            ,i.quantity                 AS cantidad
            ,i.price                    AS precioVenta
            ,0                          AS precioSinSubsidio
            ,i.discount                 AS valorDescuento
            ,0                          AS porcentajeDescuento
            ,i.total      
            ,''                         AS nota
            ,i.description
            ,0                         AS precioCosto
            ,(SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS VARCHAR(1)) = sti.codigo) AS idTipoIva
            ,(SELECT TOP 1 porcentaje FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS VARCHAR(1)) = sti.codigo) AS idTipoIva
            ,i.taxValue                AS iva
            ,i.uuid
            ,i.envioSri
        FROM @tblItems i
        INNER JOIN Sri.TarifaImpuesto sti ON sti.idTarifaImpuesto = i.taxPercentId
        INNER JOIN Inventario.v_Articulo a ON a.idArticulo = i.idArticulo 
        WHERE ISNULL(envioSri, 0) = 1                
    END
     
    ---- NOTA DE ENTREGA ----
    IF @codDoc = 'NE'
        BEGIN
             
            INSERT INTO NotaEntrega 
                   (idCliente         ,idPuntoEmision,  nroDocumento,  subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,fechaRegistro,idUsuario,idEntidad,fechaEmision,idTipoDocumento)
            SELECT @customerCompanyId,@puntoEmisionId, @nroDocumento, @subtotalSinImpuestos,@discount,0,0,0,0,@total,@obs,dbo.ufnGetDateEcuador(),@userId,@companyId, @fechaEmision,@tipoDocumentoId
            
            SET @documentoId = (SELECT SCOPE_IDENTITY())

            IF (@documentoId > 0)
                BEGIN
                    INSERT INTO NotaEntregaDetalle(idNotaEntrega,idArticulo,idBodega,idMedida,descripcion,cantidad,precioUnitario
                    ,idTarifa, idTipoIva,valorDescuento, porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota, fechaRegistro, uuid)

                    SELECT @documentoId
                        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 m.ProductId  FROM Restaurant.Menu m WITH (NOLOCK) WHERE m.id = i.MenuId) 
                                                    ELSE (SELECT TOP 1 ii.ProductId FROM Restaurant.Item ii WITH (NOLOCK) WHERE ii.id = i.ItemId)
                        END 
                        ,bodegaId
                        ,i.medidaId
                        ,CASE WHEN it.code = 'MENU' THEN (SELECT TOP 1 a.descripcion FROM Restaurant.Menu m
                                                                                     INNER JOIN Inventario.v_Articulo a ON m.ProductId = a.idArticulo
                                                                                     WHERE m.id = i.MenuId) 

                                                    ELSE (SELECT TOP 1 a.descripcion FROM Restaurant.Item ii 
                                                                                     INNER JOIN Inventario.v_Articulo a ON ii.ProductId = a.idArticulo 
                                                                                     WHERE ii.id = i.ItemId)
                         END 
                        ,i.quantity
                        ,i.price
                        ,i.feeId
                        ,(SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(5)) = sti.codigo) 
                        ,i.discount
                        ,0
                        ,i.total
                        ,(SELECT TOP 1 codigoPorcentaje FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(5)) = sti.codigo) 
                        ,(SELECT TOP 1 porcentaje FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(5)) = sti.codigo) 
                        ,i.taxValue
                        ,i.obs
                        ,dbo.ufnGetDateEcuador()
                        ,i.uuid
                    FROM @tblItems i
                    INNER JOIN Restaurant.ItemType it ON i.itemTypeId = it.Id
                    INNER JOIN Sri.TarifaImpuesto sti ON i.taxPercentId = sti.idTarifaImpuesto

                    INSERT INTO Ventas.NotaEntregaImpuesto(NotaEntregaId,TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, UserId,Discount)                    
                    SELECT @documentoId
                          ,(SELECT TOP 1 iv.idImpuesto FROM TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS varchar(5)) = ti.codigo) 
                          ,(SELECT TOP 1 iv.idTipoIva  FROM TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS varchar(5)) = ti.codigo) 
                          ,(SELECT TOP 1 iv.porcentaje FROM TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS varchar(5)) = ti.codigo) 
                          ,t.taxBase
                          ,t.taxValue
                          ,@userId
                          ,0
                    FROM @tblTaxes t
                    INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto
                END

        END

    --- FACTURA DE VENTA
    IF @codDoc = 'FV'
        BEGIN
            DECLARE @claveAcceso VARCHAR(49)
           
            SET @claveAcceso = (SELECT dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab), '01', @ambiente, 1, dbo.AFTConvertDate(@fechaEmision), @ruc, @estab + @ptoEmi, Helper.F_Auto_Sequential(@nroDocumento)))

            INSERT INTO Factura 
                   (idCliente, idPuntoEmision, idTipoDocumento,ambiente,idEntidad, idUsuario,claveAcceso,nroFactura,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,fechaRegistro)
            SELECT @customerCompanyId,@puntoEmisionId,@tipoDocumentoId,@ambiente,@companyId, @userId, @claveAcceso, @nroDocumento, @fechaEmision, @subtotalSinImpuestos, @discount, 0, @tip,0,0, @total, @obs, dbo.ufnGetdateEcuador()
                                     
            SET @documentoId = (SELECT SCOPE_IDENTITY()) 

            --------------------------- INSERT HERE NOW --------------                        
            INSERT INTO FacturaDetalle
                     (idFactura,idArticulo,idTarifa,idBodega,idMedida,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,nota,descripcion,precioCosto,idTipoIva,codigoPorcentaje,tarifa,valorImpuesto,uuid,envioSri)
            SELECT @documentoId,idArticulo,idTarifa,idBodega,medidaId,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,nota,descripcion,precioCosto,idTipoIva,codigoPorcentaje,tarifa,valorImpuesto,uuid,envioSri
            FROM @FacturaDetalleInsert
                      
            INSERT INTO Ventas.FacturaImpuesto(FacturaId,TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, UserId,Discount)                    
                    SELECT @documentoId 
                        ,(SELECT TOP 1 iv.idImpuesto FROM TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS varchar(5)) = ti.codigo) 
                        ,(SELECT TOP 1 iv.idTipoIva  FROM TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS varchar(5)) = ti.codigo) 
                        ,(SELECT TOP 1 iv.porcentaje FROM TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS varchar(5)) = ti.codigo)
                        , t.taxBase
                        , t.taxValue
                        , @userId
                        , 0
                    FROM @tblTaxes t
                    INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto


            --> Forma de pago
			INSERT INTO dbo.FormaPagoFactura 
                   (idFactura,idFormaPagoSri,idTiempoCredito,abono,idUsuario,fechaRegistro)
            SELECT @documentoId,idFormaPagoSri,@tiempoCreditoId,@total,@userId,dbo.ufnGetDateEcuador() FROM dbo.FormaPagoSri WITH (NOLOCK) WHERE codigo = '20'
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

    
    IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @companyId AND inventory = 'SI')
        BEGIN
            DECLARE @idArticulo         INT
            ,@idBodega                  INT
            ,@medidaId                  INT
            ,@idTarifa                  INT
            ,@cantidad                  NUMERIC(18,2)
            ,@precioUnitario            NUMERIC(18,5)
            ,@precioCosto               NUMERIC(18,5) 
            ,@precioTotalSinImpuesto    NUMERIC(18,5)
            ,@codDocTran                VARCHAR(2)

            DECLARE @tblInventory AS TABLE (
                idArticulo                 INT
                ,idBodega                  INT
                ,medidaId                  INT
                ,idTarifa                  INT
                ,cantidad                  NUMERIC(18,2)
                ,precioUnitario            NUMERIC(18,5)
                ,precioCosto               NUMERIC(18,5) 
                ,precioTotalSinImpuesto    NUMERIC(18,5)
                ,cantidadStock NUMERIC (18,5) NOT NULL
                ,cantidadTransaccion NUMERIC(18,5) NOT NULL
            )

            --INSERT ITEMS
            INSERT INTO @tblInventory(idArticulo, idBodega, medidaId, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto, cantidadStock, cantidadTransaccion)
            SELECT a.idArticulo, bodegaId, i.medidaId, i.feeId, i.quantity, i.price, a.precioCosto, i.total, cantidadStock, cantidadTransaccion
            FROM @tblItems i
            INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
            INNER JOIN Articulo a WITH (NOLOCK) ON ri.idArticulo = a.idArticulo 
            WHERE a.llevaInventario = 1

            --INSERT Menu
            INSERT INTO @tblInventory(idArticulo, idBodega, medidaId, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto, cantidadStock, cantidadTransaccion)
            SELECT a.idArticulo, bodegaId, i.medidaId, i.feeId, i.quantity, i.price, a.precioCosto, i.total,  cantidadStock, cantidadTransaccion
            FROM @tblItems i
                INNER JOIN Restaurant.Menu m ON i.menuId = m.Id
                INNER JOIN Articulo a WITH (NOLOCK) ON m.ProductId = a.idArticulo 
            WHERE a.llevaInventario = 1
            
            --INSERT MENU ITEMS
            INSERT INTO @tblInventory(idArticulo, idBodega, medidaId, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto, cantidadStock, cantidadTransaccion)
            SELECT a.idArticulo, bodegaId, i.medidaId, i.feeId, i.quantity, i.price, a.precioCosto, i.total,  cantidadStock, cantidadTransaccion
            FROM @tblItems i
                INNER JOIN Restaurant.Menu m ON i.menuId = m.Id
                INNER JOIN Restaurant.MenuItem mi ON m.Id = mi.MenuId
                INNER JOIN Restaurant.Item ii ON mi.itemId = ii.Id
                INNER JOIN Articulo a WITH (NOLOCK) ON ii.ProductId = a.idArticulo 
            WHERE a.llevaInventario = 1

            --INSERT INGREDIENTS ITMES
            INSERT INTO @tblInventory(idArticulo, idBodega, medidaId, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto, cantidadStock, cantidadTransaccion)
            SELECT a.idArticulo, bodegaId, i.medidaId, i.feeId, r.quantity * i.quantity, i.price, a.precioCosto, i.total,  cantidadStock, cantidadTransaccion
            FROM @tblItems i
                INNER JOIN Restaurant.Recipe r ON i.itemId = r.ItemId
                INNER JOIN Restaurant.Ingredient ing WITH (NOLOCK) ON r.IngredientId = ing.Id
                INNER JOIN Inventario.v_Articulo a On ing.ProductId = a.idArticulo 
            WHERE a.llevaInventario = 1

             --INSERT MENU ITEMS INGREDIENTS
            INSERT INTO @tblInventory(idArticulo, idBodega, medidaId, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto, cantidadStock, cantidadTransaccion)
            SELECT a.idArticulo, bodegaId, i.medidaId, i.feeId, i.quantity, i.price, a.precioCosto, i.total,  cantidadStock, cantidadTransaccion
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
                    DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = @codDocTran

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

                   INSERT INTO Inventario.Transaccion 
                           (idTipoTransaccion,idArticulo,idBodega,idTipoDocumento,idDocumento,idMedida,idTarifa,cantidad,precioUnitario,precioCosto,total,fechaRegistro,idUsuario)
			        SELECT @idTipoTransaccion,idArticulo,idBodega, @idTipoDocumentoIv,@documentoId,medidaId,idTarifa,cantidadTransaccion,precioUnitario,precioCosto,precioTotalSinImpuesto,@fechaEmision,@userId 
                    FROM @tblInventory

                   EXEC dbo.Transaccion_Handler_Init 'S', @codDocTran, @documentoId, DEFAULT
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