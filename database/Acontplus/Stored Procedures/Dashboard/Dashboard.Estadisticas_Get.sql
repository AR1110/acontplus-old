USE [AcontPlus]

GO
/****** Object:  StoredProcedure [dbo].[ASPDashboardGestionCantidad]    Script Date: 05/21/2023 9:07:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-09-10
-- Description:	SP para contar la cantidad de datos por empresa
-- =============================================
IF OBJECT_ID('Dashboard.Estadisticas_Get') IS NOT NULL
DROP PROCEDURE Dashboard.Estadisticas_Get
GO
CREATE PROCEDURE Dashboard.Estadisticas_Get @idUsuarioRol INT
,@json VARCHAR(MAX) = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON; 

	DECLARE @cantidadArticulo INT 
		   ,@cantidadCliente INT 
		   ,@cantidadProveedor INT 
		   ,@cantidadUsuario INT 
		   ,@idEntidad INT = (SELECT idEntidad FROM App.UsuarioRol WHERE idUSuarioRol = @idUsuarioRol)
		   ,@facturaVenta int 
		   ,@notaEntrega int 
		   ,@proforma int 
		   ,@facturaCompra int 
           ,@expired BIT = 0
           ,@licenses VARCHAR(MAX)
		
	SET @cantidadArticulo  =(SELECT COUNT(*) FROM Articulo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @cantidadUsuario   =(SELECT COUNT(*) FROM Usuario WITH (NOLOCK) WHERE idUsuario IN (SELECT idUsuario FROM Rol WHERE idEntidad = @idEntidad))
	SET @cantidadProveedor =(SELECT COUNT(*) FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad and estado = 1)
	SET @cantidadCliente   =(SELECT COUNT(*) FROM Cliente WITH (NOLOCK) WHERE idEntidad = @idEntidad and estado = 1)
	SET @facturaVenta	   =(SELECT COUNT(*) FROM Factura WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @notaEntrega	   =(SELECT COUNT(*) FROM NotaEntrega WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @proforma		   =(SELECT COUNT(*) FROM Proforma WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	SET @facturaCompra	   =(SELECT COUNT(*) FROM FacturaCompra WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)
	
    IF (SELECT COUNT(*) FROM App.UsuarioRol ur WITH (NOLOCK)
                                                        INNER JOIN Entidad e WITH(NOLOCK) ON ur.idEntidad = e.idEntidad
                                                        INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
                                                        INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId 
                                                            AND (s.Paid IS NULL OR s.Paid = 0)
                                                            AND s.[Enabled] = 1 
                                                            AND s.Deleted IS NULL 
                                                        WHERE ur.idUsuarioRol = @idUsuarioRol
                                                        AND dbo.ufnGetDateEcuador() <=  s.MaxPaymentDate                                  
                                                        AND ur.estado = 1) = 0
                              AND (SELECT COUNT(*) FROM App.UsuarioRol ur WITH (NOLOCK)
                                                        INNER JOIN Entidad e WITH(NOLOCK) ON ur.idEntidad = e.idEntidad
                                                        INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
                                                        INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId 
                                                            AND (s.Paid IS NULL OR s.Paid = 0)
                                                            AND s.[Enabled] = 1
                                                            AND s.Deleted IS NULL 
                                                        WHERE ur.idUsuarioRol = @idUsuarioRol                                              
                                                        AND ur.estado = 1) > 0
        BEGIN 
            SET @expired = 1
            SET @licenses = (SELECT CAST(@expired AS bit) expired, warningMessage = 'Su licencia a expirado, por favor comunicate con el departamente de ventas' FOR JSON PATH)
        END
    ELSE IF (SELECT COUNT(*) FROM App.UsuarioRol ur WITH (NOLOCK)
                                                        INNER JOIN Entidad e WITH(NOLOCK) ON ur.idEntidad = e.idEntidad
                                                        INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
                                                        INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId 
                                                            AND (s.Paid IS NULL OR s.Paid = 0)
                                                            AND s.[Enabled] = 1
                                                            AND s.Deleted IS NULL
                                                        WHERE ur.idUsuarioRol = @idUsuarioRol
                                                        AND dbo.ufnGetDateEcuador() <= s.MaxPaymentDate                                           
                                                        AND ur.estado = 1) > 0
        BEGIN
	        SET @licenses = (SELECT CONVERT(VARCHAR, FORMAT(s.maxPaymentDate, 'yyyy-MM-dd'), 106) maxPaymentDate
                                    ,REPLACE(
                                        REPLACE(
                                                REPLACE(s.warningMessage, '$Costo', CONVERT(VARCHAR, CAST( s.total  as numeric(18,2)))), '$FechaMaximaPago', CONVERT(VARCHAR, FORMAT(s.maxPaymentDate, 'dd/MM/yyyy'), 106)
                                            ), '$Tipo', lt.[Name]) warningMessage
                                    , lt.[Name] licenseType
                                    , l.code licenseCode
                                    , s.total
                                    , st.[Name] susbscriptionType 
                             FROM App.UsuarioRol ur WITH (NOLOCK)
                             INNER JOIN Entidad e WITH(NOLOCK) ON ur.idEntidad = e.idEntidad
                             INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
                             INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId 
                                AND (s.Paid IS NULL OR s.Paid = 0)
                                AND s.[Enabled] = 1
                                AND s.Deleted IS NULL
                             INNER JOIN AcontplusAdmin.Config.Licencia l WITH (NOLOCK) ON s.LicenciaId = l.Id
                             INNER JOIN AcontplusAdmin.Config.LicenseType lt ON l.LicenseTypeId = lt.Id
                             INNER JOIN AcontplusAdmin.Config.SubscriptionType st WITH (NOLOCK) ON s.SubscriptionTypeId = st.Id
                             WHERE ur.idUsuarioRol = @idUsuarioRol
                                AND dbo.ufnGetDateEcuador() <= s.MaxPaymentDate                                                       
                                AND ur.estado = 1 FOR JSON PATH)
        END

	SELECT (SELECT @cantidadUsuario   as cantidadUsuario,
		@cantidadArticulo  as cantidadArticulo,
		@cantidadCliente   as cantidadCliente,
		@cantidadProveedor as cantidadProveedor,
		@facturaVenta	   as cantidadFacturaV,
		@facturaCompra	   as cantidadFacturaC,
		@proforma		   as cantidadProforma,
		@notaEntrega	   as cantidadNotaEntrega FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as 'statistics', @licenses licenses FOR JSON PATH

END

GO