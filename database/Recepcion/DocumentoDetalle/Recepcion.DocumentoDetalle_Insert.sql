USE AcontPlus
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      Ivan Paz
-- Create date: 2022-09-17
-- Description: SP Para insertar los detalles temporales del comprobante importado.
--              Transfiere datos de tablas temporales a definitivas (DocumentoDetalle, Impuestos).
--              Genera transacciones de inventario si corresponde.
--              Incluye validaciones de concurrencia para evitar duplicados.
-- =============================================
CREATE OR ALTER PROCEDURE Recepcion.DocumentoDetalle_Insert
    @idUsuarioRol INT,
    @idDocumento INT,
    @idArticulo INT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    DECLARE @idUsuario INT;
    DECLARE @idEntidad INT;
    DECLARE @rucProv VARCHAR(20);
    DECLARE @idProveedor INT;
    DECLARE @fechaEmision DATETIME;
    DECLARE @codDoc VARCHAR(2);
    DECLARE @CustomerId INT;
    DECLARE @serieComprobante VARCHAR(30);

    PRINT CONVERT(VARCHAR, @idArticulo);

    BEGIN TRY
        -- Get user and entity information
        SELECT TOP 1
            @idEntidad = idEntidad,
            @idUsuario = idUsuario
        FROM App.UsuarioRol WITH (NOLOCK)
        WHERE idUsuarioRol = @idUsuarioRol;

        -- Get document information
        SELECT TOP 1
            @serieComprobante = serieComprobante,
            @rucProv = rucEmisor,
            @fechaEmision = CAST(fechaEmision AS DATE),
            @codDoc = codDoc
        FROM Recepcion.DocumentoRecibido WITH (NOLOCK)
        WHERE idDocumento = @idDocumento;

        -- Get customer information
        SELECT TOP 1 @CustomerId = Id
        FROM Customer.Customer WITH (NOLOCK)
        WHERE IDCard = @rucProv;

        -- Validations
        -- 1. Verificar si existen datos en tablas temporales
        IF NOT EXISTS (SELECT 1 FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = @idDocumento)
        BEGIN
            SELECT '0' AS code, 'No existe datos para registrar' AS 'message';
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = @idDocumento AND idArticulo > 0)
        BEGIN
            SELECT '0' AS code, 'No existe ningun articulo vinculado para guardar' AS 'message';
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
        BEGIN
            SELECT '0' AS code, 'Tu empresa no lleva Inventario' AS 'message';
            RETURN;
        END

        BEGIN TRAN
            -- Insert single article
            -- Se inserta un articulo especifico si @idArticulo > 0.
            -- Se valida NOT EXISTS para evitar duplicados por doble click en frontend.
            IF @idArticulo > 0
            BEGIN
                INSERT INTO Recepcion.DocumentoDetalle
                (
                    idDocumento, idBodega, idArticulo, idMedida, codigoPrincipal, codigoAuxiliar,
                    cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto,
                    costoNeto, detallesAdicionales, impuestos, idUsuario
                )
                SELECT
                    idDocumento, t.idBodega, t.idArticulo, t.idMedida, t.codigoPrincipal, t.codigoAuxiliar,
                    cantidad, t.descripcion, precioUnitario,
                    CASE WHEN descuento IS NULL OR descuento = '' THEN 0 ELSE CAST(descuento AS NUMERIC(18,2)) END,
                    precioTotalSinImpuesto,
                    CAST((CAST(precioTotalSinImpuesto AS DECIMAL(15,5)) / CAST(cantidad AS DECIMAL(18,5))) AS NUMERIC(18,5)),
                    detallesAdicionales, impuestos, @idUsuario
                FROM Recepcion.Doc_Detalle_Temp t
                WHERE t.idDocumento = @idDocumento
                  AND t.idArticulo = @idArticulo
                  AND NOT EXISTS (SELECT 1 FROM Recepcion.DocumentoDetalle dd WHERE dd.idDocumento = t.idDocumento AND dd.idArticulo = t.idArticulo);

                INSERT INTO Recepcion.Doc_Detalle_Impuesto
                (
                    idDocumento, codigoPrincipal, codigo, codigoPorcentaje,
                    tarifa, baseImponible, valor
                )
                SELECT
                    @idDocumento, tt.codArticulo, tt.codigo, codigoPorcentaje,
                    tarifa, baseImponible, valor
                FROM Recepcion.Doc_Impuesto_Temp tt
                INNER JOIN Recepcion.Doc_Detalle_Temp ddt ON tt.idDocumento = ddt.idDocumento AND tt.idDetalle = ddt.idDetalle
                WHERE tt.idDocumento = @idDocumento
                  AND ddt.idArticulo = @idArticulo
                  AND NOT EXISTS (SELECT 1 FROM Recepcion.Doc_Detalle_Impuesto rddd WHERE rddd.idDocumento = @idDocumento AND rddd.codigoPrincipal = tt.codArticulo AND rddd.codigo = tt.codigo);

                UPDATE ddi
                SET ddi.idDocumentoDetalle = t.idDocumentoDetalle
                FROM Recepcion.Doc_Detalle_Impuesto ddi
                INNER JOIN (
                    SELECT idDocumento, idDocumentoDetalle, idArticulo
                    FROM Recepcion.DocumentoDetalle
                ) AS t ON ddi.codigoPrincipal = ddi.codigoPrincipal
                      AND ddi.idDocumento = t.idDocumento
                      AND t.idArticulo = @idArticulo
                WHERE ddi.idDocumento = @idDocumento;
            END
            -- Insert all articles
            -- Se insertan todos los articulos si @idArticulo es 0 o NULL.
            -- Se valida NOT EXISTS para evitar duplicados.
            ELSE
            BEGIN
                INSERT INTO Recepcion.DocumentoDetalle
                (
                    idDocumento, idBodega, idArticulo, idMedida, codigoPrincipal, codigoAuxiliar,
                    cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto,
                    costoNeto, detallesAdicionales, impuestos, idUsuario
                )
                SELECT
                    idDocumento, t.idBodega, t.idArticulo, t.idMedida, t.codigoPrincipal, t.codigoAuxiliar,
                    cantidad, t.descripcion, precioUnitario,
                    CASE WHEN descuento IS NULL OR descuento = '' THEN 0 ELSE CAST(descuento AS NUMERIC(18,2)) END,
                    precioTotalSinImpuesto,
                    CAST((CAST(precioTotalSinImpuesto AS DECIMAL(15,5)) / CAST(cantidad AS DECIMAL(18,5))) AS NUMERIC(18,5)),
                    detallesAdicionales, impuestos, @idUsuario
                FROM Recepcion.Doc_Detalle_Temp t
                WHERE t.idDocumento = @idDocumento
                  AND t.idArticulo > 0
                  AND NOT EXISTS (SELECT 1 FROM Recepcion.DocumentoDetalle dd WHERE dd.idDocumento = t.idDocumento AND dd.idArticulo = t.idArticulo);

                INSERT INTO Recepcion.Doc_Detalle_Impuesto
                (
                    idDocumento, codigoPrincipal, codigo, codigoPorcentaje,
                    tarifa, baseImponible, valor
                )
                SELECT
                    @idDocumento, codArticulo, codigo, codigoPorcentaje,
                    tarifa, baseImponible, valor
                FROM Recepcion.Doc_Impuesto_Temp tt
                INNER JOIN Recepcion.Doc_Detalle_Temp ddt ON tt.idDocumento = ddt.idDocumento AND tt.idDetalle = ddt.idDetalle
                WHERE tt.idDocumento = @idDocumento
                  AND ddt.idArticulo > 0
                  AND NOT EXISTS (SELECT 1 FROM Recepcion.Doc_Detalle_Impuesto rddd WHERE rddd.idDocumento = @idDocumento AND rddd.codigoPrincipal = tt.codArticulo AND rddd.codigo = tt.codigo);

                UPDATE ddi
                SET ddi.idDocumentoDetalle = t.idDocumentoDetalle
                FROM Recepcion.Doc_Detalle_Impuesto ddi
                INNER JOIN (
                    SELECT idDocumento, idDocumentoDetalle
                    FROM Recepcion.DocumentoDetalle
                ) AS t ON ddi.codigoPrincipal = ddi.codigoPrincipal
                      AND ddi.idDocumento = t.idDocumento
                WHERE ddi.idDocumento = @idDocumento;
            END

            -- Mark document as complete
            UPDATE Recepcion.DocumentoRecibido
            SET complete = 1
            WHERE idDocumento = @idDocumento;

            -- ========== Inventario ==========
            -- Logica para generar movimientos de inventario si la empresa maneja inventario
            -- y los articulos involucrados son inventariables.
            IF EXISTS (
                SELECT 1
                FROM Recepcion.DocumentoDetalle t
                INNER JOIN Articulo a WITH(NOLOCK) ON t.idArticulo = a.idArticulo
                WHERE t.idDocumento = @idDocumento
                  AND a.llevaInventario = 1
            )
            BEGIN
                DECLARE @codDocInv VARCHAR(2);
                DECLARE @multiplier INT;
                DECLARE @idTipoDocumento INT;
                DECLARE @idTipoTransaccion INT;
                DECLARE @idTransaccionOriginal INT;
                DECLARE @idTransaccion INT

                DECLARE @tblDetails AS TABLE
                (
                    idArticulo INT NOT NULL,
                    idTarifa INT NULL,
                    idBodega INT NOT NULL,
                    idMedida INT NULL,
                    cantidad NUMERIC(18,5),
                    precioUnitario NUMERIC(18,5),
                    precioTotalSimImpuestos NUMERIC(18,5)
                );

                IF @idArticulo > 0
                BEGIN
                    INSERT INTO @tblDetails (idArticulo, idBodega, idMedida, cantidad, precioUnitario, precioTotalSimImpuestos)
                    SELECT dd.idArticulo, dd.idBodega, dd.idMedida, dd.cantidad, costoNeto, dd.precioTotalSinImpuesto
                    FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK)
                    WHERE dd.idDocumento = @idDocumento
                      AND dd.idArticulo = @idArticulo;
                END
                ELSE
                BEGIN
                    INSERT INTO @tblDetails (idArticulo, idBodega, idMedida, cantidad, precioUnitario, precioTotalSimImpuestos)
                    SELECT dd.idArticulo, dd.idBodega, dd.idMedida, dd.cantidad, costoNeto, dd.precioTotalSinImpuesto
                    FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK)
                    WHERE dd.idDocumento = @idDocumento;
                END

                SET @codDocInv = (SELECT CASE WHEN @codDoc = '01' THEN 'FE' WHEN @codDoc = '04' THEN 'NC' END);
                SET @multiplier = (SELECT CASE WHEN @codDoc = '01' THEN 1 WHEN @codDoc = '04' THEN -1 END);

                -- Buscar transaccion original si es una nota de credito o similar
                SELECT TOP 1 @idTransaccionOriginal = idTransaccion
                FROM Inventario.Transaccion tr
                INNER JOIN Inventario.TipoDocumento td ON td.idTipoDocumento = tr.idTipoDocumento
                INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
                WHERE td.codigo = @codDocInv
                  AND tt.codigo = 'E'
                  AND tr.idDocumento = @idDocumento;

                IF @idTransaccionOriginal > 0
                    BEGIN
                        DECLARE @idPuntoEmision INT;

                        SELECT TOP 1 @idTipoDocumento = idTipoDocumento
                        FROM Inventario.TipoDocumento WITH (NOLOCK)
                        WHERE codigo = 'AJ';

                        SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion
                        FROM Inventario.TipoTransaccion WITH (NOLOCK)
                        WHERE codigo = 'E';

                        SELECT TOP 1 @idPuntoEmision = pa.idPuntoEmision
                        FROM Config.PtoEmi_Asig pa
                        INNER JOIN Config.Estab_Asig ae ON ae.idEstab_Asig = pa.idEstab_Asig
                        WHERE pa.predeterminado = 1
                          AND ae.idUsuarioRol = @idUsuarioRol;

                        SELECT TOP 1 @serieComprobante = es.estab + '-' + pe.ptoEmi + '-' + FORMAT(cd.ultimaSecuencia, 'D9')
                        FROM ConfiguracionDocumento cd
                        INNER JOIN dbo.TipoDocumento td ON td.idTipoDocumento = cd.idTipoDocumento
                        INNER JOIN dbo.PuntoEmision pe ON pe.idPuntoEmision = cd.idPuntoEmision
                        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
                        WHERE cd.idPuntoEmision = @idPuntoEmision
                          AND td.codigo = 'AJ';

                        SELECT @fechaEmision = GETDATE()

                        SET @idDocumento =  0

                    END
                ELSE
                    BEGIN
                        SELECT TOP 1 @idTipoDocumento = idTipoDocumento
                        FROM Inventario.TipoDocumento WITH (NOLOCK)
                        WHERE codigo = @codDocInv;

                        SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion
                        FROM Inventario.TipoTransaccion WITH (NOLOCK)
                        WHERE codigo = 'E';
                    END

                
                INSERT INTO Inventario.Transaccion
                (
                    idTipoTransaccion, fechaEmision, idTipoDocumento, idDocumento,
                    CustomerId, idUsuario, idEntidad, serieComprobante, idTransaccionOriginal
                )
                SELECT
                    @idTipoTransaccion, @fechaEmision, @idTipoDocumento, @idDocumento,
                    @CustomerId, @idUsuario, @idEntidad, @serieComprobante, @idTransaccionOriginal;

                 SET @idTransaccion = SCOPE_IDENTITY();

                    

                -- Insertar detalles de la transaccion
                INSERT INTO Inventario.TransaccionDetalle
                (
                    idTransaccion, idArticulo, idBodega, idMedida, cantidad, cantidadTransaccion,
                    precioUnitario, precioCosto, precioCostoFraccionado, conversion, total
                )
                SELECT
                    @idTransaccion,
                    idArticulo,
                    idBodega,
                    idMedida,
                    td.cantidad,
                    (ISNULL((SELECT TOP 1 af.conversion FROM dbo.ArticuloFraccionado af WITH (NOLOCK) WHERE af.idArticulo = td.idArticulo AND af.idMedida = td.idMedida), 1) * td.cantidad) * @multiplier,
                    precioUnitario,
                    precioUnitario,
                    precioUnitario,
                    ISNULL((SELECT TOP 1 af.conversion FROM dbo.ArticuloFraccionado af WITH (NOLOCK) WHERE af.idArticulo = td.idArticulo AND af.idMedida = td.idMedida), 1),
                    precioTotalSimImpuestos
                FROM @tblDetails td

                -- Sequence update moved to transaction creation block

                -- Inicializar handler de transaccion (triggers, stocks, etc)
                EXEC dbo.Transaccion_Handler_Init @idTransaccion;

                -- Actualizacion de costos para metodo de valoracion UEPS (Ultimo en Entrar, Primero en Salir)
                IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE codMetodoValoracion = 'UEPS' AND idEntidad = @idEntidad)
                BEGIN
                    UPDATE ar
                    SET ar.fechaUltimoCosto = CASE
                            WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.fechaUltimoCosto
                            ELSE @fechaEmision
                        END,
                        ar.precioCosto = CASE
                            WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.precioCosto
                            ELSE IIF(
                                (SELECT TOP 1 MAX(td.precioUnitario) FROM @tblDetails td WHERE td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida) >= (ar.precioCosto / 2),
                                (SELECT TOP 1 MAX(td.precioUnitario) FROM @tblDetails td WHERE td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida),
                                ar.precioCosto
                            )
                        END
                    FROM dbo.Articulo ar WITH (ROWLOCK)
                    WHERE ar.idArticulo IN (SELECT idArticulo FROM @tblDetails td);

                    UPDATE pv
                    SET pv.porcentajeUtilidad = ((pv.precioVenta / ar.precioCosto) * 100) - 100
                    FROM dbo.ArticuloPvP pv WITH (ROWLOCK)
                    INNER JOIN dbo.Articulo ar WITH (ROWLOCK) ON ar.idArticulo = pv.idArticulo
                    WHERE ar.idArticulo IN (SELECT idArticulo FROM @tblDetails td);
                END
            END

            SELECT '1' AS code, 'Detalle importado exitosamente' AS 'message';
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        IF (@@TRANCOUNT > 0)
        BEGIN
            ROLLBACK TRAN;
        END

        INSERT INTO ErroresSistema
        (
            [token], [method], [errorNumber], [errorSeverity], [errorState],
            [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario]
        )
        VALUES
        (
            NEWID(), 'DocumentoDetalle/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(),
            ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario
        );

        SELECT '0' AS code, 'Error en base de datos: ' + ERROR_MESSAGE() AS 'message';
    END CATCH
END
GO
