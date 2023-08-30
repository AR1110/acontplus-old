SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-14
-- Description:	sp for get order restaurant
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Order_Get @userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN 
	SET NOCOUNT ON;

    DECLARE @tipo INT
    ,@id INT

    SELECT @tipo = tipo, @id = id FROM OPENJSON(@json) WITH (
                                                                tipo INT '$.tipo',
                                                                id INT '$.id'
                                                            )

    IF (@tipo = 1)
        BEGIN
            SET @tableNames = 'orders'
	        SELECT o.*
                ,ISNULL(od.DocumentoId,0) DocumentoId
                ,ISNULL(td.codigo,'') codDoc
            FROM Restaurant.[Order] o WITH(NOLOCK)
                LEFT JOIN Restaurant.OrderDocument od WITH(NOLOCK) ON o.Id = od.OrderId
                LEFT JOIN TipoDocumento td WITH(NOLOCK) ON od.TipoDocumentoId = td.idTipoDocumento
            ORDER BY o.Id DESC
        END
    IF (@tipo = 2)
        BEGIN
            SET @tableNames = 'order,orderItems'
            SELECT * FROM Restaurant.[Order] o WITH(NOLOCK) WHERE o.Id = @id 
            SELECT * FROM Restaurant.[OrderItem] i WITH(NOLOCK) WHERE i.OrderId = @id 
        END
END
GO
