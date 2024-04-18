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
CREATE OR ALTER PROC TechnicalSupport.Order_Document_Insert
@userRoleId                 INT
,@orderId                   INT
,@json                      NVARCHAR(MAX)
,@payload                   NVARCHAR(MAX) OUTPUT
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
    ,@fechaEmision          DATETIME2
    ,@tax                   NUMERIC(18,5)
    ,@taxPercent            NUMERIC(4,2)
    ,@discount              NUMERIC(18,5)
    ,@tip                   NUMERIC(18,5)
    ,@total                 NUMERIC(18,5)
    ,@establecimientoId     INT
    ,@obs                   VARCHAR(500)
    ,@totalDescuento        DECIMAL(18,5)
    ,@porcentajeDescuento   DECIMAL(18,5)
    ,@propina               DECIMAL(18,5)
    ,@recargo               DECIMAL(18,5)
    ,@transporte            DECIMAL(18,5)
    ,@customerId            INT
    ,@subTotalSinImpuesto   NUMERIC(18,5)
    ,@codDoc                VARCHAR(5)
    ,@order                 NVARCHAR(500)
    ,@customDetail          NVARCHAR(MAX)
    ,@idEntidad             INT
    ,@isAutomatic           INT 
    ,@secuencial            INT
        
    DECLARE @tblItems AS TABLE(
        uuid                    UNIQUEIDENTIFIER    NOT NULL,
        orderMantenainceId      INT                 NULL,
        orderDetailId           INT                 NULL,
        taxId                   INT                 NOT NULL,
        taxPercentId            INT                 NOT NULL,
        feeId                   INT                 NOT NULL,
        taxValue                NUMERIC(18,5)       NOT NULL,
        quantity                NUMERIC(18,5)       NOT NULL,
        cost                    NUMERIC(18,5)       NOT NULL,
        price                   NUMERIC(18,5)       NOT NULL,
        discount                NUMERIC(18,5)       NULL,
        total                   NUMERIC(18,5)       NOT NULL,
        obs                     VARCHAR(500)        NULL,
        bodegaId                INT                 NULL,
        envioSri                BIT                 NULL DEFAULT 0,
        idArticulo              INT                 NULL DEFAULT 0,
        [description]           VARCHAR(500)        NULL,
        cantidadStock           NUMERIC(18,5)       NULL,
        cantidadTransaccion     NUMERIC(18,5)       NULL,
        precioCostoFraccionado  NUMERIC(18,5)       NULL,
        medidaId                INT                 NOT NULL,
        conversion              NUMERIC(18,5)       NOT NULL,
        orderIndex              INT                 NOT NULL,
        precioTotalSinImpuesto  NUMERIC(18,5)       NOT NULL
    )

    DECLARE @tblTaxes AS TABLE (
        uuid            UNIQUEIDENTIFIER    NOT NULL,
        taxId           INT                 NOT NULL,
        taxPercentId    INT                 NOT NULL,   
        taxBase         NUMERIC(18,5)       NOT NULL,
        taxValue        NUMERIC(18,5)       NOT NULL
    )

    DECLARE @FacturaDetalleInsert AS TABLE(        
        idArticulo                  INT					NOT NULL
        , idTarifa                  INT					NOT NULL
        , idBodega                  INT					NOT NULL
        , medidaId                  INT					NOT NULL
        , ice                       NUMERIC(18,5)		NULL
        , cantidad                  NUMERIC(18,5)		NULL
        , precioUnitario            NUMERIC(18,5)		NOT NULL
        , precioSinSubsidio         NUMERIC(18,5)		NULL
        , valorDescuento            NUMERIC(18,5)		NOT NULL
        , porcentajeDescuento       NUMERIC(18,5)		NULL
        , precioTotalSinImpuesto    NUMERIC(18,5)		NOT NULL
        , nota                      NVARCHAR(100)		NULL
        , descripcion               NVARCHAR(200)		NULL
        , precioCosto               NUMERIC(18,5)		NOT NULL
        , idTipoIva                 INT					NOT NULL
        , codigoPorcentaje          VARCHAR(5)			NOT NULL
        , tarifa                    NUMERIC(18,5)		NOT NULL
        , valorImpuesto             NUMERIC(18,5)		NOT NULL
        , uuid                      UNIQUEIDENTIFIER	NOT NULL
        , envioSri                  BIT                 NOT NULL
        , cantidadTransaccion       NUMERIC(18,5)       NOT NULL
        , cantidadStock             NUMERIC(18,5)       NOT NULL
        , precioCostoFraccionado    NUMERIC(18,5)       NOT NULL
        , conversion                NUMERIC(18,5)       NOT NULL
        , idMedida                  INT                 NOT NULL
        , orderIndex                INT                 NOT NULL
    )
       
    SELECT @order = orden, @customDetail = detalles FROM OPENJSON(@json) WITH(orden NVARCHAR(MAX) '$.order' AS JSON, detalles NVARCHAR(MAX) '$.detalles' AS JSON)

    SELECT @establecimientoId       = establecimientoId
            , @puntoEmisionId       = puntoEmisionId
            , @customerCompanyId    = customerCompanyId
            , @subTotalSinImpuesto  = ISNULL(subTotalSinImpuesto, 0)
            , @codDoc               = ISNULL(codDoc, '')
            , @tax                  = ISNULL(tax, 0)
            , @discount             = ISNULL(discount, 0)
            , @tip                  = ISNULL(tip, 0)
            , @total                = ISNULL(total, 0)
            , @obs                  = obs
    FROM OPENJSON(@order)
    WITH(
        establecimientoId       INT             '$.establecimientoId'
        , puntoEmisionId        INT             '$.puntoEmisionId'
        , customerCompanyId     INT             '$.customerCompanyId'
        , subTotalSinImpuesto   NUMERIC(18,5)   '$.subTotalSinImpuesto'
        , codDoc                VARCHAR(5)      '$.codDoc'
        , tax                   NUMERIC(18,5)   '$.tax'
        , discount              NUMERIC(18,5)   '$.discount'
        , tip                   NUMERIC(18,5)   '$.tip'
        , total                 NUMERIC(18,5)   '$.total'
        , obs                   VARCHAR(500)    '$.obs'
    )
     
    ----- VARIABLES ----
    SET @fechaEmision = (SELECT dbo.ufnGetDateEcuador())
        
    SELECT TOP 1 @customerId        = ISNULL(CustomerId,0) 
    FROM Cliente WITH (NOLOCK) 
    WHERE idCliente = @customerCompanyId 

    SELECT @companyId               = idEntidad
            , @ruc                  = rucEmpresa 
    FROM v_usuario 
    WHERE idUsuarioRol = @userRoleId

    SELECT TOP 1 @idEntidad         = idEntidad
                , @userId           = idUsuario 
    FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
    
    ---- ================ INSERT ITEMS ================ -----
    IF (ISJSON(@customDetail) = 1 AND LEN(RTRIM(LTRIM(@customDetail))) > 0)
        BEGIN
            INSERT INTO @tblItems
            (uuid, orderMantenainceId, orderDetailId, taxId, taxPercentId, feeId, taxValue,quantity,cost,price,discount
            , total, obs, bodegaId,envioSri,idArticulo,[description],medidaId, cantidadTransaccion, cantidadStock
            , precioCostoFraccionado, conversion, orderIndex, precioTotalSinImpuesto)
            
            SELECT uuid
                , 0             AS orderMantenainceId
                , 0             AS orderDetailId
                , taxId
                , taxPercentId
                , feeId
                , taxValue
                , quantity
                , cost
                , price
                , discount
                , total
                , ''            AS obs
                , bodegaId
                , 0             AS envioSri
                , productId
                , [description]                
                , medidaId
                , cantidadTransaccion
                , ISNULL(cantidadStock, 0)
                , precioCostoFraccionado
                , conversion
                , orderIndex
                , precioTotalSinImpuesto
            FROM OPENJSON(@customDetail)
            WITH (
                uuid                    UNIQUEIDENTIFIER    '$.rowguid',
                bodegaId                INT                 '$.bodegaId',
                taxId                   INT                 '$.taxId',
                taxPercentId            INT                 '$.taxPercentId',
                feeId                   INT                 '$.feeId',
                taxValue                NUMERIC(18,5)       '$.taxValue',
                quantity                NUMERIC(18,5)       '$.quantity',
                cost                    NUMERIC(18,5)       '$.cost',
                price                   NUMERIC(18,5)       '$.price',
                discount                NUMERIC(18,5)       '$.discount',
                total                   NUMERIC(18,5)       '$.total',
                productId               INT                 '$.productId',
                [description]           VARCHAR(500)        '$.descripcion',
                medidaId                INT                 '$.medidaId',
                cantidadTransaccion     NUMERIC(18,5)       '$.cantidadTransaccion',
                cantidadStock           NUMERIC(18,5)       '$.cantidadStock',
                precioCostoFraccionado  NUMERIC(18,5)       '$.costoFraccionado',
                conversion              NUMERIC(18,5)       '$.conversion',
                orderIndex              INT                 '$.orderIndex',
                precioTotalSinImpuesto  NUMERIC(18,5)		'$.precioTotalSinImpuesto'
            )

            INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxBase, taxValue)
            SELECT uuid
                    , taxId
                    , taxPercentId
                    , CAST((quantity * price) AS NUMERIC(18,5)) AS taxBase
                    , taxValue
            FROM OPENJSON(@customDetail)
            WITH (
                uuid                    UNIQUEIDENTIFIER    '$.rowguid',
                taxId                   INT                 '$.taxId',
                taxPercentId            INT                 '$.taxPercentId',
                quantity                NUMERIC(18,5)       '$.quantity',
                taxValue                NUMERIC(18,5)       '$.taxValue',
                price                   NUMERIC(18,5)       '$.price'
            )
            
            ---------- INSERT NEW ---------------
            INSERT INTO @FacturaDetalleInsert(idArticulo, idTarifa, idBodega, medidaId, ice, cantidad, precioUnitario, precioSinSubsidio    
                                            , valorDescuento, porcentajeDescuento, precioTotalSinImpuesto, nota, descripcion, precioCosto
                                            , idTipoIva,codigoPorcentaje,tarifa,valorImpuesto, uuid, envioSri, cantidadTransaccion
                                            , cantidadStock, precioCostoFraccionado, conversion, idMedida, orderIndex)

            SELECT a.idArticulo
                , i.feeId
                , i.bodegaId
                , i.medidaId
                , 0
                , i.quantity
                , i.price
                , 0
                , i.discount
                , 0
                , i.total
                , i.obs
                , a.descripcion
                , a.precioCosto
                , (SELECT TOP 1 idTipoIva FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo) 
                , (SELECT TOP 1 codigoPorcentaje FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo)
                , (SELECT TOP 1 porcentaje FROM TipoIva ti WHERE CAST(ti.codigoPorcentaje AS varchar(1)) = sti.codigo)
                , 0
                , i.uuid
                , 0          AS envioSri
                , i.cantidadTransaccion
                , i.cantidadStock
                , i.precioCostoFraccionado
                , i.conversion
                , i.medidaId
                , i.orderIndex
            FROM @tblItems i
            INNER JOIN Sri.TarifaImpuesto sti               ON i.taxPercentId   = sti.idTarifaImpuesto
            INNER JOIN Inventario.v_Articulo a				ON a.idArticulo		= i.idArticulo
            
            UPDATE TechnicalSupport.[Order]
            SET Finished            = 1
                , OrderStatusId     = (SELECT Id FROM TechnicalSupport.OrderStatus WHERE Code = 'PE')
            WHERE Id = @orderId
        END

    IF NOT EXISTS(SELECT TOP 1 1 FROM @tblItems)
    BEGIN
        SELECT '0' as code, 'No se pudieron recuperar los detalles' as 'message'
        RETURN
    END
      
    -------------------------DOCUMENTOS DE VENTA-------------------------------
    SELECT @nroDocumento     = cd.secuencial
        , @ambiente          = cd.ambiente
        , @autoSriAuth       = cd.autoSriAuth
        , @tipoDocumentoId   = cd.idTipoDocumento
        , @estab             = pa.estab
        , @ptoEmi            = pa.ptoEmi 
    FROM Config.v_ConfigDocumento cd    WITH(NOLOCK)
    INNER JOIN v_PtoEmi_Asign pa        WITH(NOLOCK) ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
    WHERE pa.idUsuarioRol = @userRoleId 
    AND cd.codDoc = @codDoc
                         
    ------ REVISAR Y ANALIZAR ------
    IF (@customerCompanyId = 0)
    BEGIN 
        SELECT TOP 1 @customerCompanyId = idCliente FROM v_Cliente WHERE codIdentSri = '07'
    END

    SET @taxPercent = (SELECT porcentaje FROM Sri.TarifaImpuesto ti WITH (NOLOCK) INNER JOIN TechnicalSupport.[Order] o WITH (NOLOCK) ON ti.idTarifaImpuesto = o.TaxPercentId WHERE o.Id = @orderId)
        
    ---- NOTA DE ENTREGA ----
    IF @codDoc = 'NE'
        BEGIN             
            INSERT INTO NotaEntrega
            (idCliente, idPuntoEmision, nroDocumento, subTotalSinImpuestos, totalDescuento, porcentajeDescuento, propina, recargo, transporte, total, observacion, fechaRegistro, idUsuario, idEntidad, fechaEmision, idTipoDocumento)
            SELECT @customerCompanyId,@puntoEmisionId, @nroDocumento, @subTotalSinImpuesto,@discount,0,0,0,0,@total,@obs,dbo.ufnGetDateEcuador(),@userId,@companyId, @fechaEmision,@tipoDocumentoId
            
            SET @documentoId = (SELECT SCOPE_IDENTITY())

            IF (@documentoId > 0)
                BEGIN
                    INSERT INTO NotaEntregaDetalle
                    (idNotaEntrega,idArticulo,idBodega,idMedida,descripcion,cantidad,precioUnitario
                    ,idTarifa, idTipoIva,valorDescuento, porcentajeDescuento,precioTotalSinImpuesto
                    ,codigoPorcentaje,tarifa,valorImpuesto,nota, fechaRegistro, uuid)

                    SELECT @documentoId
                        ,a.idArticulo
                        ,i.bodegaId
                        ,i.medidaId
                        ,a.descripcion
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
                    INNER JOIN Sri.TarifaImpuesto sti                   ON i.taxPercentId   = sti.idTarifaImpuesto
                    INNER JOIN Inventario.v_Articulo a                  ON a.idArticulo     = i.idArticulo

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
            (idCliente, idPuntoEmision, idTipoDocumento, ambiente, idEntidad, idUsuario, claveAcceso, nroFactura, fechaEmision, subTotalSinImpuestos, totalDescuento, porcentajeDescuento, propina, recargo, transporte, total, observacion, fechaRegistro)
            SELECT @customerCompanyId,@puntoEmisionId,@tipoDocumentoId,@ambiente,@companyId, @userId, @claveAcceso, @nroDocumento, @fechaEmision, @subTotalSinImpuesto, @discount, 0, @tip,0,0, @total, @obs, dbo.ufnGetdateEcuador()
                                     
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
			INSERT INTO dbo.FormaPagoFactura (idFactura,idFormaPagoSri,idTiempoCredito,abono,idUsuario,fechaRegistro)
            SELECT @documentoId
                , idFormaPagoSri
                , @tiempoCreditoId
                , @total
                , @userId
                , dbo.ufnGetDateEcuador() 
            FROM dbo.FormaPagoSri WITH (NOLOCK) 
            WHERE codigo = '20'
            
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
    INSERT INTO TechnicalSupport.OrderDocument(OrderId, DocumentoId, TipoDocumentoId, [Enabled], UserId)
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
                idArticulo                  INT
                ,idBodega                   INT
                ,medidaId                   INT
                ,idTarifa                   INT
                ,cantidad                   NUMERIC(18,2)
                ,precioUnitario             NUMERIC(18,5)
                ,precioCosto                NUMERIC(18,5) 
                ,precioTotalSinImpuesto     NUMERIC(18,5)
                ,cantidadStock              NUMERIC(18,5) NOT NULL
                ,cantidadTransaccion        NUMERIC(18,5) NOT NULL
                ,conversion                 NUMERIC(18,5) NOT NULL
                ,precioCostoFraccionado     NUMERIC(18,5) NOT NULL
            )

            --INSERT ITEMS ----
            INSERT INTO @tblInventory(idArticulo, idBodega, medidaId, idTarifa, cantidad, precioUnitario, precioCosto, precioTotalSinImpuesto, cantidadStock, cantidadTransaccion, conversion, precioCostoFraccionado)
            SELECT a.idArticulo, i.bodegaId, i.medidaId, i.feeId, i.quantity, i.price, a.precioCosto, i.total, cantidadStock, cantidadTransaccion, i.conversion, precioCostoFraccionado
            FROM @tblItems i
            INNER JOIN TechnicalSupport.v_OrderMantenaince ri ON i.orderMantenainceId = ri.Id
            INNER JOIN Articulo a WITH (NOLOCK) ON ri.idArticulo = a.idArticulo 
            WHERE a.llevaInventario = 1
            
            SET @codDocTran = (SELECT IIF(@codDoc = 'FV', 'FE', 'NE'))
            
            SET @serieDocument = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @nroDocumento, DEFAULT))

            IF EXISTS (SELECT 1 FROM @tblInventory)
                BEGIN
                    DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = @codDocTran

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

                    --> Transaccion
                    INSERT INTO Inventario.Transaccion
                            (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                    SELECT @idTipoTransaccion,@fechaEmision,@idTipoDocumentoIv,@documentoId,@customerId,@userId,@companyId,@serieDocument 
                    
                    SET @idTransaccion = SCOPE_IDENTITY()

                    INSERT INTO Inventario.TransaccionDetalle
                          (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total, conversion, precioCostoFraccionado)
			        SELECT @idTransaccion,idArticulo,idBodega,medidaId,idTarifa,cantidadStock,cantidadTransaccion,precioUnitario,precioCosto,precioTotalSinImpuesto, conversion, precioCostoFraccionado
                    FROM @tblInventory

                    EXEC dbo.Transaccion_Handler_Init 'S', @codDocTran, @documentoId, DEFAULT
                END
        END
        --------------------END DOCUMENTOS---------------------
    DECLARE @codDocCuentaCobrar VARCHAR(2)
    SET @codDocCuentaCobrar = (SELECT IIF(@codDoc = 'FV', '01', 'NE'))
   
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