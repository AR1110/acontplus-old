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

	DECLARE @itemsJson NVARCHAR(MAX)
    ,@taxesJson NVARCHAR(MAX)
    ,@paymentsJson NVARCHAR(MAX)
    ,@establecimientoId INT
    ,@puntoEmisionId INT
    ,@bodegaId INT
    ,@tableId INT
    ,@secuence INT
    ,@serie VARCHAR(18)
    ,@fechaEmision DATETIME2
    ,@customerCompanyId INT
    ,@subtotalSinImpuestos NUMERIC(18,5)
    ,@tax NUMERIC(18,5)
    ,@discount NUMERIC(18,5)
    ,@tip NUMERIC(18,5)
    ,@total NUMERIC(18,5)
    ,@obs VARCHAR(500)
    ,@codDoc VARCHAR(2)
    ,@userId INT
    ,@estadoPagoId INT

    
    SELECT       @itemsJson     = items
        ,@taxesJson             = taxes
        ,@paymentsJson          = payments
        ,@establecimientoId     = establecimientoId
        ,@puntoEmisionId        = puntoEmisionId
        ,@bodegaId              = bodegaId
        ,@tableId               = tableId
        ,@customerCompanyId     = customerCompanyId
        ,@subtotalSinImpuestos  = subtotalSinImpuestos
        ,@tax                   = tax
        ,@discount              = discount
        ,@tip                   = tip
        ,@total                 = total
        ,@obs                   = obs
        ,@codDoc                = codDoc
    FROM OPENJSON(@json)
        WITH(
            items NVARCHAR(MAX) '$.items' AS JSON,
            taxes NVARCHAR(MAX) '$.taxes' AS JSON,
            payments NVARCHAR(MAX) '$.payments' AS JSON,
            establecimientoId INT '$.establecimientoId',
            puntoEmisionId INT '$.puntoEmisionId',
            bodegaId INT '$.bodegaId',
            tableId INT '$.tableId',
            customerCompanyId INT '$.customerCompanyId',
            subtotalSinImpuestos NUMERIC(18,5) '$.subtotalSinImpuestos',
            tax NUMERIC(18,5) '$.tax',
            discount NUMERIC(18,5) '$.discount',
            tip NUMERIC(18,5) '$.tip',
            total NUMERIC(18,5) '$.total',
            obs VARCHAR(500) '$.obs',
            codDoc VARCHAR(2) '$.codDoc'
        )


    IF (ISJSON(@itemsJson) = 1)
        BEGIN
            DECLARE @tblItems AS TABLE(
                uuid UNIQUEIDENTIFIER NOT NULL,
                itemId INT NOT NULL,
                taxId INT NOT NULL,
                taxPercentId INT NOT NULL,
                taxValue INT NOT NULL,
                quantity NUMERIC (18,5) NOT NULL,
                cost NUMERIC(18,5) NOT NULL,
                price NUMERIC(18,5) NOT NULL,
                discount NUMERIC(18,5),
                total NUMERIC(18,5) NOT NULL,
                obs VARCHAR(500)
            )

            INSERT INTO @tblItems(uuid, itemId, taxId, taxPercentId, taxValue, quantity, cost, price, discount, total)
            SELECT uuid, itemId, taxId, taxPercentId, taxValue, quantity, cost, price, discount, total 
            FROM OPENJSON(@itemsJson)
                WITH (
                        uuid UNIQUEIDENTIFIER '$.uuid',
                        itemId INT '$.itemId',
                        taxId INT '$.taxId',
                        taxPercentId INT '$.taxPercentId',
                        taxValue INT'$.taxValue',
                        quantity NUMERIC (18,5) '$.quantity',
                        cost NUMERIC(18,5) '$.cost',
                        price NUMERIC(18,5) '$.price',
                        discount NUMERIC(18,5) '$.discount',
                        total NUMERIC(18,5) '$.total'
                      )
            IF (SELECT COUNT(*) FROM @tblItems) = 0
                BEGIN
                    SELECT Common.SpResponse('0', 'No se pudo recuperar el detalle', NULL)
                    RETURN
                END

        END
    ELSE
        BEGIN
            SELECT Common.SpResponse('0', 'El detalle no es valido', NULL)
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
            INSERT INTO @tblTaxes(uuid, taxId, taxPercentId, taxValue)
            SELECT uuid, taxId, taxPercentId, taxValue FROM OPENJSON(@taxesJson) WITH (
                                                        uuid UNIQUEIDENTIFIER '$.uuid',
                                                        taxId INT '$.taxId',
                                                        taxPercentId INT '$.taxPercentId',
                                                        taxBase NUMERIC(18,5) '$.taxBase',
                                                        taxValue NUMERIC(18,5) '$.taxValue'
                                                     )
              IF (SELECT COUNT(*) FROM @tblTaxes) = 0
                BEGIN
                    SELECT Common.SpResponse('0', 'No se pudo recuperar los impuestos', NULL)
                    RETURN
                END
            
        END
    ELSE
        BEGIN
            SELECT Common.SpResponse('0', 'Los impuestos no son validos', NULL)
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
            SELECT Common.SpResponse('0', 'Los pagos no son validos', NULL)
            RETURN
        END

    DECLARE @companyId INT 
    ,@estab VARCHAR(3)
    ,@ptoEmi VARCHAR(3)

    SELECT @secuence = cd.secuencial, @estab = pa.estab, @ptoEmi = pa.ptoEmi
			FROM v_ConfigDocumento cd
				INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			WHERE pa.idUsuarioRol = @userRoleId
			AND cd.codDoc = 'OR'

    SET @serie = (SELECT Common.ufnGetSerieDocument(@estab, @ptoEmi, @secuence, DEFAULT)) --(SELECT @estab + '-' + @ptoEmi +'-'+ RIGHT('000000000' + CONVERT(VARCHAR, @secuence), 9))
   
    SELECT @companyId = idEntidad , @userId =  idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

    DECLARE @id INT = 0
	BEGIN TRY
		BEGIN TRAN
            INSERT INTO Restaurant.[Order](EstablecimientoId, PuntoEmisionId, TableId, [Sequence], Serie, CustomerCompanyId, Tax, Discount, Total, [Enabled], UserId)
            VALUES(@establecimientoId, @puntoEmisionId, @tableId, @secuence, @serie, @customerCompanyId, @tax, @discount, @total, 1, @userId)
	        SET @id = (SELECT SCOPE_IDENTITY())
            IF (@id > 0)
                BEGIN
                    INSERT INTO Restaurant.OrderItem(OrderId, ItemId, TaxId, TaxPercentId, TaxValue, Quantity, Cost, Price, Discount, Total, [Enabled], UserId)
                    SELECT @id, itemId, taxId, taxPercentId, taxValue, quantity, cost, price, discount, total, 1, @userId FROM @tblItems
                    --falta table id
                    DECLARE @totalCook INT = 0

                    SET @totalCook = (SELECT COUNT(*) FROM Restaurant.Item i INNER JOIN @tblItems ii ON i.Id = ii.ItemId WHERE i.Cooking = 1)

                    IF (@totalCook > 0)
                        BEGIN
                            INSERT INTO Restaurant.[OrderKitchen] (OrderId, [Enabled], Completed, UserId)
                            VALUES(@id, 1, 0, @userId)
                        END

                    DECLARE @documentoId INT
                    ,@nroDocumento INT

                    IF (@codDoc = 'NE')
                        BEGIN
                            SET @nroDocumento = (SELECT cd.secuencial
			                                        FROM v_ConfigDocumento cd
				                                        INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab AND cd.idPuntoEmision = @puntoEmisionId
			                                        WHERE pa.idUsuarioRol = @userRoleId
			                                        AND cd.codDoc = 'NE')
                            INSERT INTO NotaEntrega (idCliente, idPuntoEmision, idTiempoCredito, nroDocumento, subTotalSinImpuestos, propina, iva, total, observacion, fechaRegistro, idUsuario, idEntidad, fechaEmision, fechaVencimiento, idEstadoPago)
                            VALUES(@customerCompanyId, @puntoEmisionId, 1, @nroDocumento, @subtotalSinImpuestos, @tip, @tax, @total, @obs, dbo.ufnGetDateEcuador(), @userId, @companyId,  @fechaEmision, @fechaEmision, @estadoPagoId)
                            SET @documentoId = (SELECT SCOPE_IDENTITY())

                            IF (@documentoId > 0)
                                BEGIN
                                  INSERT INTO NotaEntregaDetalle(idNotaEntrega, idArticulo, idBodega, idMedida, descripcion, cantidad, precioVenta, precioConIva, valorDescuento, porcentajeDescuento, total, nota, fechaRegistro, uuid)
                                  SELECT @documentoId, a.idArticulo, @bodegaId, a.idMedida, a.descripcion, i.quantity, i.price, i.total + i.taxValue, i.discount, 0, i.total, i.obs, dbo.ufnGetDateEcuador(), i.uuid
                                  FROM @tblItems i
                                    INNER JOIN Restaurant.v_Item ri ON i.itemId = ri.Id
                                    INNER JOIN Inventario.v_Articulo a ON ri.ProductId = a.idArticulo

                                    INSERT INTO Ventas.NotaEntregaImpuesto(TaxId, TaxPercentId, [Percent], TaxBase, TaxValue, UserId)
                                    SELECT t.taxId, t.taxPercentId, ti.porcentaje, t.taxBase, t.taxValue, @userId FROM @tblTaxes t 
                                            INNER JOIN Sri.TarifaImpuesto ti ON t.TaxPercentId = ti.idTarifaImpuesto

                                END
                        END
                END
		COMMIT TRAN

        IF (@id > 0)
            SELECT Common.SpResponse('1', 'Exitos al guardar', NULL)
        ELSE
            SELECT Common.SpResponse('0', 'No se pudo guardar la orden', NULL)	
    END TRY
	BEGIN CATCH
		 SELECT Common.SpResponse('0', 'Error al guardar el orden', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Order/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH
END
GO
