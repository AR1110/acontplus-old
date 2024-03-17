USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-09-01
-- Description:	SP FOR GET ORDER REPORT
-- =============================================
--  Restaurant.Order_Report 139, '{"id":134}', ''

CREATE OR ALTER PROCEDURE Restaurant.Order_Report @userRoleId INT
    ,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @id INT

    SELECT @id = id FROM OPENJSON(@json) WITH(id INT '$.id')

	SET @tableNames = 'Order,OrderItems,taxRateTotal,taxRateValues'
   
   --Order
	SELECT 
        o.Serie
        ,o.[Sequence]        
        ,createdAt = CONVERT(NVARCHAR,FORMAT(o.CreatedAt, 'dd/MM/yyyy HH:mm'))  
        ,o.Obs
        , tradeName = e.nombreComercial
        ,tableName = r.[description] + ' - ' + ISNULL(t.[Description], '') 
        ,customer = ISNULL(c.nombreFiscal, 'Consumidor Final') 
        ,username = u.nombreUsuario 
        ,discount = ISNULL(CAST(o.Discount as numeric(18,2)), 0)
        ,total = CAST(o.Total AS numeric(18,2))
        ,tip = ISNULL(CAST(o.Tip as numeric(18,2)), 0)
        ,subtotalSinImpuesto = ISNULL(
                                        CAST(
                                                (SELECT SUM((oi.Quantity * oi.Price) - oi.Discount) FROM Restaurant.[OrderItem] oi WHERE oi.OrderId = @id) AS numeric(18,2) 
                                             )
                                      , 0) 
    FROM Restaurant.[Order] o WITH (NOLOCK)
            INNER JOIN Sri.Establecimiento e WITH(NOLOCK) ON o.EstablecimientoId = e.idEstablecimiento
            LEFT JOIN Cliente c WITH(NOLOCK) ON o.CustomerCompanyId = c.idCliente
            LEFT JOIN dbo.Usuario u ON u.idUsuario = o.UserId
            LEFT JOIN Restaurant.[Table] t WITH(NOLOCK) ON o.TableId = t.Id
            LEFT JOIN Restaurant.[v_room] r ON r.Id = t.RoomId
    WHERE o.Id = @id --134

	--OrderItems
	SELECT oi.*
        ,i.productName
        ,oi.TaxValue iva
    FROM Restaurant.[OrderItem] oi WITH (NOLOCK) 
        INNER JOIN Restaurant.v_Item i ON oi.ItemId = i.Id
        INNER JOIN Sri.Impuesto t WITH(NOLOCK) ON oi.TaxId = t.idImpuesto
        INNER JOIN Sri.TarifaImpuesto ti WITH(NOLOCK) ON t.codigo = ti.codImpuesto AND ti.codigo = '2'
    WHERE oi.OrderId = @id
        AND oi.Deleted IS NULL 

     SELECT 'Subtotal' + ' ' + ti.descripcion as [name]
          ,ISNULL
          ((
            SELECT CAST(SUM( ((oi.quantity * oi.price) - oi.discount)) as numeric(18,2)) 
            FROM Restaurant.[OrderItem] oi 
            where oi.OrderId = @id AND oi.TaxPercentId = ti.idTarifaImpuesto

          ),0) as [value]
    FROM Sri.TarifaImpuesto ti WITH (NOLOCK) WHERE ti.codImpuesto='2'

     SELECT ti.descripcion as [name]
          ,ISNULL
          ((
            SELECT CAST(SUM(oi.TaxValue) as numeric(18,2)) 
            FROM Restaurant.[OrderItem] oi 
            where oi.OrderId = @id AND oi.TaxPercentId = ti.idTarifaImpuesto
          ),0) as [value]
    FROM Sri.TarifaImpuesto ti WITH (NOLOCK) 
    WHERE ti.porcentaje > 0 

END
GO
