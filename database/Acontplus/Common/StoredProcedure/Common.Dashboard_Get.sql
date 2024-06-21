USE [AcontPlus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Alexis Ramirez 
-- Create date:   2021-09-10
-- Description:   SP to get stats and alerts
-- =============================================
CREATE OR ALTER PROCEDURE Common.Dashboard_Get 
    @userRoleId INT,
    @json VARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @cantidadArticulo INT,
        @cantidadCliente INT,
        @cantidadProveedor INT,
        @cantidadUsuario INT,
        @idEntidad INT,
        @facturaVenta INT,
        @notaEntrega INT,
        @proforma INT,
        @facturaCompra INT,
        @expired BIT = 0,
        @licenses VARCHAR(MAX) = '[]',
        @releases VARCHAR(MAX) = '[]',
        @userId INT;

    -- Use a temporary table to store intermediate results
    DECLARE @TempResults TABLE (
        cantidadArticulo INT,
        cantidadCliente INT,
        cantidadProveedor INT,
        cantidadUsuario INT,
        facturaVenta INT,
        notaEntrega INT,
        proforma INT,
        facturaCompra INT
    );

    BEGIN TRY
        -- Get the company ID and user ID associated with the user's role
        SELECT 
            @idEntidad = idEntidad, 
            @userId = idUsuario 
        FROM v_usuario 
        WHERE idUsuarioRol = @userRoleId;

        -- Populate temporary table with counts
        INSERT INTO @TempResults
        SELECT
            (SELECT COUNT(*) FROM Articulo WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM Cliente WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM Usuario WITH (NOLOCK) WHERE idUsuario IN (SELECT idUsuario FROM App.UsuarioRol WHERE idEntidad = @idEntidad)),
            (SELECT COUNT(*) FROM Factura WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM NotaEntrega WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM Proforma WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM FacturaCompra WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1);

        -- Retrieve counts from temporary table
        SELECT
            @cantidadArticulo = cantidadArticulo,
            @cantidadCliente = cantidadCliente,
            @cantidadProveedor = cantidadProveedor,
            @cantidadUsuario = cantidadUsuario,
            @facturaVenta = facturaVenta,
            @notaEntrega = notaEntrega,
            @proforma = proforma,
            @facturaCompra = facturaCompra
        FROM @TempResults;

        -- Check subscription status
        DECLARE @subscriptionCount INT, @maxPaymentDateCount INT;
        SET @subscriptionCount = (
            SELECT COUNT(*)
            FROM App.UsuarioRol ur WITH (NOLOCK)
            INNER JOIN Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
            INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
            INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId 
            WHERE ur.idUsuarioRol = @userRoleId
              AND (s.Paid IS NULL OR s.Paid = 0)
              AND s.[Enabled] = 1 
              AND s.Deleted IS NULL
              AND ur.estado = 1
        );

        SET @maxPaymentDateCount = (
            SELECT COUNT(*)
            FROM App.UsuarioRol ur WITH (NOLOCK)
            INNER JOIN Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
            INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
            INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId 
            WHERE ur.idUsuarioRol = @userRoleId
              AND (s.Paid IS NULL OR s.Paid = 0)
              AND s.[Enabled] = 1
              AND s.Deleted IS NULL
              AND ur.estado = 1
              AND dbo.ufnGetDateEcuador() <= s.MaxPaymentDate
        );

        IF @maxPaymentDateCount = 0 AND @subscriptionCount > 0
        BEGIN
            SET @expired = 1;
            SET @licenses = (
                SELECT 
                    CAST(@expired AS BIT) AS expired, 
                    'Su licencia ha expirado, por favor comuníquese con el departamento de ventas' AS warningMessage 
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            );
        END
        ELSE IF @maxPaymentDateCount > 0
        BEGIN
            SET @licenses = (
                SELECT 
                    CONVERT(VARCHAR, FORMAT(s.MaxPaymentDate, 'yyyy-MM-dd')) AS maxPaymentDate,
                    REPLACE(
                        REPLACE(
                            REPLACE(s.warningMessage, '$Costo', CONVERT(VARCHAR, CAST(s.total AS NUMERIC(18, 2)))), 
                            '$FechaMaximaPago', CONVERT(VARCHAR, FORMAT(s.MaxPaymentDate, 'dd/MM/yyyy'))
                        ), 
                        '$Tipo', lt.[Name]
                    ) AS warningMessage,
                    lt.[Name] + ' - ' + a.[Name] AS licenseType,
                    l.code AS licenseCode,
                    sd.total,
                    st.[Name] AS subscriptionType,
                    s.total AS totalGlobal
                FROM App.UsuarioRol ur WITH (NOLOCK)
                INNER JOIN Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
                INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId
                                    AND (s.Paid IS NULL OR s.Paid = 0)
                AND s.[Enabled] = 1
                AND s.Deleted IS NULL
                INNER JOIN AcontplusAdmin.Sales.SuscripcionDetalle sd ON s.Id = sd.SuscripcionId
                INNER JOIN AcontplusAdmin.Config.LicenciaDetalle ld ON sd.LicenciaDetalleId = ld.Id
                INNER JOIN AcontplusAdmin.Config.Licencia l WITH (NOLOCK) ON ld.LicenciaId = l.Id
                INNER JOIN AcontplusAdmin.Config.LicenseType lt ON l.LicenseTypeId = lt.Id
                INNER JOIN AcontplusAdmin.Config.SubscriptionType st WITH (NOLOCK) ON s.SubscriptionTypeId = st.Id
                INNER JOIN AcontplusAdmin.Config.Aplicacion a ON ld.AplicacionId = a.Id
                WHERE ur.idUsuarioRol = @userRoleId
                  AND dbo.ufnGetDateEcuador() <= s.MaxPaymentDate
                  AND ur.estado = 1 
                FOR JSON PATH
            );
        END

        -- Check for new releases
        IF (SELECT COUNT(*) FROM AcontplusAdmin.Common.Release WITH (NOLOCK)) <> 
           (SELECT COUNT(*) FROM AcontplusAdmin.Common.UserReleaseRead WITH (NOLOCK))
        BEGIN
            SET @releases = (
                SELECT 
                    id, 
                    description, 
                    logoutRequired, 
                    version, 
                    CONVERT(VARCHAR, FORMAT(ReleaseDate, 'dd/MM/yyyy')) AS releaseDate
                FROM AcontplusAdmin.Common.Release r WITH (NOLOCK)
                WHERE r.Id NOT IN (SELECT Id FROM AcontplusAdmin.Common.UserReleaseRead) 
                FOR JSON PATH
            );
        END

        -- Construct the JSON response
        SELECT '1' AS code, 
               payload = (
                   SELECT
                       (SELECT @cantidadUsuario   AS cantidadUsuario,
                               @cantidadArticulo  AS cantidadArticulo,
                               @cantidadCliente   AS cantidadCliente,
                               @cantidadProveedor AS cantidadProveedor,
                               @facturaVenta      AS cantidadFacturaV,
                               @facturaCompra     AS cantidadFacturaC,
                               @proforma          AS cantidadProforma,
                               @notaEntrega       AS cantidadNotaEntrega 
                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS 'statistics',
                       ISNULL(@licenses, '[]') AS licenses,
                       ISNULL(@releases, '[]') AS releases
                   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
               );

    END TRY
    BEGIN CATCH
        -- Handle any errors that may have occurred
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_SEVERITY() AS ErrorSeverity,
            ERROR_STATE() AS ErrorState,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE() AS ErrorLine,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO
