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
    SET LANGUAGE SPANISH;

    DECLARE @idEntidad INT, 
        @uuid UNIQUEIDENTIFIER,
        @expired BIT = 0,
        @licenses VARCHAR(MAX) = '[]',
        @stepsConfig VARCHAR(MAX) = '[]',
        @expiredSignatures VARCHAR(MAX) = '[]',
        @userId INT,
        @emittedDocuments VARCHAR(MAX) = '[]',
        @receivedDocuments VARCHAR(MAX) = '[]',
        @anotherSalesDocs VARCHAR(MAX) = '[]';

    -- Use a temporary table to store intermediate results
    DECLARE @TempResults TABLE (
        cantidadArticulo INT,
        cantidadCliente INT,
        cantidadProveedor INT,
        cantidadUsuario INT
    );

    DECLARE @ReceivedDocsTbl TABLE (
        document VARCHAR(100),
        total INT
    );

    DECLARE @SalesDocs TABLE (
        document VARCHAR(100),
        total INT
    );

    BEGIN TRY
        -- Get the company ID and user ID associated with the user's role
        SELECT 
            @idEntidad = idEntidad, 
            @userId = idUsuario
        FROM v_usuario 
        WHERE idUsuarioRol = @userRoleId;

        SET @uuid = (SELECT TOP 1 uuid FROM dbo.Entidad WITH(NOLOCK) WHERE idEntidad = @idEntidad)

        -- Populate temporary table with counts
        INSERT INTO @TempResults
        SELECT
            (SELECT COUNT(*) FROM dbo.Articulo    WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM dbo.Cliente     WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM dbo.Proveedor   WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM dbo.Usuario     WITH (NOLOCK) WHERE idUsuario IN (SELECT idUsuario FROM App.UsuarioRol WHERE idEntidad = @idEntidad));

        INSERT INTO @SalesDocs
        VALUES('Nota de Entrega',  (SELECT COUNT(*) FROM dbo.NotaEntrega WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1)),
        ('Proforma',  (SELECT COUNT(*) FROM dbo.NotaEntrega WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1));

        IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico de WITH(NOLOCK) INNER JOIN 
                Acontplus.dbo.PuntoEmision pe WITH(NOLOCK) ON de.idPuntoEmision = pe.idPuntoEmision
            INNER JOIN 
                 Acontplus.Sri.Establecimiento e WITH(NOLOCK) ON pe.idEstablecimiento = e.idEstablecimiento WHERE idEntidad = @identidad)
            BEGIN
                SET @emittedDocuments = (
      
                SELECT
                    td.descripcion document, 
                    COUNT(*) total
                FROM 
                    Acontplus.dbo.DocumentoElectronico de WITH(NOLOCK)
                INNER JOIN 
                    Acontplus.dbo.TipoDocumento td WITH(NOLOCK) ON de.idTipoDocumento = td.idTipoDocumento
                INNER JOIN 
                    Acontplus.FactElect.EstadoServicio es WITH(NOLOCK) ON de.idEstadoServicio = es.idEstadoServicio
                INNER JOIN 
                    Acontplus.dbo.PuntoEmision pe WITH(NOLOCK) ON de.idPuntoEmision = pe.idPuntoEmision
                INNER JOIN 
                     Acontplus.Sri.Establecimiento e WITH(NOLOCK) ON pe.idEstablecimiento = e.idEstablecimiento
                WHERE 
                    e.idEntidad = @idEntidad
		        GROUP BY  de.idTipoDocumento, 
                    td.descripcion, 
                    td.codigoSri
                ORDER BY td.codigoSri
                FOR JSON PATH
                );
            END

        INSERT INTO @ReceivedDocsTbl
             SELECT td.descripcion document
                    ,count(*) total
                FROM Recepcion.DocumentoRecibido dr WITH(NOLOCK)
                INNER JOIN Sri.Establecimiento e On dr.idEstablecimiento = e.idEstablecimiento
                INNER JOIN dbo.TipoDocumento td On dr.codDoc = td.codigoSri
                WHERE 
                    e.idEntidad = @idEntidad
                    AND dr.codDoc IS NOT NULL
                GROUP BY td.descripcion
                    ,dr.codDoc
                ORDER BY dr.codDoc

        INSERT INTO @ReceivedDocsTbl
        VALUES('Factura Física',  (SELECT COUNT(*) FROM dbo.FacturaCompra WHERE idEntidad = @idEntidad AND estado = 1));
         
        INSERT INTO @ReceivedDocsTbl
            SELECT td.descripcion document
                    ,count(*) total
            FROM Compra.Documento_Ingreso di
                INNER JOIN
                    Acontplus.dbo.TipoDocumento td ON di.codDoc = td.codigo
            WHERE 
                di.idEntidad = @idEntidad
            GROUP BY td.codigo
                ,td.descripcion
            ORDER BY td.codigo

        IF EXISTS (SELECT 1 FROM @ReceivedDocsTbl)
            BEGIN
                
                SET @receivedDocuments = (
                SELECT * FROM  @ReceivedDocsTbl

                FOR JSON PATH);
            END

        IF EXISTS (SELECT 1 FROM @SalesDocs)
            BEGIN
                SET @anotherSalesDocs = (
                    SELECT * FROM @SalesDocs FOR JSON PATH
                );
            END

        -- Check subscription status
        DECLARE @subscriptionCount INT, @freeSuscriptions INT, @maxPaymentDateCount INT;
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

        SET @freeSuscriptions = (
            SELECT COUNT(*)
            FROM App.UsuarioRol ur WITH (NOLOCK)
            INNER JOIN Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
            INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.uuid = c.uuid 
            INNER JOIN AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK) ON c.id = s.CompanyId 
            INNER JOIN AcontplusAdmin.Config.SubscriptionType st WITH(NOLOCK) ON s.SubscriptionTypeId = st.Id
            WHERE ur.idUsuarioRol = @userRoleId 
              AND s.[Enabled] = 1 
              AND s.Deleted IS NULL
              AND ur.estado = 1
              AND st.Code = 'G'
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

        IF (@maxPaymentDateCount = 0 AND @subscriptionCount > 0) AND @freeSuscriptions = 0
        BEGIN
            SET @expired = 1;
            SET @licenses = (
                SELECT 
                    CAST(@expired AS BIT) AS expired, 
                    'Su licencia ha expirado, por favor comuníquese con el departamento de ventas' AS warningMessage 
                FOR JSON PATH
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

        IF EXISTS (SELECT TOP 1 1 FROM AcontplusAdmin.Config.CompanyDemoStep WITH(NOLOCK) WHERE uuid = @uuid)
            BEGIN
            print @uuid
                SET @stepsConfig = (
                    SELECT ds.Id, ds.Code, ds.[Name], ds.Mandatory, ds.[Description]
                    FROM  AcontplusAdmin.Config.DemoStep ds 
                    WHERE ds.Id NOT IN (SELECT DemoStepId FROM AcontplusAdmin.Config.CompanyDemoStep WITH(NOLOCK) WHERE Uuid = @uuid)
                    FOR JSON PATH
                )
            END

       IF EXISTS (
            SELECT 1
            FROM dbo.FirmaElectronica WITH(NOLOCK)
            WHERE idEntidad = @idEntidad 
            AND DATEDIFF(DAY, GETDATE(), fechaCaducidad) <= 5
            --AND DATEDIFF(DAY, GETDATE(), fechaCaducidad) >= 0
        )
        BEGIN
          SET @expiredSignatures = (
          SELECT nombreArchivo,
                CASE 
                    WHEN DATEDIFF(DAY, GETDATE(), fechaCaducidad) < 0 THEN 
                        'Su firma electrónica ha caducado, por favor renuevela de inmediato, para poder seguir firmando los documentos electrónicos'
                    WHEN DATEDIFF(DAY, GETDATE(), fechaCaducidad) <= 5 THEN 
                        'Su firma electrónica está a ' + CAST(DATEDIFF(DAY, GETDATE(), fechaCaducidad) AS VARCHAR) + ' día(s) de expirar, por favor renuevela de inmediato'
                END AS message
            FROM dbo.FirmaElectronica WITH(NOLOCK)
            WHERE idEntidad = @idEntidad
            AND DATEDIFF(DAY, GETDATE(), fechaCaducidad) <= 5
            --AND DATEDIFF(DAY, GETDATE(), fechaCaducidad) >= 0
            FOR JSON PATH);
        END

        -- Construct the JSON response
        SELECT '1' AS code, 
               payload = (
                   SELECT
                       (SELECT cantidadUsuario,
                              cantidadArticulo,
                              cantidadCliente,
                              cantidadProveedor
                        FROM @TempResults
                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS 'statistics',
                       ISNULL(@licenses, '[]') AS licenses,
                       ISNULL(@stepsConfig, '[]') AS stepsConfig,
                       @expiredSignatures AS expiredSignatures,
                       @emittedDocuments AS emittedDocuments,
                       @receivedDocuments AS receivedDocuments,
                       @anotherSalesDocs AS anotherSalesDocs
                   FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
               );

    END TRY
    BEGIN CATCH
        -- Handle any errors that may have occurred
        INSERT INTO dbo.ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], idUsuario)
        VALUES(NEWID(), 'Common/Dashboard/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), GETDATE(), @userId)
        SELECT '0' AS code, 'Error on Bd' AS 'message'
    END CATCH
END
GO
