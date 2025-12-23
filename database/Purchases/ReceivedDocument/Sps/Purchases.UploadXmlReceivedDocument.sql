USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz (Consolidated by GitHub Copilot)
-- Create date: 2025-12-23
-- Description:	Consolidated SP for uploading XML received documents from SRI
--              Combines logic from Doc_Serv_Update and Documento_Upload_Xml
-- =============================================
CREATE OR ALTER PROCEDURE Purchases.UploadXmlReceivedDocument
    @UserRoleId INT
    ,@XmlContent XML
    ,@EstablishmentId INT
    ,@SubcategoryId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    -- Variables: XML Processing
    DECLARE @XmlQuery XML
        ,@XmlCompressed VARBINARY(MAX)
        ,@FechaAutorizacion DATETIME2
        ,@FechaEmision DATETIME2
        ,@ClaveAcceso VARCHAR(49)
        ,@VersionComp VARCHAR(5)
        ,@CodDoc VARCHAR(2);

    -- Variables: Document Information
    DECLARE @SerieComprobante VARCHAR(50)
        ,@ImporteTotal NUMERIC(18,5)
        ,@Comprobante VARCHAR(100)
        ,@RucEmisor VARCHAR(13)
        ,@RazonSocialEmisor VARCHAR(300)
        ,@NombreComercial VARCHAR(300)
        ,@DirMatriz VARCHAR(300)
        ,@RucReceptor VARCHAR(25)
        ,@IdentificacionReceptor VARCHAR(25);

    -- Variables: Entity & User
    DECLARE @IdUsuario INT
        ,@IdEntidad INT
        ,@CustomerId INT
        ,@IdTypeId INT
        ,@IdProveedor INT
        ,@IdCliente INT
        ,@IdEstadoPago INT
        ,@IdDocumento INT;

    -- Variables: Error handling
    DECLARE @ErrorMessage NVARCHAR(4000);

    -- Temp table for parsed document data
    DECLARE @tbDocumento TABLE (
        razonSocialEmisior VARCHAR(300) NOT NULL,
        nombreComercial VARCHAR(300) NULL,
        rucEmisor VARCHAR(13) NOT NULL,
        dirMatriz VARCHAR(300) NOT NULL,
        estab VARCHAR(25) NOT NULL,
        comprobante VARCHAR(50) NOT NULL,
        ptoEmi VARCHAR(25) NOT NULL,
        secuencial VARCHAR(25) NOT NULL,
        identificacionReceptor VARCHAR(300) NOT NULL,
        importeTotal NUMERIC(18,5) NOT NULL DEFAULT 0,
        serieComprobante AS estab + '-' + ptoEmi + '-' + secuencial
    );

    BEGIN TRY
        -- =============================================
        -- 1. EXTRACT USER & ENTITY INFORMATION
        -- =============================================
        SELECT TOP 1 
            @IdUsuario = idUsuario,
            @IdEntidad = idEntidad 
        FROM App.UsuarioRol WITH (NOLOCK)   
        WHERE idUsuarioRol = @UserRoleId;

        IF @IdUsuario IS NULL
        BEGIN
            SET @ErrorMessage = 'Usuario no encontrado';
            THROW 50001, @ErrorMessage, 1;
        END

        -- Get receptor RUC
        SELECT TOP 1 @RucReceptor = ruc 
        FROM Entidad WITH (NOLOCK) 
        WHERE idEntidad = @IdEntidad;

        -- =============================================
        -- 2. PARSE XML CONTENT
        -- =============================================
        -- Extract main document from authorization wrapper
        SELECT @XmlQuery = CONVERT(XML, dbo.f_sanitize_xml(
            CONVERT(VARCHAR(MAX), @XmlContent.query('/autorizacion/comprobante'))
        ));

        -- Extract authorization metadata
        SELECT @FechaAutorizacion = @XmlContent.value(
            '(/autorizacion/fechaAutorizacion)[1]', 'DATETIME2'
        );

        SELECT @ClaveAcceso = @XmlContent.value(
            '(/autorizacion/claveAcceso)[1]', 'VARCHAR(49)'
        );

        -- Extract document type from claveAcceso (positions 9-10)
        SET @CodDoc = SUBSTRING(@ClaveAcceso, 9, 2);

        -- Compress XML for storage
        SELECT @XmlCompressed = COMPRESS(CONVERT(VARBINARY(MAX), @XmlContent));

        -- =============================================
        -- 3. VALIDATE DOCUMENT DOESN'T EXIST
        -- =============================================
        IF EXISTS (
            SELECT 1 
            FROM Recepcion.DocumentoRecibido WITH (NOLOCK) 
            WHERE claveAcceso = @ClaveAcceso
        )
        BEGIN
            SET @ErrorMessage = 'El comprobante ya se encuentra importado';
            THROW 50001, @ErrorMessage, 1;
        END

        -- =============================================
        -- 4. PARSE DOCUMENT BY TYPE
        -- =============================================
        
        -- FACTURA (01)
        IF @CodDoc = '01'
        BEGIN
            INSERT INTO @tbDocumento (
                razonSocialEmisior, nombreComercial, rucEmisor, dirMatriz,
                estab, ptoEmi, secuencial, identificacionReceptor, importeTotal, comprobante
            )
            SELECT 
                x.y.value('(infoTributaria/razonSocial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/nombreComercial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/ruc)[1]', 'VARCHAR(13)'),
                x.y.value('(infoTributaria/dirMatriz)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/estab)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/ptoEmi)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/secuencial)[1]', 'VARCHAR(25)'),
                x.y.value('(infoFactura/identificacionComprador)[1]', 'VARCHAR(300)'),
                x.y.value('(infoFactura/importeTotal)[1]', 'NUMERIC(18,5)'),
                'Factura'
            FROM @XmlQuery.nodes('//factura') x(y);

            SELECT @FechaEmision = x.y.value('(infoFactura/fechaEmision)[1]', 'DATETIME2')
            FROM @XmlQuery.nodes('//factura') x(y);

            SELECT @VersionComp = x.y.value('(@version)[1]', 'VARCHAR(5)')
            FROM @XmlQuery.nodes('//factura') x(y);
        END

        -- LIQUIDACION DE COMPRA (03)
        IF @CodDoc = '03'
        BEGIN
            INSERT INTO @tbDocumento (
                razonSocialEmisior, nombreComercial, rucEmisor, dirMatriz,
                estab, ptoEmi, secuencial, identificacionReceptor, importeTotal, comprobante
            )
            SELECT 
                x.y.value('(infoTributaria/razonSocial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/nombreComercial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/ruc)[1]', 'VARCHAR(13)'),
                x.y.value('(infoTributaria/dirMatriz)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/estab)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/ptoEmi)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/secuencial)[1]', 'VARCHAR(25)'),
                x.y.value('(infoLiquidacionCompra/identificacionProveedor)[1]', 'VARCHAR(300)'),
                x.y.value('(infoLiquidacionCompra/importeTotal)[1]', 'NUMERIC(18,5)'),
                'Liquidación de Compra'
            FROM @XmlQuery.nodes('//liquidacionCompra') x(y);

            SELECT @FechaEmision = x.y.value('(infoLiquidacionCompra/fechaEmision)[1]', 'DATETIME2')
            FROM @XmlQuery.nodes('//liquidacionCompra') x(y);

            SELECT @VersionComp = x.y.value('(@version)[1]', 'VARCHAR(5)')
            FROM @XmlQuery.nodes('//liquidacionCompra') x(y);
        END

        -- NOTA DE CREDITO (04)
        IF @CodDoc = '04'
        BEGIN
            INSERT INTO @tbDocumento (
                razonSocialEmisior, nombreComercial, rucEmisor, dirMatriz,
                estab, ptoEmi, secuencial, identificacionReceptor, importeTotal, comprobante
            )
            SELECT 
                x.y.value('(infoTributaria/razonSocial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/nombreComercial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/ruc)[1]', 'VARCHAR(13)'),
                x.y.value('(infoTributaria/dirMatriz)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/estab)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/ptoEmi)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/secuencial)[1]', 'VARCHAR(25)'),
                x.y.value('(infoNotaCredito/identificacionComprador)[1]', 'VARCHAR(300)'),
                x.y.value('(infoNotaCredito/valorModificacion)[1]', 'NUMERIC(18,5)'),
                'Nota de Crédito'
            FROM @XmlQuery.nodes('//notaCredito') x(y);

            SELECT @FechaEmision = x.y.value('(infoNotaCredito/fechaEmision)[1]', 'DATETIME2')
            FROM @XmlQuery.nodes('//notaCredito') x(y);

            SELECT @VersionComp = x.y.value('(@version)[1]', 'VARCHAR(5)')
            FROM @XmlQuery.nodes('//notaCredito') x(y);
        END

        -- NOTA DE DEBITO (05)
        IF @CodDoc = '05'
        BEGIN
            INSERT INTO @tbDocumento (
                razonSocialEmisior, nombreComercial, rucEmisor, dirMatriz,
                estab, ptoEmi, secuencial, identificacionReceptor, importeTotal, comprobante
            )
            SELECT 
                x.y.value('(infoTributaria/razonSocial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/nombreComercial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/ruc)[1]', 'VARCHAR(13)'),
                x.y.value('(infoTributaria/dirMatriz)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/estab)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/ptoEmi)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/secuencial)[1]', 'VARCHAR(25)'),
                x.y.value('(infoNotaDebito/identificacionComprador)[1]', 'VARCHAR(300)'),
                x.y.value('(infoNotaDebito/valorTotal)[1]', 'NUMERIC(18,5)'),
                'Nota de Débito'
            FROM @XmlQuery.nodes('//notaDebito') x(y);

            SELECT @FechaEmision = x.y.value('(infoNotaDebito/fechaEmision)[1]', 'DATETIME2')
            FROM @XmlQuery.nodes('//notaDebito') x(y);

            SELECT @VersionComp = x.y.value('(@version)[1]', 'VARCHAR(5)')
            FROM @XmlQuery.nodes('//notaDebito') x(y);
        END

        -- GUIA DE REMISION (06)
        IF @CodDoc = '06'
        BEGIN
            INSERT INTO @tbDocumento (
                razonSocialEmisior, nombreComercial, rucEmisor, dirMatriz,
                estab, ptoEmi, secuencial, identificacionReceptor, importeTotal, comprobante
            )
            SELECT 
                x.y.value('(infoTributaria/razonSocial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/nombreComercial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/ruc)[1]', 'VARCHAR(13)'),
                x.y.value('(infoTributaria/dirMatriz)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/estab)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/ptoEmi)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/secuencial)[1]', 'VARCHAR(25)'),
                x.y.value('(infoGuiaRemision/identificacionDestinatario)[1]', 'VARCHAR(300)'),
                0,
                'Guía de Remisión'
            FROM @XmlQuery.nodes('//guiaRemision') x(y);

            SELECT @FechaEmision = x.y.value('(infoGuiaRemision/fechaIniTransporte)[1]', 'DATETIME2')
            FROM @XmlQuery.nodes('//guiaRemision') x(y);

            SELECT @VersionComp = x.y.value('(@version)[1]', 'VARCHAR(5)')
            FROM @XmlQuery.nodes('//guiaRemision') x(y);
        END

        -- COMPROBANTE DE RETENCION (07)
        IF @CodDoc = '07'
        BEGIN
            INSERT INTO @tbDocumento (
                razonSocialEmisior, nombreComercial, rucEmisor, dirMatriz,
                estab, ptoEmi, secuencial, identificacionReceptor, importeTotal, comprobante
            )
            SELECT 
                x.y.value('(infoTributaria/razonSocial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/nombreComercial)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/ruc)[1]', 'VARCHAR(13)'),
                x.y.value('(infoTributaria/dirMatriz)[1]', 'VARCHAR(300)'),
                x.y.value('(infoTributaria/estab)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/ptoEmi)[1]', 'VARCHAR(25)'),
                x.y.value('(infoTributaria/secuencial)[1]', 'VARCHAR(25)'),
                x.y.value('(infoCompRetencion/identificacionSujetoRetenido)[1]', 'VARCHAR(300)'),
                0,
                'Comprobante de Retención'
            FROM @XmlQuery.nodes('//comprobanteRetencion') x(y);

            SELECT @FechaEmision = x.y.value('(infoCompRetencion/fechaEmision)[1]', 'DATETIME2')
            FROM @XmlQuery.nodes('//comprobanteRetencion') x(y);

            SELECT @VersionComp = x.y.value('(@version)[1]', 'VARCHAR(5)')
            FROM @XmlQuery.nodes('//comprobanteRetencion') x(y);

            -- Calculate retention total based on version
            IF @VersionComp = '2.0.0'
            BEGIN
                SELECT @ImporteTotal = SUM(T.C.value('(valorRetenido)[1]', 'NUMERIC(18,5)'))
                FROM @XmlQuery.nodes('//comprobanteRetencion/docsSustento/docSustento/retenciones/retencion') AS T(C);
            END
            ELSE IF @VersionComp = '1.0.0'
            BEGIN
                SELECT @ImporteTotal = SUM(T.C.value('(valorRetenido)[1]', 'NUMERIC(18,5)'))
                FROM @XmlQuery.nodes('//comprobanteRetencion/impuestos/impuesto') AS T(C);
            END

            UPDATE @tbDocumento SET importeTotal = @ImporteTotal WHERE importeTotal = 0;
        END

        -- =============================================
        -- 5. VALIDATE DOCUMENT TYPE & PARSING
        -- =============================================
        IF @CodDoc NOT IN ('01', '03', '04', '05', '06', '07')
        BEGIN
            SET @ErrorMessage = 'Tipo de comprobante no soportado';
            THROW 50001, @ErrorMessage, 1;
        END

        IF NOT EXISTS (SELECT 1 FROM @tbDocumento)
        BEGIN
            SET @ErrorMessage = 'Error al procesar el XML del comprobante';
            THROW 50001, @ErrorMessage, 1;
        END

        -- Extract parsed values
        SELECT TOP 1
            @RucEmisor = rucEmisor,
            @RazonSocialEmisor = razonSocialEmisior,
            @NombreComercial = nombreComercial,
            @DirMatriz = dirMatriz,
            @SerieComprobante = serieComprobante,
            @ImporteTotal = ISNULL(importeTotal, @ImporteTotal),
            @IdentificacionReceptor = identificacionReceptor,
            @Comprobante = comprobante
        FROM @tbDocumento;

        -- =============================================
        -- 6. VALIDATE RECEPTOR MATCHES
        -- =============================================
        -- Add '001' suffix for RUC if cedula (10 digits)
        SET @IdentificacionReceptor = @IdentificacionReceptor + 
            IIF(LEN(@IdentificacionReceptor) = 10, '001', '');

        IF @RucReceptor != @IdentificacionReceptor
        BEGIN
            SET @ErrorMessage = 'El comprobante no pertenece al Contribuyente: ' + @RucReceptor;
            THROW 50001, @ErrorMessage, 1;
        END

        -- =============================================
        -- 7. BEGIN TRANSACTION
        -- =============================================
        BEGIN TRAN;

            -- Get or Create Customer
            IF NOT EXISTS (
                SELECT 1 
                FROM Customer.Customer WITH (NOLOCK) 
                WHERE IDCard = LTRIM(RTRIM(@RucEmisor))
            )
            BEGIN
                SELECT TOP 1 @IdTypeId = idTipoIdentificacion 
                FROM TipoIdentificacion WITH (NOLOCK) 
                WHERE codigoSri = '04';

                INSERT INTO Customer.Customer WITH (ROWLOCK) (
                    IdTypeId, IDCard, BusinessName, TradeName, [Address], SriValidation
                )
                VALUES (
                    @IdTypeId,
                    LTRIM(RTRIM(@RucEmisor)),
                    LTRIM(RTRIM(@RazonSocialEmisor)),
                    LTRIM(RTRIM(@NombreComercial)),
                    LTRIM(RTRIM(@DirMatriz)),
                    1
                );

                SET @CustomerId = SCOPE_IDENTITY();
            END
            ELSE
            BEGIN
                SELECT TOP 1 @CustomerId = ID 
                FROM Customer.Customer WITH (NOLOCK) 
                WHERE IDCard = LTRIM(RTRIM(@RucEmisor));
            END

            -- =============================================
            -- 8. INSERT RECEIVED DOCUMENT
            -- =============================================
            INSERT INTO Recepcion.DocumentoRecibido (
                idEstablecimiento,
                serieComprobante,
                fechaEmision,
                fechaAutorizacion,
                claveAcceso,
                importeTotal,
                versionComp,
                downloaded,
                complete,
                idUsuario,
                xmlCompressed,
                estado,
                customerId,
                idTipoDocumento,
                obs
            )
            VALUES (
                @EstablishmentId,
                @SerieComprobante,
                @FechaEmision,
                @FechaAutorizacion,
                @ClaveAcceso,
                @ImporteTotal,
                @VersionComp,
                'DE', -- Downloaded from External
                0,    -- Not complete yet
                @IdUsuario,
                @XmlCompressed,
                1,    -- Active
                @CustomerId,
                CAST(@CodDoc AS BIGINT),
                'Subcategory: ' + CAST(@SubcategoryId AS VARCHAR(10)) + ' | Tipo: ' + @Comprobante
            );

            SET @IdDocumento = SCOPE_IDENTITY();

            -- =============================================
            -- 9. ACCOUNTING ENTRIES - ACCOUNTS PAYABLE
            -- =============================================
            IF @CodDoc IN ('01', '03', '04', '05')
            BEGIN
                -- Get or Create Supplier
                IF NOT EXISTS (
                    SELECT 1 
                    FROM dbo.Proveedor WITH (NOLOCK) 
                    WHERE idEntidad = @IdEntidad AND CustomerId = @CustomerId
                )
                BEGIN
                    INSERT INTO dbo.Proveedor WITH (ROWLOCK) (
                        direccion, idEntidad, CustomerId
                    )
                    VALUES (@DirMatriz, @IdEntidad, @CustomerId);

                    SET @IdProveedor = SCOPE_IDENTITY();
                END
                ELSE
                BEGIN
                    SELECT TOP 1 @IdProveedor = idProveedor 
                    FROM dbo.Proveedor WITH (NOLOCK)
                    WHERE idEntidad = @IdEntidad AND CustomerId = @CustomerId;
                END

                -- Get payment status
                SELECT TOP 1 @IdEstadoPago = idEstadoPago 
                FROM dbo.EstadoPago WITH (NOLOCK) 
                WHERE codigo = 'PE';

                -- Create Account Payable
                --IF NOT EXISTS (
                --    SELECT 1 
                --    FROM Contabilidad.CuentaPorPagar WITH (NOLOCK) 
                --    WHERE uniqueId = @ClaveAcceso
                --)
                --BEGIN
                --    INSERT INTO Contabilidad.CuentaPorPagar (
                --        idDocumento,
                --        idEstablecimiento,
                --        idProveedor,
                --        idEstadoPago,
                --        codDoc,
                --        uniqueId,
                --        serieComprobante,
                --        fechaEmision,
                --        importeTotal,
                --        idUsuario,
                --        subcategoryId
                --    )
                --    VALUES (
                --        @IdDocumento,
                --        @EstablishmentId,
                --        @IdProveedor,
                --        @IdEstadoPago,
                --        @CodDoc,
                --        @ClaveAcceso,
                --        @SerieComprobante,
                --        @FechaEmision,
                --        @ImporteTotal,
                --        @IdUsuario,
                --        @SubcategoryId
                --    );
                --END
            END

            -- =============================================
            -- 10. ACCOUNTING ENTRIES - ACCOUNTS RECEIVABLE
            -- =============================================
            IF @CodDoc = '07'
            BEGIN
                -- Get or Create Client
                IF NOT EXISTS (
                    SELECT 1 
                    FROM dbo.Cliente WITH (NOLOCK) 
                    WHERE idEntidad = @IdEntidad AND CustomerId = @CustomerId
                )
                BEGIN
                    INSERT INTO dbo.Cliente WITH (ROWLOCK) (
                        direccion, idEntidad, CustomerId
                    )
                    VALUES (@DirMatriz, @IdEntidad, @CustomerId);

                    SET @IdCliente = SCOPE_IDENTITY();
                END
                ELSE
                BEGIN
                    SELECT TOP 1 @IdCliente = idCliente 
                    FROM dbo.Cliente WITH (NOLOCK)
                    WHERE idEntidad = @IdEntidad AND CustomerId = @CustomerId;
                END

                -- Get payment status
                SELECT TOP 1 @IdEstadoPago = idEstadoPago 
                FROM dbo.EstadoPago WITH (NOLOCK) 
                WHERE codigo = 'PE';

                -- Extract sequential number
                DECLARE @Secuencial INT;
                SET @Secuencial = CAST(RIGHT(@SerieComprobante, 
                    CHARINDEX('-', REVERSE(@SerieComprobante)) - 1) AS INT);

                -- Create Account Receivable
                --INSERT INTO Contabilidad.CuentaPorCobrar (
                --    idCliente,
                --    codDoc,
                --    fechaEmision,
                --    idEstadoPago,
                --    idDocumento,
                --    secuencial,
                --    serieComprobante,
                --    importeTotal,
                --    idEntidad,
                --    idUsuario,
                --    fechaRegistro
                --)
                --VALUES (
                --    @IdCliente,
                --    @CodDoc,
                --    @FechaEmision,
                --    @IdEstadoPago,
                --    @IdDocumento,
                --    @Secuencial,
                --    @SerieComprobante,
                --    @ImporteTotal,
                --    @IdEntidad,
                --    @IdUsuario,
                --    dbo.ufnGetDateEcuador()
                --);
            END

        COMMIT TRAN;

        -- Return success with code 0
        SELECT '0' AS code, 'Documento registrado exitosamente' AS message, @IdDocumento AS idDocumento;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        -- Get error details
        SET @ErrorMessage = ERROR_MESSAGE();

        -- Log error
        INSERT INTO ErroresSistema WITH (ROWLOCK) (
            token, method, errorNumber, errorSeverity, errorState, 
            errorProcedure, errorLine, errorMessage, errorDate
        )
        VALUES (
            NEWID(),
            'Purchases.UploadXmlReceivedDocument',
            ERROR_NUMBER(),
            ERROR_SEVERITY(),
            ERROR_STATE(),
            ERROR_PROCEDURE(),
            ERROR_LINE(),
            @ErrorMessage,
            dbo.ufnGetDateEcuador()
        );

        -- Re-throw error 50001 with the original message
        IF ERROR_NUMBER() = 50001
        BEGIN
            THROW;
        END
        ELSE
        BEGIN
            -- For other errors, throw as 50001
            THROW 50001, @ErrorMessage, 1;
        END
    END CATCH
END
GO
