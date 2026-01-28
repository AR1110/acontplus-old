USE [Acontplus]
GO
/****** Object:  StoredProcedure [Common].[Dashboard_Get]    Script Date: 1/28/2026 8:59:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:        Alexis Ramirez 
-- Create date:   2021-09-10
-- Description:   SP to get stats and alerts
-- =============================================
CREATE OR ALTER PROCEDURE [Common].[Dashboard_Get] 
    @userRoleId INT,
    @json VARCHAR(MAX) = NULL,
    @tableNames VARCHAR(500) OUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    DECLARE @idEntidad INT, 
        @uuid UNIQUEIDENTIFIER,
        @expired BIT = 0,
        @userId INT;

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
        SELECT @idEntidad = idEntidad ,@userId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId;

        SET @uuid = (SELECT TOP 1 uuid FROM dbo.Entidad WITH(NOLOCK) WHERE idEntidad = @idEntidad)

        SET @tableNames = 'statistics,licenses,stepsConfig,expiredSignatures,emittedDocuments,receivedDocuments,anotherSalesDocs'

        -- Populate temporary table with counts
        INSERT INTO @TempResults
        SELECT
            (SELECT COUNT(*) FROM dbo.Articulo    WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM dbo.Cliente     WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM dbo.Proveedor   WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1),
            (SELECT COUNT(*) FROM dbo.Usuario     WITH (NOLOCK) WHERE idUsuario IN (SELECT idUsuario FROM App.UsuarioRol WHERE idEntidad = @idEntidad));
        
        INSERT INTO @SalesDocs
          VALUES('Nota de Entrega',(SELECT COUNT(*) FROM dbo.NotaEntrega WHERE idEntidad = @idEntidad AND estado = 1)),
                ('Proforma'       ,(SELECT COUNT(*) FROM dbo.Proforma    WHERE idEntidad = @idEntidad AND estado = 1));

        INSERT INTO @ReceivedDocsTbl
        SELECT td.descripcion as document
              ,COUNT(*)       as total
        FROM Recepcion.DocumentoRecibido dr
        INNER JOIN Sri.Establecimiento   es ON es.idEstablecimiento = dr.idEstablecimiento
        INNER JOIN dbo.TipoDocumento     td ON td.codigoSri         = dr.codDoc
        WHERE es.idEntidad = @idEntidad
          AND dr.codDoc IS NOT NULL
        GROUP BY td.descripcion

        INSERT INTO @ReceivedDocsTbl
        VALUES('Factura Física',  (SELECT COUNT(*) FROM dbo.FacturaCompra WITH(NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1));
         
        INSERT INTO @ReceivedDocsTbl
        SELECT td.descripcion as document
              ,count(*)       as total
        FROM Compra.Documento_Ingreso di
        INNER JOIN dbo.TipoDocumento  td ON td.codigo = di.codDoc 
        WHERE di.idEntidad = @idEntidad
        GROUP BY td.codigo
                ,td.descripcion

        SELECT * FROM @TempResults

        SELECT su.warningMessage
              ,st.Name
			  ,st.Code
			  ,su.MaxPaymentDate
        FROM App.UsuarioRol                                ur 
        INNER JOIN Entidad                                 en ON en.idEntidad     = ur.idEntidad
        INNER JOIN AcontplusAdmin.Config.Company           co ON co.uuid          = en.uuid 
        INNER JOIN AcontplusAdmin.Sales.Suscripcion        su ON su.CompanyId     = co.Id AND (su.Paid IS NULL OR su.Paid = 0) AND su.[IsActive] = 1 AND su.IsDeleted = CAST(0 AS BIT)
		INNER JOIN AcontplusAdmin.Config.SubscriptionType  st ON st.Id            = su.SubscriptionTypeId
        WHERE ur.idUsuarioRol = @userRoleId
          AND ur.estado = 1
		  AND ((st.Code = 'A' AND GETDATE() >= DATEADD(DAY, -30, su.MaxPaymentDate)) OR (st.Code = 'M' AND GETDATE() >= DATEADD(DAY, -5, su.MaxPaymentDate)))
          --AND @expired = 1

        SELECT ds.Id, ds.Code, ds.[Name], ds.Mandatory, ds.[Description]
        FROM AcontplusAdmin.Config.DemoStep ds
        WHERE ds.Id NOT IN (
            SELECT cds.DemoStepId 
            FROM AcontplusAdmin.Config.CompanyDemoStep cds
            INNER JOIN AcontplusAdmin.Config.Company c ON cds.CompanyId = c.Id
            WHERE c.Uuid = @uuid
        )
        AND EXISTS (
            SELECT 1
            FROM AcontplusAdmin.Config.CompanyDemoStep cds
            INNER JOIN AcontplusAdmin.Config.Company c ON cds.CompanyId = c.Id
            WHERE c.Uuid = @uuid
        )

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

        
        ;WITH DocumentStats AS (
            SELECT 
                de.idTipoDocumento, 
                td.descripcion, 
                td.codigoSri
            FROM 
                Acontplus.dbo.DocumentoElectronico de WITH(NOLOCK)
            INNER JOIN 
                Acontplus.dbo.TipoDocumento td WITH(NOLOCK) ON de.idTipoDocumento = td.idTipoDocumento
            INNER JOIN 
                Acontplus.dbo.PuntoEmision pe WITH(NOLOCK) ON de.idPuntoEmision = pe.idPuntoEmision
            INNER JOIN 
                Acontplus.Sri.Establecimiento e ON pe.idEstablecimiento = e.idEstablecimiento
            INNER JOIN 
                Acontplus.FactElect.EstadoServicio es WITH(NOLOCK) ON de.idEstadoServicio = es.idEstadoServicio
            WHERE 
                es.codigo = 4
                AND e.idEntidad = @idEntidad
        )

        SELECT 
            COUNT(*) AS total, 
            ds.descripcion AS document
        FROM 
            DocumentStats ds
        GROUP BY 
            ds.idTipoDocumento, ds.descripcion, ds.codigoSri
        ORDER BY 
            ds.codigoSri;

        SELECT * FROM  @ReceivedDocsTbl
     
        SELECT * FROM @SalesDocs

    END TRY
    BEGIN CATCH
        -- Handle any errors that may have occurred
        INSERT INTO dbo.ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], idUsuario)
        VALUES(NEWID(), 'Common/Dashboard/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), GETDATE(), @userId)
        SELECT '0' AS code, 'Error on Bd' AS 'message'
    END CATCH
END
