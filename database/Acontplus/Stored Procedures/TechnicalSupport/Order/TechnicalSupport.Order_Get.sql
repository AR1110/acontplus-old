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
	DECLARE @tipo INT
    ,@companyId INT
    ,@orderStatusCode VARCHAR(2)

	SELECT @tipo = tipo, @orderStatusCode = orderStatusCode
    FROM OPENJSON (@json) WITH 
    (
        tipo            INT         '$.tipo',
        orderStatusCode VARCHAR(2)  '$.orderStatusCode'
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
        FROM TechnicalSupport.[Order] tor
        INNER JOIN Cliente c                        ON c.idCliente = tor.CustomerCompanyId
        INNER JOIN TechnicalSupport.OrderStatus sc  ON sc.Id = tor.OrderStatusId
        WHERE sc.Code = @orderStatusCode
        ORDER BY tor.CreatedAt DESC
    END
END
GO