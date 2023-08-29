USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
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
    ,@taxesJson NVARCHAR(MAX)
    ,@paymentsJson NVARCHAR(MAX)
    ,@establecimientoId INT
    ,@puntoEmisionId INT
    ,@bodegaId INT
    ,@tableId INT
    ,@sequence INT
    ,@serie VARCHAR(18)
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
    
    SELECT @uuid                = uuid
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
            quickSale BIT '$.quickSale'
        )

    IF NOT EXISTS (SELECT 1 FROM Config.v_ConfigDocumento cd
				        INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			            WHERE pa.idUsuarioRol = @userRoleId
			            AND cd.codDoc = 'OR')
                BEGIN
                    --declare @payload VARCHAR(500) = (select @puntoEmisionId ptoEmi, @userRoleId userRoleId for json path)
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

            INSERT INTO @tblItems(uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total)
            SELECT uuid, itemId, taxId, taxPercentId, feeId, taxValue, quantity, cost, price, discount, total 
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

    IF (ISJSON(@taxesJson) = 1)
        BEGIN
            DECLARE @tblTaxes AS TABLE (
                uuid UNIQUEIDENTIFIER NOT NULL,
                taxId INT NOT NULL,
                taxPercentId INT NOT NULL,
                taxBase NUMERIC(18,5) NOT NULL,
                taxValue NUMERIC(18,5) NOT NULL
            )
            INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxBase, taxValue)
            SELECT uuid, taxId, taxPercentId, taxBase, taxValue FROM OPENJSON(@taxesJson) WITH (
                                                        uuid UNIQUEIDENTIFIER '$.uuid',
                                                        taxId INT '$.taxId',
                                                        taxPercentId INT '$.taxPercentId',
                                                        taxBase NUMERIC(18,5) '$.taxBase',
                                                        taxValue NUMERIC(18,5) '$.taxValue'
                                                     )
              IF (SELECT COUNT(*) FROM @tblTaxes) = 0
                BEGIN
                    SELECT Common.ufnSpResponse('0', 'No se pudo recuperar los impuestos', NULL)
                    RETURN
                END
            
        END
    ELSE
        BEGIN
            SELECT Common.ufnSpResponse('0', 'Los impuestos no son validos', NULL)
            RETURN
        END

    IF (ISJSON(@paymentsJson) = 1)
        BEGIN
            DECLARE @tblPayments AS TABLE(
                formaPagoId INT NOT NULL,
                abono NUMERIC(18,5) NOT NULL,
                total NUMERIC(18,5) NOT NULL
            )

            INSERT INTO @tblPayments(formaPagoId, abono, total)
            SELECT formaPagoId, abono, total FROM OPENJSON(@paymentsJson) WITH (
                                                                                formaPagoId INT '$.formaPagoId',
                                                                                abono NUMERIC(18,5) '$.abono',
                                                                                total NUMERIC(18,5) '$.total'
                                                                                )
            IF EXISTS(SELECT 1 FROM @tblPayments WHERE abono = total)
                BEGIN
                    SELECT TOP 1 @estadoPagoId = idEstadoPago FROM dbo.EstadoPago WITH(NOLOCK) WHERE codigo = 'CBR'
                END
            ELSE
                BEGIN
                    SELECT TOP 1 @estadoPagoId = idEstadoPago FROM dbo.EstadoPago WITH(NOLOCK) WHERE codigo = 'PE'
                END
        END
    ELSE
        BEGIN
            SELECT Common.ufnSpResponse('0', 'Los pagos no son validos', NULL)
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

    SELECT @sequence = cd.secuencial
        , @estab = pa.estab
        , @ptoEmi = pa.ptoEmi
        , @idTipoDocumento = cd.idTipoDocumento
	FROM Config.v_ConfigDocumento cd
		INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab
                                    AND cd.idPuntoEmision = @puntoEmisionId
	WHERE pa.idUsuarioRol = @userRoleId
	    AND cd.codDoc = 'OR'

    SELECT @companyId = idEntidad, @ruc = rucEmpresa, @userId =  idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

	BEGIN TRY
		BEGIN TRAN
            ----------------ORDER------------------
            SET @serie = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @sequence, DEFAULT))   
            INSERT INTO Restaurant.[Order](EstablecimientoId, puntoEmisionId, TableId, [Sequence], Serie, CustomerCompanyId, Tax, Discount, Total, [Enabled], UserId)
            VALUES(@establecimientoId, @puntoEmisionId, @tableId, @sequence, @serie, @customerCompanyId, @tax, @discount, @total, 1, @userId)
	        SET @orderId = (SELECT SCOPE_IDENTITY())

            IF (@orderId > 0)
                BEGIN
                    INSERT INTO Restaurant.OrderItem(OrderId, Uuid, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost, Price, Discount, Total, [Enabled], UserId)
                    SELECT @orderId, uuid, itemId, taxId, taxPercentId, taxValue, quantity, cost, price, discount, total, 1, @userId FROM @tblItems
                    
                    DECLARE @totalCook INT = 0
                    SET @totalCook = (SELECT COUNT(*) FROM Restaurant.Item i INNER JOIN @tblItems ii ON i.Id = ii.ItemId WHERE i.Cooking = 1)

                    IF (@totalCook > 0)
                        INSERT INTO Restaurant.[OrderKitchen] (OrderId, [Enabled], Completed, UserId)
                        VALUES(@orderId, 1, 0, @userId)
                    
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
                 
                    ----------------VENTA RAPIDA------------
                    IF (@quickSale = 1)
                        BEGIN
                             DECLARE @documentoId INT
                            ,@nroDocumento INT
                            ,@serieDocument VARCHAR(18)

                            -------------------------DOCUMENTOS DE VENTA-------------------------------
                            SELECT @nroDocumento = cd.secuencial
                                ,@ambiente = cd.ambiente
                                ,@autoSriAuth = cd.autoSriAuth
                                ,@tipoDocumentoId = cd.idTipoDocumento
                            FROM Config.v_ConfigDocumento cd
				            INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab 
                                                         AND cd.idPuntoEmision = @puntoEmisionId
			                 WHERE pa.idUsuarioRol = @userRoleId
			                    AND cd.codDoc = @codDoc

                            IF (@customerCompanyId = 0) 
                                SELECT TOP 1 @customerCompanyId = idCliente FROM v_Cliente WHERE codIdentSri = '07'

                            IF (@codDoc = 'NE')
                                BEGIN
                                    INSERT INTO NotaEntrega (idCliente, idPuntoEmision, idTiempoCredito, nroDocumento, subTotalSinImpuestos, propina, iva, total, tarifa, observacion, fechaRegistro, idUsuario, idEntidad, fechaEmision, fechaVencimiento, idEstadoPago)
                                    VALUES(@customerCompanyId, @puntoEmisionId, @tiempoCreditoId, @nroDocumento, @subtotalSinImpuestos, @tip, @tax, @total, @taxPercent, @obs, dbo.ufnGetDateEcuador(), @userId, @companyId,  @fechaEmision, @fechaEmision, @estadoPagoId)
                                    SET @documentoId = (SELECT SCOPE_IDENTITY())

                                    IF (@documentoId > 0)
                                        BEGIN
                                          INSERT INTO NotaEntregaDetalle(idNotaEntrega, idArticulo, idBodega, idMedida, descripcion, cantidad, precioVenta, idTarifa, iva, precioConIva, valorDescuento, porcentajeDescuento, total, nota, fechaRegistro, uuid)
                                          SELECT @documentoId, a.idArticulo, @bodegaId, a.idMedida, a.descripcion, i.quantity, i.price, i.feeId, i.taxValue, i.total + i.taxValue, i.discount, 0, i.total, i.obs, dbo.ufnGetDateEcuador(), i.uuid
                                          FROM @tblItems i
                                            INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                                            INNER JOIN Inventario.v_Articulo a ON ri.ProductId = a.idArticulo

                                            INSERT INTO Ventas.NotaEntregaImpuesto(TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, Uuid, UserId)
                                            SELECT t.taxId, t.taxPercentId, ti.porcentaje, t.taxBase, t.taxValue, t.uuid, @userId
                                            FROM @tblTaxes t 
                                                    INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto

                                            UPDATE ne SET ne.NotaEntregaDetalleId = i.idNotaEntregaDetalle
                                            FROM Ventas.NotaEntregaImpuesto ne 
                                            JOIN (
                                                SELECT ii.uuid, nd.idNotaEntregaDetalle FROM @tblItems ii 
                                                    INNER JOIN NotaEntregaDetalle nd ON ii.uuid = nd.uuid
                                            ) AS i ON ne.Uuid = i.uuid
                                        END
                                END

                            IF (@codDoc = 'FV')
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

			                        --detalle 
                                    --falta id tipo iva
			                        INSERT INTO FacturaDetalle (idFactura,idArticulo,idTarifa,idBodega,idMedida,ice,cantidad,precioVenta,precioSinSubsidio
				                        ,precioConIva,valorDescuento,porcentajeDescuento,total,nota,descripcion,precioCosto,porcentajeIva,iva)
			                        SELECT @documentoId, a.idArticulo, i.feeId, @bodegaId, a.idMedida, 0, i.quantity, i.cost,0
			                        ,i.taxValue, i.discount, 0, i.total, i.obs, a.descripcion, a.precioCosto, 0, (porcentaje/100) * total
			                        FROM @tblItems i
                                        INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                                        INNER JOIN Inventario.v_Articulo a ON ri.ProductId = a.idArticulo


                                    INSERT INTO dbo.DocumentoElectronico (ambiente,codDoc,idDocumento,idContribuyente,nroDocumento,idPuntoEmision,numEstab,ptoEmision,claveAcceso
										 ,versionComp,isAutomatic,fechaEmision,codigoAutorizacion,idUsuario,idEntidad)

									SELECT @ambiente,@codDoc,@documentoId, @customerCompanyId,@sequence,@puntoEmisionId,@estab,@ptoEmi,@claveAcceso
									    ,'1.1.0',@autoSriAuth,@fechaEmision,@claveAcceso,@userId,@companyId
                                END

                            INSERT INTO Restaurant.OrderDocument(OrderId, DocumentoId, TipoDocumentoId, [Enabled], UserId)
                            VALUES(@orderId, @documentoId, @tipoDocumentoId, 1, @userId)

                             UPDATE cf SET cf.ultimaSecuencia = vcf.secuencial + 1
                             FROM ConfiguracionDocumento cf WITH (ROWLOCK)
                                JOIN (
                                        SELECT cd.idConfiguracionDocumento, cd.secuencial
			                                FROM Config.v_ConfigDocumento cd
				                                INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab 
                                                                            AND cd.idPuntoEmision = @puntoEmisionId
			                                WHERE pa.idUsuarioRol = @userRoleId
			                                    AND cd.codDoc = @codDoc
                                ) AS vcf ON cf.idConfiguracionDocumento = vcf.idConfiguracionDocumento


                            ----------INVENTARIO
                            DECLARE @inventory BIT 

                            SET @inventory = (SELECT inventario FROM Config.v_Sistema WHERE idEntidad = @companyId AND codConfig = 'CI')

                            IF (@inventory = 1)
                                BEGIN
                                   DECLARE @idArticulo INT
	                               ,@idBodega INT
	                               ,@idMedida INT
	                               ,@idTarifa INT
	                               ,@cantidad NUMERIC(18,2)
	                               ,@precioUnitario NUMERIC(18,5)
	                               ,@precioCosto NUMERIC(18,5) 
	                               ,@precioTotalSinImpuesto NUMERIC(18,5)
                                   ,@codDocTran VARCHAR(2)

                                   SET @codDocTran = (SELECT IIF(@codDoc = 'FV', 'FE', 'NE'))

                                   IF EXISTS (SELECT 1 FROM @tblItems i 
                                         INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                                         INNER JOIN Articulo a WITH (NOLOCK) ON ri.idArticulo = a.idArticulo WHERE a.llevaInventario = 1)
						                BEGIN 
							                DECLARE cursor_inventory CURSOR LOCAL FOR
							                SELECT a.idArticulo, @bodegaId, a.idMedida, i.feeId, i.quantity
                                            ,i.price, a.precioCosto, i.total
							                FROM @tblItems i
                                            INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
							                INNER JOIN Articulo a WITH (NOLOCK) ON ri.idArticulo = a.idArticulo 
							                WHERE a.llevaInventario = 1

							                OPEN cursor_inventory
								                FETCH NEXT FROM cursor_inventory INTO @idArticulo, @idBodega, @idMedida, @idTarifa ,@cantidad
                                                ,@precioUnitario, @precioCosto, @precioTotalSinImpuesto
								                WHILE @@FETCH_STATUS = 0
									                BEGIN
										                EXEC Inventario.Transaccion_Insert 'S', @codDocTran, @fechaEmision, @documentoId,  @idArticulo, @idBodega ,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto, @userId
										                FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida, @idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto
									                END
							                CLOSE cursor_inventory
							                DEALLOCATE cursor_inventory  
						                END
                                END
                            
                            ---INVENTARIOS

                            SET @serieDocument = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @nroDocumento, DEFAULT))

                            --------------------END DOCUMENTOS---------------------

                            EXEC Contabilidad.CuentaPorCobrar_Insert @codDoc, @documentoId, @puntoEmisionId, 1, @customerCompanyId, @nroDocumento, @serieDocument, @fechaEmision, @fechaEmision, @total, @companyId, @userId

                            --------------------PAYLOADS------------------
                            DECLARE @payload NVARCHAR(MAX)
                            ,@payAutomatic BIT
                            ,@printerAutomatic BIT
                            ,@idCuentaPorCobrar INT
                           
                            ,@codEstab VARCHAR(15)

                            SET @codEstab = (SELECT codEstab FROM Sri.Establecimiento WHERE idEstablecimiento = @establecimientoId)

						    SELECT TOP 1 @payAutomatic = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.payAutomatic'),
                            @printerAutomatic = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.printerAutomatic') 
                            FROM Config.Sistema WITH (NOLOCK) 
                            WHERE idEntidad = @companyId 
                                AND codConfig = 'CV' 
				
				            SELECT TOP 1 @idCuentaPorCobrar = idCuentaPorCobrar
                            FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK)
                            WHERE codDoc = @codDoc
                                AND idDocumento = @documentoId

				            SET @payload = (SELECT
					               idDocumento             = @documentoId
			                      ,idTipoDocumento         = @idTipoDocumento
					              ,codEstab                = @codEstab
					              ,tiempoCredito           = @tiempoCreditoId
					              ,idCliente               = @customerCompanyId
					              ,codDoc                  = @codDoc
					              ,idCuentaPorCobrar       = @idCuentaPorCobrar
					              ,payAutomatic            = @payAutomatic
					              ,printerAutomatic        = @printerAutomatic
					            FOR JSON PATH)
                            --------END PAYLOADS--------
                    END
                    ----------------END VENTA RAPIDA--------
                END
            -----------------END ORDER -----------------
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
