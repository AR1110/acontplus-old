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
AS
BEGIN 
	SET NOCOUNT ON;

	SELECT o.*, ISNULL(od.DocumentoId,0) DocumentoId, ISNULL(td.codigo,'') codDoc FROM Restaurant.[Order] o 
        LEFT JOIN Restaurant.OrderDocument od WITH(NOLOCK) ON o.Id = od.OrderId
        LEFT JOIN TipoDocumento td WITH(NOLOCK) ON od.TipoDocumentoId = td.idTipoDocumento
    ORDER BY o.Id DESC
END
GO
