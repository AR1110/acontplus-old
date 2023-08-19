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
    ,@jsonPayments NVARCHAR(MAX)
    ,@establecimientoId INT
    ,@puntoEmisionId INT
    ,@tableId INT
    ,@secuence INT
    ,@serie VARCHAR(18)
    ,@customerCompanyId INT
    ,@tax NUMERIC(18,5)
    ,@discount NUMERIC(18,5)
    ,@total NUMERIC(18,5)
    ,@userId INT

    
    SELECT       @itemsJson = items
        ,@jsonPayments      = payments
        ,@establecimientoId = establecimientoId
        ,@puntoEmisionId    = puntoEmisionId 
        ,@tableId           = tableId
        ,@customerCompanyId = customerCompanyId
        ,@tax               = tax
        ,@discount          = discount
        ,@total             = total
    FROM OPENJSON(@json)
        WITH(
            items NVARCHAR(MAX) '$.items' AS JSON,
            payments NVARCHAR(MAX) '$.payments' AS JSON,
            establecimientoId INT '$.establecimientoId',
            puntoEmisionId INT '$.puntoEmisionId',
            tableId INT '$.tableId',
            customerCompanyId INT '$.customerCompanyId',
            tax NUMERIC(18,5) '$.tax',
            discount NUMERIC(18,5) '$.discount',
            total NUMERIC(18,5) '$.total'
        )


    IF (ISJSON(@itemsJson) = 1)
        BEGIN
            DECLARE @tblItems AS TABLE(
                itemId INT NOT NULL,
                taxId INT NOT NULL,
                taxPercentId INT NOT NULL,
                taxValue INT NOT NULL,
                quantity NUMERIC (18,5) NOT NULL,
                cost NUMERIC(18,5) NOT NULL,
                price NUMERIC(18,5) NOT NULL,
                discount NUMERIC(18,5),
                total NUMERIC(18,5) NOT NULL            
            )

            INSERT INTO @tblItems(itemId, taxId, taxPercentId, taxValue, quantity, cost, price, discount, total)
            SELECT itemId, taxId, taxPercentId, taxValue, quantity, cost, price, discount, total 
            FROM OPENJSON(@itemsJson)
                WITH (
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
                    SELECT dbo.ufn_spresponse('0', 'No se pudo recuperar el detalle', NULL)
                    RETURN
                END

        END
    ELSE
        BEGIN
            SELECT dbo.ufn_spresponse('0', 'El detalle no es valido', NULL)
            RETURN
        END


    --IF (ISJSON(@jsonPayments) = 1)
    --    BEGIN
    --        DECLARE @tblPayments AS TABLE(
    --            total NUMERIC(18,5) NOT NULL,

    --        )
    --    END
    --ELSE
    --    BEGIN
    --        SELECT dbo.ufn_spresponse('0', 'Los pagos no son validos', NULL)
    --        RETURN
    --    END

    SELECT @secuence = cd.secuencial
			FROM v_ConfigDocumento cd
				INNER JOIN v_PtoEmi_Asign pa ON cd.codEstab = pa.codEstab
			WHERE pa.idUsuarioRol = @userRoleId
			AND cd.codDoc = 'OR'

    SET @serie = (SELECT CONVERT(VARCHAR, @secuence))
    SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

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
                            INSERT INTO Restaurant.[OrderKitchen] (OrderId, [Enabled], UserId)
                            VALUES(@id, 1, @userId)
                        END
                END
		COMMIT TRAN

        IF (@id > 0) 
            SELECT dbo.ufn_spresponse('1', 'Exitos al guardar', NULL)
        ELSE 
            SELECT dbo.ufn_spresponse('0', 'No se pudo guardar la orden', NULL)	
    END TRY
	BEGIN CATCH
		 SELECT dbo.ufn_spresponse('0', 'Error al guardar el orden', NULL)
        
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN

       INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES
        (NEWID(), 'Order/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @userId)
	END CATCH

END
GO
