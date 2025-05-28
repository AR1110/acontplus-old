USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu 
-- Create date: 2023-08-30
-- Description:	sp for update order support
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
    ,@tiempoCreditoId       INT
    ,@tipoDocumentoId       INT
    ,@ambiente              INT
    ,@autoSriAuth           BIT
    ,@customerCompanyId     INT
    ,@puntoEmisionId        INT
    ,@userId                INT
    ,@fechaEmision          DATETIME2
    ,@tax                   NUMERIC(18,5)
    ,@discount              NUMERIC(18,5)
    ,@tip                   NUMERIC(18,5)
    ,@total                 NUMERIC(18,5)
    ,@establecimientoId     INT
    ,@obs                   VARCHAR(500)
    ,@customerId            INT
    ,@subTotalSinImpuesto   NUMERIC(18,5)
    ,@codDoc                VARCHAR(5)
    ,@order                 NVARCHAR(500)
    ,@details               NVARCHAR(MAX)
    ,@fechaRegistro         DATETIME
    ,@claveAcceso           VARCHAR(49)
    ,@uniqueId              VARCHAR(150)
    ,@secuencial            INT
    ,@idTipoDocumento       INT
    ,@idEstadoPago          INT
    ,@idCuentaPorCobrar     INT
      
    --- ====== Temp tables ======== ----
    DECLARE @tblItems AS TABLE(
        uuid                    UNIQUEIDENTIFIER    NOT NULL,
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
        envioSri                BIT                 NULL DEFAULT 1,
        idArticulo              INT                 NULL DEFAULT 0,
        [description]           VARCHAR(500)        NULL,
        cantidadTransaccion     NUMERIC(18,5)       NULL,
        costoFraccionado        NUMERIC(18,5)       NULL,
        medidaId                INT                 NOT NULL,
        conversion              NUMERIC(18,5)       NOT NULL,
        orderIndex              INT                 NOT NULL,
        precioTotalSinImpuesto  NUMERIC(18,5)       NOT NULL,
        percentageDiscount      NUMERIC(18,5)       NOT NULL,
        llevaInventario         BIT                 NOT NULL,
        idTipoIva               INT                 NOT NULL,
        codigoPorcentaje        INT                 NOT NULL,
        porcentaje              NUMERIC(18,5)       NOT NULL
    )

    DECLARE @tblTaxes AS TABLE (
        uuid            UNIQUEIDENTIFIER    NOT NULL,
        taxId           INT                 NOT NULL,
        taxPercentId    INT                 NOT NULL,   
        taxBase         NUMERIC(18,5)       NOT NULL,
        taxValue        NUMERIC(18,5)       NOT NULL,
        discount         NUMERIC(18,5)      NOT NULL
    )

    DECLARE @facturaDetailInsert AS TABLE(        
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
        , costoFraccionado          NUMERIC(18,5)       NOT NULL
        , conversion                NUMERIC(18,5)       NOT NULL
        , idMedida                  INT                 NOT NULL
        , orderIndex                INT                 NOT NULL
    )
      
    --- ===== PARSING DATA FROM FRONT-END ======= ---
    SELECT @order               = orden
            , @details          = detalles 
    FROM OPENJSON(@json)
    WITH(
        orden           NVARCHAR(MAX) '$.order'             AS JSON
        ,detalles       NVARCHAR(MAX) '$.detalles'          AS JSON
    )

    SELECT @establecimientoId       = establecimientoId
            , @puntoEmisionId       = puntoEmisionId
            , @customerCompanyId    = customerCompanyId
            , @subTotalSinImpuesto  = ISNULL(subTotalSinImpuesto, 0)
            , @codDoc               = ISNULL(codDoc, '')
            , @tax                  = ISNULL(tax, 0)
            , @discount             = ISNULL(discount, 0)
            , @tip                  = ISNULL(tip, 0)
            , @total                = ISNULL(total, 0)
            , @fechaEmision         = fechaEmision
            , @obs                  = obs
    FROM OPENJSON(@order)
    WITH(
        establecimientoId       INT
        , puntoEmisionId        INT
        , customerCompanyId     INT
        , subTotalSinImpuesto   NUMERIC(18,5)
        , codDoc                VARCHAR(5)
        , tax                   NUMERIC(18,5)
        , discount              NUMERIC(18,5)
        , tip                   NUMERIC(18,5)
        , total                 NUMERIC(18,5)
        , fechaEmision          DATETIME2
        , obs                   VARCHAR(500)
    )
     
    -- ========== VARIABLES ========== --
    SET @fechaRegistro  = (SELECT dbo.ufnGetDateEcuador())

    SELECT TOP 1 @customerId = ISNULL(CustomerId,0) FROM Cliente WITH(NOLOCK) WHERE idCliente = @customerCompanyId 

    SELECT @companyId   = idEntidad
            , @ruc      = rucEmpresa
            , @userId   = idUsuario 
    FROM v_usuario 
    WHERE idUsuarioRol = @userRoleId

    SELECT TOP 1 @tiempoCreditoId = idTiempoCredito FROM dbo.TiempoCredito WITH(NOLOCK) WHERE idEntidad = @companyId AND gestion = 1 AND estado  = 1 AND diasCredito = 0

    SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE codigoSri = '01'

    SELECT TOP 1 @secuencial = ultimaSecuencia FROM Config.v_ConfigDocumento WITH (NOLOCK) WHERE idPuntoEmision = @puntoEmisionId AND idTipoDocumento = @idTipoDocumento

    SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'
              
    ---- ================ INSERT ITEMS ================ -----
    IF (ISJSON(@details) = 1 AND LEN(RTRIM(LTRIM(@details))) > 0)
        BEGIN
            INSERT INTO @tblItems
            (uuid, taxId, taxPercentId, feeId, taxValue,quantity,cost,price,discount
            , total, obs, bodegaId,envioSri,idArticulo,[description],medidaId, cantidadTransaccion
            , costoFraccionado, conversion, orderIndex, precioTotalSinImpuesto, percentageDiscount
            , llevaInventario, idTipoIva, codigoPorcentaje, porcentaje)
            
            SELECT d.uuid
                , d.taxId
                , d.taxPercentId
                , d.feeId
                , d.taxValue
                , d.quantity
                , d.cost
                , d.price
                , d.discount
                , d.total
                , ISNULL(d.obs, NULL) AS obs
                , d.bodegaId
                , d.envioSri
                , d.productId
                , d.[description]                
                , d.medidaId
                , d.cantidadTransaccion
                , d.costoFraccionado
                , d.conversion
                , d.orderIndex
                , d.precioTotalSinImpuesto
                , d.percentageDiscount
                , ISNULL(a.llevaInventario, 0) AS llevaInventario
                , (SELECT TOP 1 idTipoIva           FROM dbo.TipoIva ti WITH(NOLOCK) WHERE CAST(ti.codigoPorcentaje AS VARCHAR(1)) = sti.codigo) AS idTipoIva
                , (SELECT TOP 1 codigoPorcentaje    FROM dbo.TipoIva ti WITH(NOLOCK) WHERE CAST(ti.codigoPorcentaje AS VARCHAR(1)) = sti.codigo) AS codigoPorcentaje
                , (SELECT TOP 1 porcentaje          FROM dbo.TipoIva ti WITH(NOLOCK) WHERE CAST(ti.codigoPorcentaje AS VARCHAR(1)) = sti.codigo) AS porcentaje
            FROM OPENJSON(@details)
            WITH (
                uuid                    UNIQUEIDENTIFIER    '$.rowguid',
                bodegaId                INT, 
                taxId                   INT,
                taxPercentId            INT,
                feeId                   INT,
                taxValue                NUMERIC(18,5),
                quantity                NUMERIC(18,5),
                cost                    NUMERIC(18,5),
                price                   NUMERIC(18,5),
                discount                NUMERIC(18,5),
                total                   NUMERIC(18,5),
                obs                     VARCHAR(500),
                envioSri                BIT,
                productId               INT,
                [description]           VARCHAR(500)        '$.descripcion',
                medidaId                INT,
                cantidadTransaccion     NUMERIC(18,5),
                costoFraccionado        NUMERIC(18,5),
                conversion              NUMERIC(18,5),
                orderIndex              INT,
                precioTotalSinImpuesto  NUMERIC(18,5),
                percentageDiscount      NUMERIC(18,5)
            ) AS d
            INNER JOIN Inventario.v_Articulo    AS a    ON a.idArticulo         = d.productId
            INNER JOIN Sri.TarifaImpuesto       AS sti  ON sti.idTarifaImpuesto = d.taxPercentId
                                    
            -- ============= INSERT FACTURA =============--
            INSERT INTO @facturaDetailInsert(idArticulo, idTarifa, idBodega, medidaId, ice, cantidad, precioUnitario, precioSinSubsidio    
                                            , valorDescuento, porcentajeDescuento, precioTotalSinImpuesto, nota, descripcion, precioCosto
                                            , idTipoIva,codigoPorcentaje,tarifa,valorImpuesto, uuid, envioSri, cantidadTransaccion
                                            , costoFraccionado, conversion, idMedida, orderIndex)
            SELECT i.idArticulo
                , i.feeId
                , i.bodegaId
                , i.medidaId
                , 0             AS ice
                , i.quantity
                , i.price
                , 0             AS precioSinSubsidio
                , i.discount
                , percentageDiscount
                , i.total
                , i.obs
                , i.[description]
                , i.cost
                , i.idTipoIva
                , CAST(i.codigoPorcentaje AS VARCHAR)
                , i.porcentaje
                , i.taxValue
                , i.uuid
                , i.envioSri
                , i.cantidadTransaccion
                , i.costoFraccionado
                , i.conversion
                , i.medidaId
                , i.orderIndex
            FROM @tblItems i
            
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

    -- ======= INSERT TAXES ======== --
    INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxBase, taxValue, discount)
    SELECT uuid
            , taxId
            , taxPercentId
            , CAST((quantity * price) AS NUMERIC(18,5)) AS taxBase
            , taxValue
            , discount
    FROM OPENJSON(@details)
    WITH (
        uuid                    UNIQUEIDENTIFIER    '$.rowguid',
        taxId                   INT,
        taxPercentId            INT,
        quantity                NUMERIC(18,5),
        taxValue                NUMERIC(18,5),
        price                   NUMERIC(18,5),
        discount                NUMERIC(18,5),
        envioSri                BIT
    )
    WHERE ISNULL(envioSri, 0) = 1

    -- ================ DOCUMENTOS DE VENTA ================---
    SELECT @nroDocumento     = cd.secuencial
        , @ambiente          = cd.ambiente
        , @autoSriAuth       = cd.autoSriAuth
        , @tipoDocumentoId   = cd.idTipoDocumento
        , @estab             = pa.estab
        , @ptoEmi            = pa.ptoEmi 
    FROM Config.v_ConfigDocumento cd    WITH(NOLOCK)
    INNER JOIN v_PtoEmi_Asign pa        WITH(NOLOCK) ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
    WHERE pa.idUsuarioRol   = @userRoleId 
    AND cd.codDoc           = @codDoc

    ---- NOTA DE ENTREGA ----
    IF @codDoc = 'NE'
        BEGIN             
            INSERT INTO NotaEntrega
            (idCliente, idPuntoEmision, nroDocumento, subTotalSinImpuestos, totalDescuento, porcentajeDescuento, propina, recargo, transporte, total, observacion, fechaRegistro, idUsuario, idEntidad, fechaEmision, idTipoDocumento)
            SELECT @customerCompanyId,@puntoEmisionId, @nroDocumento, @subTotalSinImpuesto,@discount,0,0,0,0,@total,@obs,@fechaRegistro,@userId,@companyId, @fechaEmision,@tipoDocumentoId
            
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
                        ,i.idTipoIva
                        ,i.discount
                        ,i.percentageDiscount
                        ,i.total
                        ,i.codigoPorcentaje
                        ,i.porcentaje
                        ,i.taxValue
                        ,i.obs
                        ,@fechaRegistro
                        ,i.uuid
                    FROM @tblItems i
                    INNER JOIN Inventario.v_Articulo a                  ON a.idArticulo     = i.idArticulo

                    INSERT INTO Ventas.NotaEntregaImpuesto(NotaEntregaId,TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, UserId, Discount)                    
                    SELECT @documentoId
                            ,(SELECT TOP 1 iv.idImpuesto FROM dbo.TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS VARCHAR(5)) = ti.codigo) 
                            ,(SELECT TOP 1 iv.idTipoIva  FROM dbo.TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS VARCHAR(5)) = ti.codigo) 
                            ,(SELECT TOP 1 iv.porcentaje FROM dbo.TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS VARCHAR(5)) = ti.codigo) 
                            ,t.taxBase
                            ,t.taxValue
                            ,@userId
                            ,discount
                    FROM @tblTaxes t
                    INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto
                END
        END

    --- FACTURA DE VENTA
    IF @codDoc = 'FV'
        BEGIN          
            SET @claveAcceso = (SELECT dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab), '01', @ambiente, 1, dbo.AFTConvertDate(@fechaEmision), @ruc, @estab + @ptoEmi, Helper.F_Auto_Sequential(@nroDocumento)))

            DECLARE @idEstadoServicio INT ,@idDocumentoElectronico INT
            
            SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

             INSERT INTO dbo.DocumentoElectronico(idTipoDocumento,CustomerId,nroDocumento,idPuntoEmision
                                                ,claveAcceso,versionComp,isAutomatic,fechaEmision
                                                ,idUsuario,idEstadoServicio,serieComprobante)

            SELECT @tipoDocumentoId
                , @customerId
                , @nroDocumento
                , @puntoEmisionId
                , @claveAcceso
                , '1.1.0'
                , @autoSriAuth
                , @fechaEmision
                , @userId
                , @idEstadoServicio
                , @serieDocument

            SET @idDocumentoElectronico = SCOPE_IDENTITY()

            INSERT INTO Factura 
                   (idDocumentoElectronico,idCliente, idUsuario, subTotalSinImpuestos, totalDescuento, porcentajeDescuento, propina, recargo, transporte, total, observacion, fechaRegistro)
            SELECT @idDocumentoElectronico,@customerCompanyId, @userId, @subTotalSinImpuesto, @discount, 0, @tip,0,0, @total, @obs, @fechaRegistro
                                     
            SET @documentoId = (SELECT SCOPE_IDENTITY())

            --------------------------- INSERT HERE NOW --------------                        
            INSERT INTO FacturaDetalle
            (idFactura,idArticulo,idTarifa,idBodega,idMedida,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,nota,descripcion,precioCosto,idTipoIva,codigoPorcentaje,tarifa,valorImpuesto,uuid,envioSri)
            
            SELECT @documentoId,idArticulo,idTarifa,idBodega,medidaId,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,nota,descripcion,precioCosto,idTipoIva,codigoPorcentaje,tarifa,valorImpuesto,uuid,envioSri
            FROM @facturaDetailInsert
               
            INSERT INTO Ventas.FacturaImpuesto(FacturaId,TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, UserId,Discount)                    
            SELECT @documentoId
            , (SELECT TOP 1 iv.idImpuesto FROM dbo.TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS VARCHAR(1)) = ti.codigo) 
            , (SELECT TOP 1 iv.idTipoIva  FROM dbo.TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS VARCHAR(1)) = ti.codigo) 
            , (SELECT TOP 1 iv.porcentaje FROM dbo.TipoIva iv WITH (NOLOCK) WHERE CAST(iv.codigoPorcentaje AS VARCHAR(1)) = ti.codigo)
            , t.taxBase
            , t.taxValue
            , @userId
            , t.discount
            FROM @tblTaxes t
            INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto
            
            --> Forma de pago
			INSERT INTO dbo.FormaPagoFactura (idFactura,idFormaPagoSri,idTiempoCredito,abono,idUsuario,fechaRegistro)
            SELECT @documentoId
                , idFormaPagoSri
                , @tiempoCreditoId
                , @total
                , @userId
                , @fechaRegistro 
            FROM dbo.FormaPagoSri WITH (NOLOCK) 
            WHERE codigo = '20'
            
           
        END

    ---- INSERT OrderDocument -----
    INSERT INTO TechnicalSupport.OrderDocument(OrderId, DocumentoId, TipoDocumentoId, [IsActive], UserId)
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
      
    ---- =============== INSERT INVENTARIO ============= --
    IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @companyId AND inventory = 'SI')
        BEGIN
            DECLARE @codDocTran                VARCHAR(2)

            SET @codDocTran = (SELECT IIF(@codDoc = 'FV', 'FE', 'NE'))            
            SET @serieDocument = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @nroDocumento, DEFAULT))

            IF EXISTS (SELECT 1 FROM @tblItems)
                BEGIN
                    DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion     INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento 
                    FROM Inventario.TipoDocumento WITH (NOLOCK) 
                    WHERE codigo = @codDocTran

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion 
                    FROM Inventario.TipoTransaccion WITH (NOLOCK) 
                    WHERE codigo = 'S'

                    --> Bienes
                    IF EXISTS (SELECT 1 FROM @tblItems WHERE llevaInventario = 1)
                        BEGIN
                            INSERT INTO Inventario.Transaccion WITH (ROWLOCK)
                            (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                            SELECT @idTipoTransaccion,@fechaEmision,@idTipoDocumentoIv,@documentoId,@customerId,@userId,@companyId,@serieDocument 
                    
                            SET @idTransaccion = SCOPE_IDENTITY()

                            INSERT INTO Inventario.TransaccionDetalle
                                  (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total, conversion, precioCostoFraccionado)
			                SELECT @idTransaccion, i.idArticulo, i.bodegaId, i.medidaId, i.feeId, i.quantity, i.cantidadTransaccion, i.price, i.cost, i.precioTotalSinImpuesto, i.conversion, i.costoFraccionado
                            FROM @tblItems i
                            WHERE i.llevaInventario = 1
                            ORDER BY i.orderIndex ASC

                            EXEC dbo.Transaccion_Handler_Init 'S', @codDocTran, @documentoId, DEFAULT
                        END

                    ---> Servicios
                    IF EXISTS (SELECT 1 FROM @tblItems WHERE llevaInventario = 0)
						BEGIN
                            INSERT INTO [Contabilidad].[Servicio] WITH (ROWLOCK)
                                        (TipoDocumentoId, PuntoEmisionId, ClienteId, UsuarioId,ArticuloId,TarifaId,MedidaId,TipoIvaId,BodegaId,DocumentoId,Secuencial,FechaEmision,Descripcion,Nota,Cantidad,PrecioUnitario,PrecioCosto,PrecioTotalSinImpuesto)
					        SELECT @idTipoDocumentoIv
                                , @puntoEmisionId
                                , @customerCompanyId
                                , @userId
                                , idArticulo
                                , i.feeId
                                , i.medidaId
                                , i.idTipoIva
                                , i.bodegaId
                                , @documentoId
                                , @secuencial
                                , @fechaEmision
                                , i.[description]
                                , i.obs
                                , i.cantidadTransaccion
                                , i.price
                                , i.cost
                                , i.precioTotalSinImpuesto
                            FROM @tblItems i 
                            WHERE i.llevaInventario = 0
                            ORDER BY i.orderIndex ASC
                        END                     
                END
        END    
    
    -- =============== INSERT CUENTA X COBRAR ============ ----
    DECLARE @codDocCuentaCobrar VARCHAR(2)
    SET @codDocCuentaCobrar = (SELECT IIF(@codDoc = 'FV', '01', 'NE'))
    
    EXEC Contabilidad.CuentaPorCobrar_Insert @codDocCuentaCobrar
                                            , @documentoId
                                            , @puntoEmisionId
                                            , @tiempoCreditoId
                                            , @customerCompanyId
                                            , @nroDocumento
                                            , @serieDocument
                                            , @fechaEmision
                                            , @fechaEmision
                                            , @total
                                            , @companyId
                                            , @userId
       
    DECLARE @payAutomatic BIT
    ,@printerAutomatic BIT
    ,@codEstab VARCHAR(15)

    SET @codEstab = (SELECT codEstab FROM Sri.Establecimiento WHERE idEstablecimiento = @establecimientoId)

    SELECT TOP 1 @payAutomatic   = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.payAutomatic'), @printerAutomatic  = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.printerAutomatic') 
    FROM Config.Sistema WITH (NOLOCK) 
    WHERE idEntidad = @companyId
    AND codConfig = 'CV'

    SELECT TOP 1 @idCuentaPorCobrar = idCuentaPorCobrar  FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = @codDocCuentaCobrar AND idDocumento = @documentoId
        
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