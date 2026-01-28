USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      Ivan Paz
-- Create date: 2024-12-17
-- Description: SP para insertar notificaciones y enviar correos
-- =============================================
CREATE OR ALTER PROCEDURE Common.Notification_Insert
    @userRoleId INT,
    @json VARCHAR(MAX),
    @fromMobile BIT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    DECLARE @idUsuario INT,
            @idEntidad INT;

    DECLARE @codDoc VARCHAR(6),
            @codigo VARCHAR(5),
            @id INT,
            @receptor VARCHAR(254),
            @params NVARCHAR(MAX),
            @subject VARCHAR(500);

    DECLARE @notificationId INT,
            @notificationTypeId INT,
            @emailSenderConfigId INT,
            @priorityId INT,
            @statusId INT;

    DECLARE @body VARCHAR(MAX),
            @template VARCHAR(50) = 'ReporteGenerado.html',
            @cc VARCHAR(100);

    BEGIN TRY
        -- Obtener configuración básica
        SELECT TOP 1
            @notificationTypeId = Id
        FROM Common.NotificationType
        WHERE Code = 'E';

        SELECT @priorityId = Id FROM Common.[Priority] WHERE Code = 'H';
        SELECT @statusId   = Id FROM Common.[Status]   WHERE Code = 'Q';

        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario
        FROM App.UsuarioRol WITH (NOLOCK)
        WHERE idUsuarioRol = @userRoleId;

        -- Selección de configuración de correo
        SELECT TOP 1 @emailSenderConfigId = Id
        FROM Config.EmailSenderConfig
        WHERE (CompanyId = @idEntidad OR (IsGlobal = 1 AND IsActive = 1))
        ORDER BY CASE WHEN CompanyId = @idEntidad THEN 0 ELSE 1 END;

        IF (@emailSenderConfigId IS NULL OR @emailSenderConfigId = 0)
        BEGIN
            SELECT '0' code, 'No existe una configuración para el envío de correo' AS message;
            RETURN;
        END

        -- Obtener y validar datos del JSON
        SELECT
            @codDoc  = js.codDoc,
            @codigo  = js.codigo,
            @id      = js.id,
            @receptor = js.receptor,
            @params  = js.params,
            @subject = js.subjectJson
        FROM OPENJSON(@json)
        WITH (
            codDoc            VARCHAR(6)    '$.codDoc',
            codigo            VARCHAR(5)    '$.params.reportParams.codigo',
            id                INT           '$.params.spParams.id',
            receptor          VARCHAR(254)  '$.receptor',
            params            NVARCHAR(MAX) '$.params' AS JSON,
            subjectJson       VARCHAR(500)  '$.subject'
        ) AS js;

        -- Validaciones obligatorias
        --IF @codDoc IS NULL OR LTRIM(RTRIM(@codDoc)) = ''
        --BEGIN
        --    SELECT '0' code, 'El campo "codDoc" es obligatorio' AS message;
        --    RETURN;
        --END

        --IF @codigo IS NULL OR LTRIM(RTRIM(@codigo)) = ''
        --BEGIN
        --    SELECT '0' code, 'El campo "codigo" es obligatorio' AS message;
        --    RETURN;
        --END

        IF @params IS NULL OR LTRIM(RTRIM(@params)) = ''
        BEGIN
            SELECT '0' code, 'El campo "params" es obligatorio' AS message;
            RETURN;
        END

        -- Validar existencia de ID si el código lo requiere
        IF @codigo IN ('PR', 'RNE', 'CI') AND (@id IS NULL OR @id <= 0)
        BEGIN
            SELECT '0' code, 'El campo "params.spParams.id" es obligatorio y debe ser mayor a 0 para el tipo ' + @codigo AS message;
            RETURN;
        END

        -- Validar receptor si no es tipo "automático"
        IF @codigo NOT IN ('RCC', 'FG', 'CDA', 'CDAA') AND (@receptor IS NULL OR LTRIM(RTRIM(@receptor)) = '')
        BEGIN
            SELECT '0' code, 'El campo "receptor" es obligatorio para el tipo ' + @codigo AS message;
            RETURN;
        END
        -- Casos por tipo de código
        IF @codigo IN ('RCC', 'FG', 'CDA', 'CDAA')
        BEGIN
            SELECT @receptor = STRING_AGG(TRIM(correo), '|')
            FROM (
                SELECT DISTINCT correo
                FROM Sri.Establecimiento
                WHERE estado = 1 AND idEntidad = @idEntidad AND NULLIF(TRIM(correo), '') IS NOT NULL
            ) AS sub;

            SET @body = (
                SELECT
                    dbo.AFTConvertDate(dbo.ufnGetDateEcuador()) + dbo.AFTConvertHora(dbo.ufnGetDateEcuador()) AS fechaEmision,
                    ISNULL(en.telefono, '') AS telefono,
                    en.razonSocial,
                    @subject AS title
                FROM dbo.Entidad en
                WHERE idEntidad = @idEntidad
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            );
        END
        ELSE IF @codigo = 'PR' -- Proforma
        BEGIN
            IF @id IS NULL
            BEGIN
                SELECT '0' code, 'Id No Válido para Proforma' AS message;
                RETURN;
            END

            SET @body = (
                SELECT
                    cu.BusinessName AS cliente,
                    dbo.AFTGenerarNroDocumento(es.estab + pe.ptoEmi, pr.nroDocumento) AS documento,
                    dbo.AFTConvertDate(pr.fechaEmision) + dbo.AFTConvertHora(pr.fechaEmision) AS fechaEmision,
                    CAST(pr.total AS NUMERIC(18,2)) AS importeTotal,
                    ISNULL(es.telefono, '') AS telefono,
                    en.razonSocial
                FROM dbo.Proforma pr
                INNER JOIN dbo.Cliente cl ON cl.idCliente = pr.idCliente
                INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = pr.idPuntoEmision
                INNER JOIN dbo.Entidad en ON en.idEntidad = pr.idEntidad
                INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
                INNER JOIN Customer.Customer cu ON cu.Id = cl.CustomerId
                WHERE pr.idProforma = @id
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            );
        END
        ELSE IF @codigo = 'RNE' -- Nota de Entrega
        BEGIN
            IF @id IS NULL
            BEGIN
                SELECT '0' code, 'Id No Válido para Nota de Entrega' AS message;
                RETURN;
            END

            SET @body = (
                SELECT
                    cu.BusinessName AS cliente,
                    dbo.AFTGenerarNroDocumento(es.estab + pe.ptoEmi, ne.nroDocumento) AS documento,
                    dbo.AFTConvertDate(ne.fechaEmision) + dbo.AFTConvertHora(ne.fechaEmision) AS fechaEmision,
                    CAST(ne.total AS NUMERIC(18,2)) AS importeTotal,
                    ISNULL(es.telefono, '') AS telefono,
                    en.razonSocial
                FROM dbo.NotaEntrega ne
                INNER JOIN dbo.Cliente cl ON cl.idCliente = ne.idCliente
                INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = ne.idPuntoEmision
                INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
                INNER JOIN dbo.Entidad en ON en.idEntidad = ne.idEntidad
                INNER JOIN Customer.Customer cu ON cu.Id = cl.CustomerId
                WHERE ne.idNotaEntrega = @id
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            );
        END
        ELSE IF @codDoc = 'CI' -- Comprobante de Ingreso
        BEGIN
            SET @template = 'EmailCompIngreso.html';

            SET @body = (
                SELECT
                    cu.BusinessName AS cliente,
                    'CI-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) AS documento,
                    dbo.AFTConvertDate(ci.fechaRegistro) + '''' + dbo.AFTConvertHora(ci.fechaRegistro) AS fechaEmision,
                    ci.total AS importeTotal,
                    ISNULL(es.telefono, '') AS telefono,
                    es.nombreComercial AS razonSocial
                FROM dbo.ComprobanteIngreso ci
                INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = ci.idEstablecimiento
                INNER JOIN Customer.Customer cu ON cu.Id = ci.CustomerId
                WHERE ci.idComprobanteIngreso = @id
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            );
        END

        BEGIN TRAN

        INSERT INTO Common.Notification (NotificationTypeId, CompressedParameters, Title, Subject, CreatedByUserId, FromMobile)
        VALUES (@notificationTypeId, COMPRESS(CONVERT(VARCHAR(MAX), ISNULL(@params, '{}'))), 'Envio por correo', @subject, @idUsuario, @fromMobile);

        SET @notificationId = SCOPE_IDENTITY();

        INSERT INTO Common.EmailQueue (
            NotificationId, EmailSenderConfigId, RecipientEmail, Cc, Subject,
            IsHtml, CompressedBody, PriorityId, StatusId, Template, CreatedByUserId, FromMobile
        )
        VALUES (
            @notificationId, @emailSenderConfigId, @receptor, @cc, @subject,
            CAST(0 AS BIT), COMPRESS(@body), @priorityId, @statusId, @template, @idUsuario, @fromMobile
        );

        COMMIT TRAN;

        SELECT '1' code, 'Notificación Enviada Correctamente!' AS message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        INSERT INTO ErroresSistema (
            method, errorNumber, errorSeverity, errorState,
            errorProcedure, errorLine, errorMessage, idUsuario,
            additionalInfo
        )
        VALUES (
            'Notificacion/Insert', ERROR_NUMBER(), ERROR_SEVERITY(),
            ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @idUsuario,
            N'{' +
            N'"userRoleId": ' + CAST(@userRoleId AS NVARCHAR) + N',' +
            N'"params": ' + @json + N'}'
        );

        SELECT '0' code, 'Info: Error en el procedimiento!' AS message;
    END CATCH
END
GO
