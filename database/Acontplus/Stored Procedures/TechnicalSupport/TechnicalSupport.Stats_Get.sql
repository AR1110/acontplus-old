USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-24
-- Description:	sp for get stats of technical support
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Stats_Get @userRoleId INT
	,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE  @companyId INT
        ,@totalCustomers INT
        ,@totalEmployes INT
        ,@totalOrders INT

	SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId) 

    SET @totalEmployes = (SELECT TOP 1 COUNT(*) OVER() FROM v_usuario WHERE idEntidad = @companyId)

        		SET @totalOrders =  (SELECT COUNT (*) FROM TechnicalSupport.[Order] o 	WITH (NOLOCK) 
                INNER JOIN Sri.Establecimiento e 	WITH (NOLOCK) ON o.EstablecimientoId = e.idEstablecimiento
												INNER JOIN dbo.Entidad en 	WITH (NOLOCK) ON e.idEntidad = en.idEntidad
										 WHERE en.idEntidad = @companyId  
                                            AND o.Deleted IS NULL
                                            AND o.[Enabled] = 1
                                            )

                                SELECT TOP 1 COUNT (*) OVER() total INTO #temp FROM TechnicalSupport.[Order] o 	WITH (NOLOCK) 
                                INNER JOIN Sri.Establecimiento e 	WITH (NOLOCK) ON o.EstablecimientoId = e.idEstablecimiento
												INNER JOIN dbo.Entidad en 	WITH (NOLOCK) ON e.idEntidad = en.idEntidad
										 WHERE en.idEntidad = @companyId  
                                            AND o.Deleted IS NULL
                                            AND o.[Enabled] = 1
                                            GROUP BY o.CustomerCompanyId
	                SET @totalCustomers =  (select total from #temp
                                            )
    SELECT '1' code, payload = (SELECT (SELECT [code], [name]
    ,total = (SELECT COUNT (*) FROM TechnicalSupport.[Order] o 	WITH (NOLOCK)
												    INNER JOIN Sri.Establecimiento e 	WITH (NOLOCK) ON o.EstablecimientoId = e.idEstablecimiento
												    INNER JOIN dbo.Entidad en 	WITH (NOLOCK) ON e.idEntidad = en.idEntidad 
										     WHERE  e.idEntidad = @companyId AND  o.Deleted IS NULL
                                                AND o.[Enabled] = 1
											    AND o.OrderStatusId = os.Id
											    )
    from TechnicalSupport.[OrderStatus] os
    WHERE os.Deleted IS NULL FOR JSON PATH) as 'stats'
                            , @totalOrders totalOrders, @totalCustomers totalCustomers, @totalEmployes totalEmployes FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
	drop table #temp
END
GO
