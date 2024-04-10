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
-- TechnicalSupport.Order_Report 28, '{"id": 1}', ''
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Report @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @id INT

	SELECT @id = id FROM OPENJSON(@json) WITH (id INT '$.id')

	SET @tableNames = 'order,orderDetails'
	SELECT
          o.FechaEmision
        , o.[Sequence]
        , ISNULL(o.Serie, 0)        AS Serie
        , ISNULL(o.Tax, 0)          AS Tax
        , ISNULL(o.Discount, 0)     AS Discount
        , ISNULL(o.Tip, 0)          AS Tip
        , ISNULL(o.Total, 0)        AS Total
        , en.razonSocial            AS BusinessName
        , en.direccion              AS Direction
        , cc.BusinessName           AS Customer
        , ISNULL(c.telefono, '-')   AS CustomerPhone
        , c.direccion               AS CustomerAddress
        , cc.IDCard                 AS CustomerCardID
        , u.nombreUsuario           AS Username
        , o.Obs                     AS Obs
	FROM TechnicalSupport.[Order] o		WITH (NOLOCK)
    LEFT JOIN dbo.Usuario u				WITH (NOLOCK) ON u.idUsuario			= o.UserId
    INNER JOIN dbo.Cliente c			WITH (NOLOCK) ON c.idCliente			= o.CustomerCompanyId
    INNER JOIN Customer.Customer cc		WITH (NOLOCK) ON cc.Id					= c.CustomerId
    INNER JOIN Sri.Establecimiento e	WITH (NOLOCK) ON e.idEstablecimiento	= o.EstablecimientoId
    INNER JOIN dbo.Entidad en			WITH (NOLOCK) ON en.ruc					= e.ruc
    WHERE o.Id = @id

    SELECT od.Id                    AS OrderDetaillId
    ,   d.[Name]                    AS DeviceName
    ,   dc.SerialNumber             AS DeviceSerie
    ,   dc.Warranty                 AS DeviceWarranty
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
    FROM TechnicalSupport.OrderMaintenance orm    WITH(NOLOCK)
    INNER JOIN dbo.Bodega b                             WITH(NOLOCK) ON b.idBodega          = orm.BodegaId
    INNER JOIN dbo.Medida m                             WITH(NOLOCK) ON m.idMedida          = orm.MedidaId
    INNER JOIN dbo.Articulo a                           WITH(NOLOCK) ON a.idArticulo        = orm.ProductId
    INNER JOIN TechnicalSupport.OrderDetail od          WITH(NOLOCK)  ON od.Id               = orm.OrderDetailId
    INNER JOIN TechnicalSupport.Device d                WITH(NOLOCK) ON od.DeviceId         = d.Id
    INNER JOIN TechnicalSupport.DeviceCustomer dc       WITH(NOLOCK) ON d.Id                = dc.DeviceId
    WHERE od.OrderId = @id
    ORDER BY orm.OrderDetailId DESC
END
GO