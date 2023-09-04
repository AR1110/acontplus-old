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
	,@id INT
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @dataSources AS TABLE (dsName VARCHAR(50))
    DECLARE @tblParams AS TABLE (
                            paramName VARCHAR(100),
                            isBinary BIT,
                            paramValue VARBINARY(MAX))

    DECLARE @logoImg VARBINARY(MAX)
    ,@mimeType VARCHAR(20)

	INSERT INTO @dataSources(dsName)
	VALUES	('Order'),
			('OrderItems')

	SET @tableNames = 'RdlcProps,RdlcDataSources,Order,OrderItems,RdlcParams'

	--RdlcProps
	SELECT 'Reports\Order.rdl' ReportPath, 'pdf' ReportFormat, 'application/pdf' ContentType, 'Orden de Pedido.pdf' ReportName

	--RdlcDataSources
	SELECT * FROM @dataSources

	--OrderHeader
	SELECT * FROM Restaurant.[Order] WITH (NOLOCK) WHERE Id = @id

	--OrderItems
	SELECT * FROM Restaurant.[OrderItem] WITH (NOLOCK) WHERE OrderId = @id

		--RdlcParams
	SELECT TOP 1 @logoImg = imagen
			,@mimeType = mimeType
	FROM AcontPlus.Config.Estab_Logo WITH (NOLOCK)
	WHERE ruc = (SELECT TOP 1 e.ruc FROM Sri.Establecimiento e WITH (NOLOCK)
										INNER JOIN Restaurant.[Order] o WITH (NOLOCK) ON e.idEstablecimiento = o.EstablecimientoId
										WHERE o.Id = @id)
                                        ORDER BY idEstab_Logo DESC

    INSERT INTO @tblParams(paramName, isBinary, paramValue)
    VALUES('logo', 1, @logoImg),
        ('mimeType', 0, CONVERT(VARBINARY, @mimeType))

    SELECT * FROM @tblParams
	
END
GO
