USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-10-18
-- Description:	SP for get orders
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @companyId INT
    ,@id INT
    ,@orderStatusCode VARCHAR(2)
    ,@pageIndex INT
    ,@pageSize INT
    ,@tipo INT

	SELECT @id = id
        ,@orderStatusCode = orderStatusCode
        ,@pageIndex = pageIndex
        ,@pageSize = pageSize
        ,@tipo = tipo
    FROM OPENJSON (@json) WITH 
    (
        id              INT '$.id',
        orderStatusCode VARCHAR(2)  '$.orderStatusCode',
        tipo            INT         '$.tipo',
        orderStatusCode VARCHAR(2)  '$.orderStatusCode',
        pageIndex       INT '$.pageIndex',
        pageSize        INT '$.pageSize'
    )
	
    SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)

	IF @tipo = 1
		BEGIN
			SET @tableNames = 'puntosEmision,bodegas,categories,users'
			SELECT * FROM v_PtoEmi_Asign WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
			SELECT * FROM v_Bodega_Asign WHERE idUsuarioRol = @userRoleId
            SELECT * FROM TechnicalSupport.Category WITH(NOLOCK) WHERE [Enabled] = 1
            SELECT * FROM v_usuario WHERE idEntidad = @companyId AND estadoUsuario = 1 
		END

   IF @tipo = 2
    BEGIN
        SET @tableNames = 'orders'
        
        SELECT tor.Id
            ,tor.Uuid
            ,tor.Sequence
            ,tor.Serie
            ,ISNULL(tor.Tax, 0.0)       AS Tax
            ,ISNULL(tor.Discount, 0.0)  AS Discount
            ,ISNULL(tor.Tip, 0.0)       AS Tip
            ,ISNULL(tor.Total, 0.0)     AS Total
            ,ISNULL(tor.Obs, '')        AS obs
            ,tor.Enabled
            ,tor.CustomerCompanyId
            ,c.nombreFiscal
            ,totalRecords       = COUNT(*) OVER()
        FROM TechnicalSupport.[Order] tor
        INNER JOIN Cliente c                        ON c.idCliente = tor.CustomerCompanyId
        INNER JOIN TechnicalSupport.OrderStatus sc  ON sc.Id = tor.OrderStatusId
        WHERE sc.Code = @orderStatusCode
            AND tor.Deleted IS NULL
        ORDER BY tor.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY   
        RETURN
    END
    IF @tipo = 4
        BEGIN
            SET @tableNames = 'order,orderDetails,orderMaintenances'
        
            SELECT tor.Id
                ,tor.Uuid
                ,tor.Sequence
                ,tor.Serie
                ,ISNULL(tor.Tax, 0.0)       AS Tax
                ,ISNULL(tor.Discount, 0.0)  AS Discount
                ,ISNULL(tor.Tip, 0.0)       AS Tip
                ,ISNULL(tor.Total, 0.0)     AS Total
                ,ISNULL(tor.Obs, '')        AS obs
                ,tor.Enabled
                ,tor.CustomerCompanyId
                ,c.nombreFiscal RazonSocial
            FROM TechnicalSupport.[Order] tor
            INNER JOIN Cliente c                        ON c.idCliente = tor.CustomerCompanyId
            INNER JOIN TechnicalSupport.OrderStatus sc  ON sc.Id = tor.OrderStatusId
            WHERE tor.Id = @id

            SELECT o.*, d.Id DeviceId, d.[Name] DeviceName FROM TechnicalSupport.[OrderDetail] o WITH (NOLOCK) 
                INNER JOIN TechnicalSupport.Device d WITH (NOLOCK) ON o.DeviceId = d.Id
            WHERE OrderId = @id

            SELECT om.*, a.descripcion ProductName FROM TechnicalSupport.[OrderMaintenance] om WITH (NOLOCK)
                    INNER JOIN TechnicalSupport.[OrderDetail] od WITH (NOLOCK) ON om.OrderDetailId = od.Id
                    INNER JOIN dbo.Articulo a ON om.ProductId = a.idArticulo
            WHERE od.OrderId = @id
            RETURN
        END
END
GO