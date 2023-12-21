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

	DECLARE @dataSources AS TABLE (dsName VARCHAR(50))
    DECLARE @tblParams AS TABLE (
                            paramName VARCHAR(100),
                            isBase64 BIT,
                            paramValue VARBINARY(MAX))

    DECLARE @logoImg VARBINARY(MAX)
    ,@mimeType VARCHAR(20)

	INSERT INTO @dataSources(dsName)
	VALUES	('Order'),
			('OrderItems')

	SET @tableNames = 'RdlcProps,RdlcDataSources,Order,OrderItems,RdlcParams'

	--RdlcProps
	SELECT 'Restaurant\Order.rdl' ReportPath, 'PDF' ReportFormat, 'Orden de Pedido' ReportName

	--RdlcDataSources
	SELECT * FROM @dataSources

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

		--RdlcParams
	SELECT TOP 1 @logoImg = imagen
			,@mimeType = mimeType
	FROM AcontPlus.Config.Estab_Logo WITH (NOLOCK)
	WHERE ruc = (SELECT TOP 1 e.ruc FROM Sri.Establecimiento e WITH (NOLOCK)
										INNER JOIN Restaurant.[Order] o WITH (NOLOCK) ON e.idEstablecimiento = o.EstablecimientoId
										WHERE o.Id = @id)
                                        ORDER BY idEstab_Logo DESC

    INSERT INTO @tblParams(paramName, isBase64, paramValue)
    VALUES('logo', 1, ISNULL(@logoImg, CONVERT(VARBINARY(MAX), NEWID()))),
        ('mimeType', 0, CONVERT(VARBINARY, ISNULL(@mimeType, 'none')))

    SELECT * FROM @tblParams
	
END
GO
