USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Order_Report @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @id INT

	SELECT @id = id FROM OPENJSON(@json) WITH (id INT '$.id')

	SET @tableNames = 'order,orderDetails'
	SELECT o.*
        ,en.razonSocial BusinessName
        ,cc.BusinessName customer
        ,c.telefono customerPhone
        ,c.direccion customerAddress
        ,cc.IDCard customerCardID
        ,u.nombreUsuario username
	FROM TechnicalSupport.[Order] o WITH (NOLOCK)
        LEFT JOIN dbo.Usuario u WITH (NOLOCK) ON o.UserId = u.idUsuario
        INNER JOIN dbo.Cliente c WITH (NOLOCK) ON o.CustomerCompanyId = c.idCliente
        INNER JOIN Customer.Customer cc WITH (NOLOCK) ON c.CustomerId = cc.Id
        INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON o.EstablecimientoId = o.EstablecimientoId
        INNER JOIN dbo.Entidad en WITH (NOLOCK) ON e.ruc = en.ruc
    WHERE o.Id = @id

    SELECT d.[Name] deviceName
    ,dc.SerialNumber deviceSerie
    ,dc.Warranty deviceWarranty
    ,od.Obs
    FROM TechnicalSupport.OrderDetail od WITH (NOLOCK)
        INNER JOIN TechnicalSupport.Device d ON od.DeviceId = d.Id
        INNER JOIN TechnicalSupport.DeviceCustomer dc WITH (NOLOCK) ON d.Id = dc.DeviceId
    WHERE od.OrderId = @id

END
GO
