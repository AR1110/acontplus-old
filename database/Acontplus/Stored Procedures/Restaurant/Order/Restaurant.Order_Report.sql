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
CREATE OR ALTER PROCEDURE Restaurant.Order_Report @userRoleId INT
    ,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @id INT

    SELECT @id = id FROM OPENJSON(@json) WITH(id INT '$.id')

	SET @tableNames = 'Order,OrderItems'
   
   --Order
	SELECT o.*
        ,e.nombreComercial tradeName
        ,r.[description] + ' - ' + ISNULL(t.[Description], '') + ' - ' + CONVERT(VARCHAR, t.NumberTable) tableName
        ,ISNULL(c.nombreFiscal, 'Consumidor Final') customer
        ,u.nombreUsuario username
    FROM Restaurant.[Order] o WITH (NOLOCK)
            LEFT JOIN Cliente c WITH(NOLOCK) ON o.CustomerCompanyId = c.idCliente
            LEFT JOIN v_usuario u ON o.UserId = u.idUsuario
            INNER JOIN Sri.Establecimiento e WITH(NOLOCK) ON o.EstablecimientoId = e.idEstablecimiento
            LEFT JOIN Restaurant.[Table] t WITH(NOLOCK) ON o.TableId = t.Id
            LEFT JOIN Restaurant.[v_room] r ON r.Id = t.RoomId
    WHERE o.Id = @id

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
END
GO
