USE [AcontPlus]
GO

/****** Object: StoredProcedure [Inventario].[Articulo_Update] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      Alexis Ramirez
-- Create date: 2021-07-05
-- Description: SP para actualizar datos generales del articulo
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Articulo_Update
     @userRoleId INT
    ,@id INT
    ,@json VARCHAR(MAX)
AS

BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> GLOBAL
    DECLARE @idUsuario INT
           ,@idEntidad INT
           ,@ruc VARCHAR(13)
           ,@payload NVARCHAR(MAX)
           ,@inventory VARCHAR(5)

    --> Data Json
    DECLARE @jsonArticulo NVARCHAR(MAX)
           ,@jsonPvp VARCHAR(MAX)
           ,@idBodega INT
           ,@ubicacion VARCHAR(90)

    --> Articulo
    DECLARE @idSubFamilia INT
           ,@idMedida INT
           ,@codigo VARCHAR(50)
           ,@codigoBarra VARCHAR(50)
           ,@codigoAuxiliar VARCHAR(50)
           ,@llevaInventario BIT
           ,@datosAdicionales BIT
           ,@fraccionado BIT

    --> Restaurante
    DECLARE @siglaFamilia VARCHAR(5)

    --> Tb Temp
    DECLARE @tbArticle AS TABLE (
        idSubFamilia INT NOT NULL
       ,idMarca INT NULL
       ,idModelo INT NULL
       ,idTipoIce INT NULL
       ,idTipoArticulo INT NULL
       ,idTipoIva INT NOT NULL
       ,idMedida INT NOT NULL
       ,idEtiqueta INT NULL
       ,precioCosto NUMERIC(18,5) NOT NULL
       ,precioSinSubsidio NUMERIC(18,5) NOT NULL
       ,codigo VARCHAR(150) UNIQUE NOT NULL
       ,codigoAuxiliar VARCHAR(150) UNIQUE NOT NULL
       ,codigoBarra VARCHAR(150) UNIQUE NOT NULL
       ,valorIce NUMERIC(18,5)
       ,descripcion VARCHAR(500) NOT NULL
       ,llevaInventario BIT NOT NULL
       ,datosAdicionales BIT NOT NULL
       ,productoFraccionable BIT NOT NULL
       ,datosLote BIT NULL
       ,lote VARCHAR(100) NULL
       ,fechaCreacion DATETIME NULL
       ,fechaCaducidadlote DATETIME NULL
       ,stockMinimo INT NULL
       ,stockMaximo INT NULL
       ,observaciones VARCHAR(300) NULL
       ,caducidad VARCHAR(50) NULL
       ,fechaCaducidad DATETIME NULL
       ,estado BIT NOT NULL
       ,cantMinimaVentaPorMayor INT NOT NULL
    )

    DECLARE @tbPrices AS TABLE (
        idArticuloPvP INT UNIQUE NOT NULL
       ,precioVenta NUMERIC(18,6) NOT NULL
       ,precioConIva NUMERIC(18,6) NOT NULL
       ,porcentajeUtilidad NUMERIC(18,5) NOT NULL
       ,precioPredeterminado BIT NOT NULL
    )

    BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad
                    ,@idUsuario = idUsuario 
        FROM App.UsuarioRol WITH (NOLOCK) 
        WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @ruc = ruc 
        FROM dbo.Entidad WITH (NOLOCK) 
        WHERE idEntidad = @idEntidad

        --> Data Json
        SELECT @jsonArticulo = jsonArticulo
              ,@jsonPvp = jsonPvp
              ,@idBodega = idBodega
              ,@ubicacion = ubicacion
        FROM OPENJSON(@json) WITH
        (
            jsonArticulo VARCHAR(MAX) '$.jsonArticulo'
           ,jsonPvp VARCHAR(MAX) '$.jsonPvp'
           ,idBodega INT '$.idBodega'
           ,ubicacion VARCHAR(90) '$.ubicacion'
        )

        INSERT INTO @tbArticle
                (idSubFamilia
                ,idMarca
                ,idModelo
                ,idTipoIce
                ,idTipoArticulo
                ,idTipoIva
                ,idMedida
                ,precioCosto
                ,precioSinSubsidio
                ,codigo
                ,codigoAuxiliar
                ,valorIce
                ,descripcion
                ,llevaInventario
                ,datosAdicionales
                ,productoFraccionable
                ,datosLote
                ,lote
                ,fechaCreacion
                ,fechaCaducidadLote
                ,stockMinimo
                ,stockMaximo
                ,observaciones
                ,caducidad
                ,fechaCaducidad
                ,codigoBarra
                ,idEtiqueta
                ,estado
                ,cantMinimaVentaPorMayor)
        SELECT 
             CASE WHEN idSubFamilia = 0 THEN NULL ELSE idSubFamilia END
            ,CASE WHEN idMarca = 0 THEN NULL ELSE idMarca END
            ,CASE WHEN idModelo = 0 THEN NULL ELSE idModelo END
            ,CASE WHEN idTipoIce = 0 THEN NULL ELSE idTipoIce END
            ,CASE WHEN idTipoArticulo = 0 THEN NULL ELSE idTipoArticulo END
            ,idTipoIva
            ,idMedida
            ,precioCosto
            ,ISNULL(precioSinSubsidio, 0)
            ,codigo
            ,codigoAuxiliar
            ,ISNULL(valorIce, 0)
            ,descripcion
            ,ISNULL(llevaInventario, 0)
            ,ISNULL(datosAdicionales, 0)
            ,ISNULL(productoFraccionable, 0)
            ,ISNULL(datosLote, 0)
            ,lote
            ,fechaCreacion
            ,fechaCaducidadLote
            ,ISNULL(stockMinimo, 0)
            ,ISNULL(stockMaximo, 0)
            ,observaciones
            ,ISNULL(caducidad, 0)
            ,fechaCaducidad
            ,codigoBarra
            ,CASE WHEN datosAdicionales = 1 THEN idEtiqueta ELSE NULL END
            ,estado
            ,ISNULL(cantMinimaVentaPorMayor, 0)
        FROM OPENJSON(@jsonArticulo)
        WITH (idSubFamilia INT '$.idSubFamilia'
              ,idMarca INT '$.idMarca'
              ,idModelo INT '$.idModelo'
              ,idTipoIce INT '$.idTipoIce'
              ,idTipoArticulo INT '$.idTipoArticulo'
              ,idTipoIva INT '$.idTipoIva'
              ,idMedida INT '$.idMedida'
              ,precioCosto NUMERIC(15,5) '$.precioCosto'
              ,precioSinSubsidio NUMERIC(15,5) '$.precioSinSubsidio'
              ,codigo VARCHAR(100) '$.codigo'
              ,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
              ,valorIce NUMERIC(15,5) '$.valorIce'
              ,descripcion VARCHAR(255) '$.descripcion'
              ,llevaInventario BIT '$.llevaInventario'
              ,datosAdicionales BIT '$.datosAdicionales'
              ,productoFraccionable BIT '$.productoFraccionable'
              ,datosLote BIT '$.datosLote'
              ,lote VARCHAR(100) '$.lote'
              ,fechaCreacion DATETIME '$.fechaCreacion'
              ,fechaCaducidadLote DATETIME '$.fechaCaducidadLote'
              ,stockMinimo INT '$.stockMinimo'
              ,stockMaximo INT '$.stockMaximo'
              ,observaciones VARCHAR(300) '$.observaciones'
              ,caducidad BIT '$.caducidad'
              ,fechaCaducidad DATETIME '$.fechaCaducidad'
              ,codigoBarra VARCHAR(100) '$.codigoBarra'
              ,idEtiqueta INT '$.idEtiqueta'
              ,estado BIT '$.estado'
              ,cantMinimaVentaPorMayor INT '$.cantMinimaVentaPorMayor') AS dt

        INSERT INTO @tbPrices
               (idArticuloPvP
               ,precioVenta
               ,precioConIva
               ,porcentajeUtilidad
               ,precioPredeterminado)
        SELECT idArticuloPvP
              ,precioVenta
              ,precioConIva
              ,porcentajeUtilidad
              ,precioPredeterminado
        FROM OPENJSON(@jsonPvp) WITH
        (
            idArticuloPvP INT '$.idArticuloPvP'
           ,precioVenta NUMERIC(20,6) '$.precioVenta'
           ,precioConIva NUMERIC(20,6) '$.precioConIva'
           ,porcentajeUtilidad NUMERIC(20,5) '$.porcentajeUtilidad'
           ,precioPredeterminado BIT '$.precioPredeterminado'
        ) AS dt

        SELECT TOP 1 @inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig), '$.llevaInventario') 
        FROM Config.Sistema 
        WHERE idEntidad = @idEntidad 
          AND codConfig = 'CI'

        SELECT @codigo = t1.codigo
              ,@codigoBarra = t1.codigoBarra
              ,@codigoAuxiliar = t1.codigoAuxiliar
              ,@llevaInventario = t1.llevaInventario
              ,@datosAdicionales = t1.datosAdicionales
              ,@idSubFamilia = t1.idSubFamilia
              ,@idMedida = t1.idMedida
              ,@fraccionado = t1.productoFraccionable
              ,@siglaFamilia = t3.siglas
        FROM @tbArticle t1
        INNER JOIN dbo.SubFamilia t2 ON t2.idSubFamilia = t1.idSubFamilia
         LEFT JOIN dbo.Familia t3 ON t3.idFamilia = t2.idFamilia

        --> Validaciones
        IF NOT EXISTS(SELECT 1 FROM @tbArticle)
            BEGIN
                SELECT '0' code, 'Error en la informacion del Articulo' AS 'message'
                RETURN
            END

        IF NOT EXISTS(SELECT 1 FROM @tbPrices)
            BEGIN
                SELECT '0' code, 'Error en la informacion de las tarifas de precios' AS 'message'
                RETURN
            END

        IF (SELECT COUNT(*) FROM @tbPrices) != 5
            BEGIN
                SELECT '0' code, 'Error en la informacion, tarifas incompletas' AS 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE codigo = @codigo AND idEntidad = @idEntidad AND idArticulo != @id)
            BEGIN
                SELECT '0' code, 'Este codigo se encuentra en uso para otro articulo' AS 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Articulo WITH (NOLOCK) WHERE codigoBarra = @codigoBarra AND idEntidad = @idEntidad AND idArticulo != @id)
            BEGIN
                SELECT '0' code, 'Este codigo de barra se encuentra en uso para otro articulo' AS 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM dbo.Articulo WITH (NOLOCK) WHERE idMedida != @idMedida AND idArticulo = @id)
            BEGIN
                IF EXISTS (SELECT 1 FROM ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @id AND idMedida = @idMedida)
                    BEGIN
                        SELECT '0' code, 'Este Articulo se encuentra fraccionado con esta medida' AS 'message'
                        RETURN
                    END
            END

        IF @fraccionado = 0
            BEGIN
                IF EXISTS (SELECT 1 FROM ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @id)
                    BEGIN
                        SELECT '0' code, 'Este Articulo se encuentra fraccionado no puede desactivar la opcion fraccionado' AS 'message'
                        RETURN
                    END
            END

        IF @datosAdicionales = 0
            BEGIN
                IF EXISTS (SELECT 1 FROM Compra.InfoAdicional WITH (NOLOCK) WHERE idArticulo = @id)
                    BEGIN
                        SELECT '0' code, 'Este Articulo tiene informacion adicional en las compras' AS 'message'
                        RETURN
                    END
            END

        IF @llevaInventario = 0
            BEGIN
                IF EXISTS (SELECT 1 FROM Inventario.TransaccionDetalle WITH (NOLOCK) WHERE idArticulo = @id)
                    BEGIN
                        SELECT '0' code, 'Este Articulo tiene un historial de Inventario' AS 'message'
                        RETURN
                    END
            END

        IF @llevaInventario = 1
            BEGIN
                IF @inventory = 'NO'
                    BEGIN
                        SELECT '0' code, 'No se ha establecido una configuración de control de inventario en la sección general de la configuración esto indica que no es posible establecer que este artículo requiere llevar un registro de inventario.' AS 'message'
                        RETURN
                    END
            END

        BEGIN TRAN
            --> Articulo
            UPDATE ar SET
                 ar.descripcion = arj.descripcion
                ,ar.idSubFamilia = arj.idSubFamilia
                ,ar.codigo = arj.codigo
                ,ar.codigoBarra = arj.codigoBarra
                ,ar.codigoAuxiliar = arj.codigoAuxiliar
                ,ar.idTipoArticulo = arj.idTipoArticulo
                ,ar.datosAdicionales = arj.datosAdicionales
                ,ar.llevaInventario = arj.llevaInventario
                ,ar.productoFraccionable = arj.productoFraccionable
                ,ar.idMarca = arj.idMarca
                ,ar.idModelo = arj.idModelo
                ,ar.idTipoIce = arj.idTipoIce
                ,ar.idTipoIva = arj.idTipoIva
                ,ar.idMedida = arj.idMedida
                ,ar.valorIce = arj.valorIce
                ,ar.stockMinimo = arj.stockMinimo
                ,ar.stockMaximo = arj.stockMaximo
                ,ar.Observaciones = arj.observaciones
                ,ar.caducidad = arj.caducidad
                ,ar.fechaCaducidad = arj.fechaCaducidad
                ,ar.datosLote = arj.datosLote
                ,ar.lote = arj.lote
                ,ar.fechaCreacion = arj.fechaCreacion
                ,ar.fechaCaducidadLote = arj.fechaCaducidadLote
                ,ar.estado = arj.estado
                ,ar.fechaBaja = CASE WHEN arj.estado = 0 THEN GETDATE() ELSE NULL END
                ,ar.precioCosto = arj.precioCosto
                ,ar.precioSinSubsidio = arj.precioSinSubsidio
                ,ar.idEtiqueta = arj.idEtiqueta
                ,ar.cantMinimaVentaPorMayor = arj.cantMinimaVentaPorMayor
                ,ar.UpdateAt = GETDATE()
                ,ar.UserUpdateId = @idUsuario
            FROM Articulo ar WITH (NOLOCK)
            INNER JOIN @tbArticle arj ON ar.idArticulo = @id

            --> Tarifas de precio
            UPDATE arpvp SET
                 arpvp.precioVenta = jv.precioVenta
                ,arpvp.precioConIva = jv.precioConIva
                ,arpvp.porcentajeUtilidad = jv.porcentajeUtilidad
            FROM ArticuloPvP arpvp WITH (NOLOCK)
            INNER JOIN @tbPrices jv ON arpvp.idArticuloPvP = jv.idArticuloPvP

            --> Stock Historial
            IF EXISTS (SELECT 1 FROM Inventario.Stock WITH (NOLOCK) WHERE idArticulo = @id)
                BEGIN
                    IF @llevaInventario = 0
                        BEGIN
                            DELETE FROM Inventario.Stock WHERE idArticulo = @id
                        END
                END

            IF @llevaInventario = 1
                BEGIN
                    INSERT INTO Inventario.Stock
                            (idArticulo
                            ,idBodega
                            ,cantidad
                            ,lastUpdate
                            ,idUsuario)
                    SELECT @id
                          ,bo.idBodega
                          ,0
                          ,GETDATE()
                          ,@idUsuario
                    FROM dbo.Bodega bo WITH (NOLOCK)
                    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = bo.codEstab
                    WHERE es.idEntidad = @idEntidad
                      AND bo.idBodega NOT IN (SELECT sb.idBodega FROM Inventario.Stock sb WITH (NOLOCK) WHERE sb.idArticulo = @id)
                END

            --> Restaurant
            IF @siglaFamilia IN ('RES' ,'POR', 'ING' ,'COM')
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM Restaurant.Item WHERE ProductId = @id)
                        BEGIN
                            INSERT INTO Restaurant.Item
					                (ProductId ,Summary      ,CreatedByUserId)
                            SELECT   @id       ,descripcion  ,@idUsuario FROM @tbArticle
                        END
                    ELSE
                        BEGIN
                            UPDATE Restaurant.Item SET
                                Summary = (SELECT descripcion FROM @tbArticle)
                            WHERE ProductId = @id
                        END
                END

            IF EXISTS (SELECT 1 FROM Articulo WHERE idEntidad = @idEntidad AND idSubFamilia != @idSubFamilia)
                BEGIN
                    UPDATE SubFamilia  SET ultimoSecuencial = ultimoSecuencial + 1 WHERE idSubFamilia = @idSubFamilia
                END

            SET @payload = (
                                SELECT idArticulo
                                      ,idMedida
                                      ,codigo
                                      ,codigoAuxiliar
                                      ,codigoBarra
                                      ,gestion = 'A'
                                      ,'data' = 0
                                      ,etiquetas = ISNULL((SELECT e.idEtiqueta, e.descripcion, e.etiquetas FROM Inventario.Etiqueta e WHERE e.idEtiqueta = art.idEtiqueta FOR JSON PATH), '[]')
                                FROM Articulo art WITH (NOLOCK)
                                WHERE art.idArticulo = @id FOR JSON PATH
                            )

        COMMIT TRAN
        SELECT '1' code, 'Actualizado Exitosamente' AS 'message', @payload AS payload

    END TRY

    BEGIN CATCH
        IF @@TRANCOUNT > 0
            BEGIN
                ROLLBACK TRAN
            END

        INSERT INTO ErroresSistema
               (token
               ,method
               ,errorNumber
               ,errorSeverity
               ,errorState
               ,errorProcedure
               ,errorLine
               ,errorMessage
               ,errorDate
               ,idUsuario)
        VALUES (NEWID()
               ,'/Articulo/Update'
               ,ERROR_NUMBER()
               ,ERROR_SEVERITY()
               ,ERROR_STATE()
               ,ERROR_PROCEDURE()
               ,ERROR_LINE()
               ,ERROR_MESSAGE()
               ,GETDATE()
               ,@idUsuario)

        SELECT '0' code, 'Info: Error en el procedimiento' AS 'message'
    END CATCH
END
