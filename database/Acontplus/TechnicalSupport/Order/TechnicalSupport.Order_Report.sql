USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2024-04-08
-- Description: REPORTE DE ORDEN
-- =============================================
-- TechnicalSupport.Order_Report 28, '{"id": 31}', ''
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Report @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @id INT
            , @entregadoPor VARCHAR(500)

	SELECT @id = id FROM OPENJSON(@json) WITH (id INT '$.id')

    SELECT @entregadoPor = nombreComercial FROM v_Usuario WHERE idUsuarioRol = @userRoleId

	SET @tableNames = 'order,orderDetails'
	SELECT
          o.FechaEmision
        , o.[Sequence]
        , ISNULL(o.Serie, 0)                                                        AS Serie
        , ISNULL(o.Tax, 0)                                                          AS Tax
        , ISNULL(o.Discount, 0)                                                     AS Discount
        , ISNULL(o.Tip, 0)                                                          AS Tip
        , ISNULL(o.Total, 0)                                                        AS Total
        , en.razonSocial                                                            AS BusinessName
        , en.direccion                                                              AS Direction
        , cc.BusinessName                                                           AS Customer
        , ISNULL(c.telefono, '-')                                                   AS CustomerPhone
        , c.direccion                                                               AS CustomerAddress
        , cc.IDCard                                                                 AS CustomerCardID
        , u.nombreUsuario                                                           AS Username
        , o.Obs                                                                     AS Obs
        , tos.Name                                                                  AS OrderStatus
        , (CASE WHEN ISNULL(o.Finished, 0) = 1
                THEN ISNULL(CONVERT(NVARCHAR, FORMAT(o.UpdatedAt, 'dd/MM/yyyy HH:mm')), '-')
                ELSE '' END
          )                                                                         AS UpdateDate
        , ua.nombreCompleto                                                         AS UsuarioAsignado
        , (CASE WHEN ISNULL(o.Finished, 0) = 1 THEN @entregadoPor ELSE '' END)      AS EntregadoPor
        , (CASE 
            WHEN o.Receiver IS NULL AND ISNULL(o.Finished, 0) = 1 THEN cc.BusinessName
            WHEN o.Receiver IS NOT NULL AND ISNULL(o.Finished, 0) = 1 THEN o.Receiver 
            ELSE '' END
          )                                                                         AS RecibidoPor       
	FROM TechnicalSupport.[Order] o		            WITH (NOLOCK)
    LEFT JOIN dbo.Usuario u				            WITH (NOLOCK) ON u.idUsuario			= o.UserId
    INNER JOIN dbo.Cliente c			            WITH (NOLOCK) ON c.idCliente			= o.CustomerCompanyId
    INNER JOIN Customer.Customer cc		            WITH (NOLOCK) ON cc.Id					= c.CustomerId
    INNER JOIN Sri.Establecimiento e	            WITH (NOLOCK) ON e.idEstablecimiento	= o.EstablecimientoId
    INNER JOIN dbo.Entidad en			            WITH (NOLOCK) ON en.idEntidad    		= e.idEntidad
    INNER JOIN TechnicalSupport.OrderStatus tos     WITH (NOLOCK) ON tos.Id                 = o.OrderStatusId
    LEFT JOIN v_Usuario ua                          WITH (NOLOCK) ON ua.idUsuario           = o.AssignedUserId
    WHERE o.Id = @id

    SELECT od.Id                    AS OrderDetaillId
    ,   d.[Name]                    AS DeviceName
    ,   DeviceSerie                 = (SELECT TOP 1 dv.SerialNumber FROM TechnicalSupport.DeviceCustomer dv WHERE dv.CustomerCompanyId = o.CustomerCompanyId)
    ,   DeviceWarranty              = (SELECT TOP 1 dv.warrantyEndDate FROM TechnicalSupport.DeviceCustomer dv WHERE dv.CustomerCompanyId = o.CustomerCompanyId)
    ,   od.Obs                      AS Obs
    ,   od.CreatedAt                AS CreatedAt
    --- OrderMantenaince ----
    ,   b.descripcion               AS Bodega
    ,   m.descripcion               AS Medida
    ,   a.descripcion               AS Producto
    ,   ISNULL(orm.Quantity, 0)     AS Quantity
    ,   ISNULL(orm.Cost, 0)         AS Cost
    ,   ISNULL(orm.TaxValue, 0)     AS TaxValue
    ,   ISNULL(orm.Price, 0)        AS Price
    ,   ISNULL(orm.Discount, 0)     AS Discount
    ,   ISNULL(orm.Total, 0)        AS Total
    ,   orm.Obs                     AS ObsMaintenance
    FROM TechnicalSupport.OrderDetail od WITH(NOLOCK)
    INNER JOIN TechnicalSupport.[Order] o               WITH(NOLOCK) ON o.Id				    = od.OrderId
    INNER JOIN TechnicalSupport.Device d                WITH(NOLOCK) ON d.Id				    = od.DeviceId
    LEFT  JOIN TechnicalSupport.OrderMaintenance orm	WITH(NOLOCK) ON orm.OrderDetailId	    = od.Id
    LEFT JOIN dbo.Bodega b                              WITH(NOLOCK) ON b.idBodega              = orm.BodegaId
    LEFT JOIN dbo.Medida m                              WITH(NOLOCK) ON m.idMedida              = orm.MedidaId
    LEFT JOIN dbo.Articulo a                            WITH(NOLOCK) ON a.idArticulo            = orm.ProductId
    WHERE od.OrderId = @id
    AND orm.Deleted IS NULL
    ORDER BY orm.OrderDetailId DESC
END
GO