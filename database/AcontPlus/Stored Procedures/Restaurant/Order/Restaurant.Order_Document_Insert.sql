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
    ,@idTipoDocumento       INT   
    ,@tiempoCreditoId       INT = 1
    ,@tipoDocumentoId       INT
    ,@ambiente              INT
    ,@autoSriAuth           BIT
    ,@customerCompanyId     INT
    ,@puntoEmisionId        INT
    ,@userId                INT
    ,@codDoc                VARCHAR(2)
    ,@fechaEmision          DATETIME2
    ,@subtotalSinImpuestos  NUMERIC(18,5)
    ,@tax                   NUMERIC(18,5)
    ,@taxPercent            NUMERIC(4,2)
    ,@discount              NUMERIC(18,5)
    ,@tip                   NUMERIC(18,5)
    ,@total                 NUMERIC(18,5)
    ,@bodegaId              INT
    ,@establecimientoId     INT
    ,@obs                   VARCHAR(500)
    ,@estadoPagoId          INT
    ,@sequence              INT    
    ,@tableId               INT

    DECLARE @tblItems AS TABLE(
        uuid            UNIQUEIDENTIFIER NOT NULL,
        itemId          INT NOT NULL,
        taxId           INT NOT NULL,
        taxPercentId    INT NOT NULL,
        feeId           INT NOT NULL,
        taxValue        NUMERIC (18,5) NOT NULL,
        quantity        NUMERIC (18,5) NOT NULL,
        cost            NUMERIC(18,5) NOT NULL,
        price           NUMERIC(18,5) NOT NULL,
        discount        NUMERIC(18,5),
        total           NUMERIC(18,5) NOT NULL,
        obs             VARCHAR(500)
    )

    DECLARE @tblTaxes AS TABLE (
        uuid            UNIQUEIDENTIFIER NOT NULL,
        taxId           INT NOT NULL,
        taxPercentId    INT NOT NULL,
        taxBase         NUMERIC(18,5) NOT NULL,
        taxValue        NUMERIC(18,5) NOT NULL
    )

    SELECT @establecimientoId   = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId
        ,@bodegaId              = bodegaId
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
        ,@tableId               = tableId           
    FROM OPENJSON(@json)
    WITH(establecimientoId      INT '$.establecimientoId',
        puntoEmisionId          INT '$.puntoEmisionId',
        bodegaId                INT '$.bodegaId',
        tableId                 INT '$.tableId',
        fechaEmision            DATETIME2 '$.fechaEmision',
        customerCompanyId       INT '$.customerCompanyId',
        subtotalSinImpuestos    NUMERIC(18,5) '$.subtotalSinImpuestos',
        tax                     NUMERIC(18,5) '$.tax',
        taxPercent              NUMERIC(4,2) '$.taxPercent',
        discount                NUMERIC(18,5) '$.discount',
        tip                     NUMERIC(18,5) '$.tip',
        total                   NUMERIC(18,5) '$.total',
        obs                     VARCHAR(500) '$.obs',
        codDoc                  VARCHAR(2) '$.codDoc',       
        tableId                 INT '$.tableId'
    )

    --- Insert Items ---
    INSERT INTO @tblItems(uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total)
    SELECT Uuid
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
    FROM Restaurant.OrderItem WHERE OrderId = @orderId


    --- Insert Taxes---
    INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxBase, taxValue)
    SELECT Uuid
        , TaxId
        , TaxPercentId
        , Price
        , TaxValue
    FROM Restaurant.OrderItem WHERE OrderId = @orderId
    
    --- Select ---
    SELECT @companyId = idEntidad
        , @ruc = rucEmpresa
        , @userId =  idUsuario 
    FROM v_usuario 
    WHERE idUsuarioRol = @userRoleId

    SELECT TOP 1 @estadoPagoId = idEstadoPago 
    FROM dbo.EstadoPago WITH(NOLOCK) 
    WHERE codigo = 'PE'

    ---- First ----
    SELECT @sequence    = cd.secuencial
        , @estab        = pa.estab
        , @ptoEmi       = pa.ptoEmi
        , @idTipoDocumento = cd.idTipoDocumento
    FROM Config.v_ConfigDocumento cd
    INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
    WHERE pa.idUsuarioRol = @userRoleId AND cd.codDoc = 'OR'
    
    -------------------------DOCUMENTOS DE VENTA-------------------------------
    SELECT @nroDocumento    = cd.secuencial
        ,@ambiente          = cd.ambiente
        ,@autoSriAuth       = cd.autoSriAuth
        ,@tipoDocumentoId   = cd.idTipoDocumento
    FROM Config.v_ConfigDocumento cd
    INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
    WHERE pa.idUsuarioRol = @userRoleId AND cd.codDoc = @codDoc

    
    IF (@customerCompanyId = 0)
        BEGIN 
            SELECT TOP 1 @customerCompanyId = idCliente FROM v_Cliente WHERE codIdentSri = '07'
        END

    IF @taxPercent IS NULL OR @taxPercent = 0
        BEGIN 
            SET @taxPercent = 0
        END       

    ---- NOTA DE ENTREGA ----
    IF @codDoc = 'NE'
        BEGIN
            INSERT INTO NotaEntrega 
            (idCliente, idPuntoEmision, idTiempoCredito, nroDocumento, subTotalSinImpuestos, propina, iva, total, tarifa
            , observacion, fechaRegistro, idUsuario, idEntidad, fechaEmision, fechaVencimiento, idEstadoPago)
            
            VALUES(@customerCompanyId, @puntoEmisionId, @tiempoCreditoId, @nroDocumento, @subtotalSinImpuestos, @tip, @tax, @total, @taxPercent
            , @obs, dbo.ufnGetDateEcuador(), @userId, @companyId,  @fechaEmision, @fechaEmision, @estadoPagoId)
            
            SET @documentoId = (SELECT SCOPE_IDENTITY())

            IF (@documentoId > 0)
                BEGIN
                    INSERT INTO NotaEntregaDetalle(idNotaEntrega, idArticulo, idBodega, idMedida, descripcion, cantidad, precioVenta
                    , idTarifa, iva, precioConIva, valorDescuento, porcentajeDescuento, total, nota, fechaRegistro, uuid)

                    SELECT @documentoId
                        , a.idArticulo
                        , @bodegaId
                        , a.idMedida
                        , a.descripcion
                        , i.quantity
                        , i.price
                        , i.feeId
                        , i.taxValue
                        , i.total + i.taxValue
                        , i.discount
                        , 0
                        , i.total
                        , i.obs
                        , dbo.ufnGetDateEcuador()
                        , i.uuid
                    FROM @tblItems i
                    INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                    INNER JOIN Inventario.v_Articulo a ON ri.ProductId = a.idArticulo

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

            INSERT INTO Factura (idCliente ,idPuntoEmision ,idEstadoPago ,idTipoDocumento ,idTiempoCredito ,ambiente ,porcentaje
                ,idEntidad ,idUsuario ,claveAcceso,nroFactura,fechaEmision,fechaVencimiento,subTotalSinImpuestos,subTotalIva
                ,subTotalNetoIva,subTotalIvaCero,subTotalNetoIvaCero,subTotalNoObjetoIva,subTotalNetoNoObjetoIva
                ,subTotalExentoIva,subTotalNetoExentoIva,totalDescuento,porcentajeDescuento,totalIce,irbpnr,propina
                ,iva,recargo,transporte,total,observacion,fechaRegistro)
        
            VALUES(@customerCompanyId, @puntoEmisionId, @estadoPagoId, @idTipoDocumento ,@tiempoCreditoId ,@ambiente, @taxPercent
                ,@companyId, @userId, @claveAcceso, @sequence, @fechaEmision, @fechaEmision, 0, 0
                ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ,@tax ,0 ,0 ,@total ,@obs, dbo.ufnGetdateEcuador())
                                     
            SET @documentoId = (SELECT SCOPE_IDENTITY()) 
                        
            INSERT INTO FacturaDetalle(idFactura,idArticulo,idTarifa,idBodega,idMedida,ice,cantidad,precioVenta,precioSinSubsidio
                                       ,precioConIva, valorDescuento,porcentajeDescuento,total,nota,descripcion,precioCosto
                                       ,porcentajeIva,iva)

            SELECT @documentoId
                , a.idArticulo
                , i.feeId
                , @bodegaId
                , a.idMedida
                , 0
                , i.quantity
                , i.cost
                , 0
                , i.taxValue
                , i.discount
                , 0
                , i.total
                , i.obs
                , a.descripcion
                , a.precioCosto
                , 0
                , (porcentaje/100) * total
            FROM @tblItems i
            INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
            INNER JOIN Inventario.v_Articulo a ON ri.ProductId = a.idArticulo


            INSERT INTO dbo.DocumentoElectronico(ambiente,codDoc,idDocumento,idContribuyente,nroDocumento,idPuntoEmision,numEstab
                                                ,ptoEmision,claveAcceso,versionComp,isAutomatic,fechaEmision,codigoAutorizacion
                                                ,idUsuario,idEntidad)

            SELECT @ambiente
                , @codDoc
                , @documentoId
                , @customerCompanyId
                , @sequence
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

            SET @codDocTran = (SELECT IIF(@codDoc = 'FV', 'FE', 'NE'))

            IF EXISTS (SELECT TOP 1 1 FROM @tblItems i
                                      INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                                      INNER JOIN Articulo a WITH (NOLOCK) ON ri.idArticulo = a.idArticulo 
                                      WHERE a.llevaInventario = 1)
                BEGIN 
                    DECLARE cursor_inventory CURSOR LOCAL FOR
                    SELECT a.idArticulo
                        , @bodegaId
                        , a.idMedida
                        , i.feeId
                        , i.quantity
                        , i.price
                        , a.precioCosto
                        , i.total
                    FROM @tblItems i
                    INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                    INNER JOIN Articulo a WITH (NOLOCK) ON ri.idArticulo = a.idArticulo 
                    WHERE a.llevaInventario = 1

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
            IF EXISTS (SELECT 1 FROM Restaurant.Recipe r WITH (NOLOCK)
                                    INNER JOIN @tblItems i On r.ItemId = i.itemId 
                                    INNER JOIN Restaurant.Ingredient ing WITH (NOLOCK) ON r.IngredientId = ing.Id
                                    INNER JOIN Inventario.v_Articulo a On ing.ProductId = a.idArticulo
                                    WHERE a.llevaInventario = 1
                                    )
                BEGIN
                    DECLARE cursor_inventory_ingredient CURSOR LOCAL FOR
                    SELECT a.idArticulo
                        , @bodegaId
                        , a.idMedida
                        , i.feeId
                        , r.quantity * i.quantity
                        , i.price
                        , a.precioCosto
                        , i.total
                    FROM @tblItems i
                        INNER JOIN Restaurant.Recipe r ON i.itemId = r.ItemId
                        INNER JOIN Restaurant.Ingredient ing WITH (NOLOCK) ON r.IngredientId = ing.Id
                        INNER JOIN Inventario.v_Articulo a On ing.ProductId = a.idArticulo 
                    WHERE a.llevaInventario = 1

                    OPEN cursor_inventory_ingredient
                        FETCH NEXT FROM cursor_inventory_ingredient INTO @idArticulo
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
                                FETCH NEXT FROM cursor_inventory_ingredient INTO @idArticulo,@idBodega,@idMedida, @idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto
                            END
                    CLOSE cursor_inventory_ingredient
                    DEALLOCATE cursor_inventory_ingredient
                END
        END

    SET @serieDocument = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @nroDocumento, DEFAULT))

        --------------------END DOCUMENTOS---------------------
    EXEC Contabilidad.CuentaPorCobrar_Insert @codDoc
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
    WHERE codDoc = @codDoc 
    AND idDocumento = @documentoId
    
    SET @payload = (SELECT idDocumento      = @documentoId
                        ,idTipoDocumento    = @idTipoDocumento
                        ,codEstab           = @codEstab
                        ,tiempoCredito      = @tiempoCreditoId
                        ,idCliente          = @customerCompanyId
                        ,codDoc             = @codDoc
                        ,idCuentaPorCobrar  = @idCuentaPorCobrar
                        ,payAutomatic       = @payAutomatic
                        ,printerAutomatic   = @printerAutomatic
                        ,orderId            = @orderId
                   FOR JSON PATH)
                   
    SET @payload = (SELECT @payload)

END

