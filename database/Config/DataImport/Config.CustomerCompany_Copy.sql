USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-01-07
-- Description:	sp for copy customers and suppliers to anothers company
-- =============================================
CREATE OR ALTER PROCEDURE Config.CustomerCompany_Copy
    @rucOrigen VARCHAR(25),
    @rucDestino VARCHAR(25), 
    @copySuppliers BIT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @companyOrigenId INT,
        @companyDestinoId INT,
        @tiemposCreditoCopied INT = 0,
        @customersCopied INT = 0,
        @suppliersCopied INT = 0;

    BEGIN TRY
        -- Retrieve company IDs based on provided RUCs
        SET @companyOrigenId = (SELECT idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE ruc = @rucOrigen);
        SET @companyDestinoId = (SELECT idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE ruc = @rucDestino);

        -- Validate company IDs
        IF @companyOrigenId IS NULL OR @companyDestinoId IS NULL
        BEGIN
            THROW 50001, 'Invalid company RUC provided. Please check the input values.', 1;
        END

        BEGIN TRANSACTION;

        INSERT INTO TiempoCredito([gestion], [descripcion], [diasCredito], [numeroCuota], [entrada], [estado], [fechaRegistro], [idUsuario], [idEntidad], [tipo], [fromMobile])

        SELECT [gestion], [descripcion], [diasCredito], [numeroCuota], [entrada], [estado], [fechaRegistro], [idUsuario], @companyDestinoId, [tipo], [fromMobile]

        FROM dbo.TiempoCredito tc
        WHERE idEntidad = @companyOrigenId
            AND estado = 1
            AND NOT EXISTS (
              SELECT 1 FROM dbo.TiempoCredito WITH (NOLOCK)
              WHERE descripcion = tc.descripcion AND idEntidad = @companyDestinoId
          );

        SET @tiemposCreditoCopied = @@ROWCOUNT

        -- Copy Customers
        INSERT INTO dbo.Cliente(
            [idTipoClienteProveedor], [idTipoEntidad], [idSubContribuyente], [idTiempoCredito],
            [idTipoIdentificacion], [idCiudad], [montoCredito], [direccion], [telefono],
            [correo], [estado], [consumidorFinal], [fechaRegistro], [idUsuario],
            [idEntidad], [idEmpleado], [idEmpresa], [idCargo], [placa], [nota],
            [importacion], [CustomerId], [FormaPagoSriId], [infoCrediticia],
            [UpdatedByUserId], [UpdatedAt], [configValorBruto]
        )
        SELECT 
            [idTipoClienteProveedor], [idTipoEntidad], [idSubContribuyente], (SELECT tcn.idTiempoCredito FROM dbo.TiempoCredito tcn 
                                                                                                            WHERE tcn.idEntidad = @companyDestinoId 
                                                                                                            AND tcn.descripcion = tco.descripcion),
            [idTipoIdentificacion], [idCiudad], [montoCredito], [direccion], [telefono],
            [correo], c.[estado], [consumidorFinal], c.[fechaRegistro], c.[idUsuario],
            @companyDestinoId, [idEmpleado], [idEmpresa], [idCargo], [placa], [nota],
            [importacion], [CustomerId], [FormaPagoSriId], [infoCrediticia],
            [UpdatedByUserId], [UpdatedAt], [configValorBruto]
        FROM dbo.Cliente c WITH (NOLOCK)
            LEFT JOIN TiempoCredito tco ON c.idTiempoCredito = tco.idTiempoCredito
        WHERE c.idEntidad = @companyOrigenId
          AND c.estado = CAST(1 AS BIT)
          AND NOT EXISTS (
              SELECT 1 FROM dbo.Cliente WITH (NOLOCK)
              WHERE CustomerId = c.CustomerId AND idEntidad = @companyDestinoId
          );

        SET @customersCopied = @@ROWCOUNT;

        -- Copy Suppliers (if applicable)
        IF (@copySuppliers = CAST(1 AS BIT))
        BEGIN
            INSERT INTO dbo.Proveedor(
                [idTipoIdentificacion], [idTipoClienteProveedor], [idTipoEntidad],
                [idSubContribuyente], [idTiempoCredito], [idCiudad], [direccion], 
                [telefono], [correo], [estado], [fechaRegistro], [idUsuario],
                [idEntidad], [importacion], [CustomerId], [UpdatedByUserId], [UpdatedAt]
            )
            SELECT 
                [idTipoIdentificacion], [idTipoClienteProveedor], [idTipoEntidad],
                [idSubContribuyente], (SELECT tcn.idTiempoCredito FROM dbo.TiempoCredito tcn 
                                                                                                            WHERE tcn.idEntidad = @companyDestinoId 
                                                                                                            AND tcn.descripcion = tco.descripcion), [idCiudad], [direccion], 
                [telefono], [correo], p.[estado], p.[fechaRegistro], p.[idUsuario],
                @companyDestinoId, [importacion], [CustomerId], [UpdatedByUserId], [UpdatedAt]
            FROM dbo.Proveedor p WITH (NOLOCK)
                        LEFT JOIN TiempoCredito tco ON p.idTiempoCredito = tco.idTiempoCredito

            WHERE p.idEntidad = @companyOrigenId
              AND p.estado = CAST(1 AS BIT)
              AND NOT EXISTS (
                  SELECT 1 FROM dbo.Proveedor WITH (NOLOCK)
                  WHERE CustomerId = p.CustomerId AND idEntidad = @companyDestinoId
              );

            SET @suppliersCopied = @@ROWCOUNT;
        END

        COMMIT TRANSACTION;

        -- Return success message
        SELECT 
            'Successful' AS Status,
            @tiemposCreditoCopied AS TiemposCreditoCopied,
            @customersCopied AS CustomersCopied,
            @suppliersCopied AS SuppliersCopied;
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of error
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRANSACTION;

        -- Log error details
        INSERT INTO dbo.ErroresSistema(
            [method], [errorNumber], [errorSeverity], [errorState], 
            [errorProcedure], [errorLine], [errorMessage]
        )
        VALUES (
            'Copy customers and suppliers', 
            ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), 
            ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE()
        );

        -- Re-throw the error for external handling
        THROW;
    END CATCH
END
GO

