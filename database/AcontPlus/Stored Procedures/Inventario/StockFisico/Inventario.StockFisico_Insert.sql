USE ACONTPLUS
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-07-23
-- Description:	SP FOR INSERT STOCK FISICOS
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.StockFisico_Insert
    @userRoleId INT,
    @json NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @codEstab VARCHAR(15)
    ,@secuencial INT
    ,@fecha DATETIME2
    ,@responsable VARCHAR(300)
    ,@obs VARCHAR(500)
    ,@fechaRevision DATETIME2
    ,@userId INT
    ,@puntoEmisionId INT
    ,@serieDocumento VARCHAR(18)
    ,@header NVARCHAR(MAX)
    ,@detailsJson NVARCHAR(MAX)

    IF (ISJSON(@json) = 1)
    BEGIN
        SELECT @header = header
            , @detailsJson = stockFisicoDetalles
        FROM OPENJSON(@json)
        WITH ( 
                header NVARCHAR(MAX) '$.header' AS JSON,
                stockFisicoDetalles NVARCHAR(MAX) '$.stockFisicoDetalles' AS JSON
            )
    END
ELSE
    BEGIN
        SELECT response = (SELECT code = '0', [message]= 'Data Invalida'
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        RETURN
    END

    IF (ISJSON(@header) = 1)
    BEGIN
        SELECT @codEstab = codEstab
            , @secuencial = secuencial
            , @fecha = fecha
            , @responsable = responsable
            , @obs = obs
            , @puntoEmisionId = puntoEmisionId
            , @serieDocumento = serieDocumento
        FROM OPENJSON(@header)
        WITH (
                codEstab VARCHAR(15) '$.codEstab',
                secuencial INT '$.secuencial',
                fecha DATETIME2 '$.fecha',
                responsable VARCHAR(300) '$.responsable',
                obs VARCHAR(500) '$.obs',
                puntoEmisionId INT '$.puntoEmisionId',
                serieDocumento VARCHAR(18) '$.serieDocumento'
            )
    END

    DECLARE @details AS TABLE (
        BodegaId INT NOT NULL,
        ArticuloId INT NOT NULL,
        CantidadContada NUMERIC(18,5),
        StockActual NUMERIC(18,5),
        Discrepancia NUMERIC(18,5),
        MotivoDiscrepanciaId VARCHAR(10),
        OtroMotivo VARCHAR(300)
   )

    IF (ISJSON(@detailsJson) = 0)
   BEGIN
        SELECT response = (SELECT code = '0', [message]= 'No se encontraron detalles'
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        RETURN
    END

    INSERT INTO @details
        (BodegaId, ArticuloId, CantidadContada, StockActual, Discrepancia, MotivoDiscrepanciaId, OtroMotivo)
    SELECT BodegaId, ArticuloId, CantidadContada, StockActual, Discrepancia, MotivoDiscrepanciaId, OtroMotivo
    FROM OPENJSON(@detailsJson) WITH(
        BodegaId INT '$.bodegaId',
        ArticuloId INT '$.articuloId',
        CantidadContada NUMERIC(18,5) '$.cantidadContada',
        StockActual NUMERIC(18,5) '$.stockActual',
        Discrepancia NUMERIC(18,5) '$.discrepancia',
        MotivoDiscrepanciaId  VARCHAR(10) '$.motivoDiscrepanciaId',
        OtroMotivo VARCHAR(300) '$.otroMotivo'
   )

    IF (SELECT COUNT(*)
    FROM @details) = 0
        BEGIN
        SELECT response = (SELECT code = '0', [message]= 'No se pudo leer los detalles'
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        RETURN
    END

    SET @userId = (SELECT idUsuario
    FROM v_usuario
    WHERE idUsuarioRol = @userRoleId)

    BEGIN TRY
        BEGIN TRAN
            DECLARE @id INT

            INSERT INTO Inventario.StockFisico
        (CodEstab, Secuencial, Fecha, Responsable, Obs, UserId, [Enabled], PuntoEmisionId, SerieDocumento)
    VALUES(@codEstab, @secuencial, @fecha, @responsable, @obs, @userId, 1, @puntoEmisionId, @serieDocumento)
                    SET @id = (SELECT SCOPE_IDENTITY())
                    
    IF (@id > 0)
    BEGIN
        INSERT INTO Inventario.StockFisicoDetalle
            (StockFisicoId, BodegaId, ArticuloId, CantidadContada, StockActual, Discrepancia, MotivoDiscrepanciaId, OtroMotivo, [Enabled])
        SELECT @id, BodegaId, ArticuloId, CantidadContada, StockActual, Discrepancia, CONVERT(INT, MotivoDiscrepanciaId), OtroMotivo, 1
        FROM @details
    END

    COMMIT TRAN

        IF NOT EXISTS(SELECT 1
    FROM Inventario.StockFisicoDetalle
    WHERE StockFisicoId = @id)
        BEGIN
        ROLLBACK TRAN
    END
    ELSE
    BEGIN
        UPDATE cd SET cd.ultimaSecuencia = cdd.ultimaSecuencia + 1
        FROM ConfiguracionDocumento cd
            JOIN (
            SELECT idTipoDocumento, ultimaSecuencia, codDoc
            FROM v_ConfigDocumento
        ) AS cdd ON cd.idTipoDocumento = cdd.idTipoDocumento
        WHERE cdd.codDoc = 'TF'
    END

        SELECT response = (SELECT code = '1', [message] = 'Ingresado correctamente'
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )

    END TRY
    BEGIN CATCH
        SELECT response = (SELECT code = '0', [message] = 'Error al registrar en base de datos' + ERROR_Message()
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )
        IF (@@TRANCOUNT > 0)
            BEGIN
        ROLLBACK TRAN
    END
        INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, idUsuario)
    VALUES(NEWID(), 'StockFisico/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId)
    END CATCH
END
GO
