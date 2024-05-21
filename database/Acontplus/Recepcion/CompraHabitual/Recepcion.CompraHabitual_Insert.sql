USE [AcontPlus]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Ivan Paz
-- Create date: 2022-09-01
-- Description: SP FOR INSERT COMPRA HABITUAL
-- =============================================
CREATE OR ALTER PROCEDURE Recepcion.CompraHabitual_Insert
    @idUsuarioRol INT
    ,@json NVARCHAR(MAX)
    ,@method VARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @codEstab VARCHAR(50)
    DECLARE @idUsuario INT
    DECLARE @idEntidad INT

    DECLARE @tmp AS TABLE(
        idProveedor INT NOT NULL
        ,ruc VARCHAR(13) NULL
        ,idArticulo INT NOT NULL
        ,codArticulo VARCHAR(100) NULL
    ) 
    BEGIN TRY

        SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

        SELECT @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol AND predeterminado = 1

        INSERT INTO @tmp(idProveedor, ruc, idArticulo, codArticulo)
        SELECT idProveedor, ruc, idArticulo, LTRIM(RTRIM(codArticulo)) 
        FROM OPENJSON(@json) 
        WITH (
            idProveedor INT '$.idProveedor'
            ,ruc VARCHAR(13) '$.ruc'
            ,idArticulo INT '$.idArticulo'
            ,codArticulo VARCHAR(100) '$.codArticulo'
        )

        IF (SELECT COUNT(1) FROM @tmp) = 0
        BEGIN
            RETURN
        END

        IF NOT EXISTS (
            SELECT 1 
            FROM @tmp t 
            INNER JOIN Articulo a WITH (NOLOCK) ON t.idArticulo = a.idArticulo AND a.llevaInventario = 1
        )
        BEGIN
            SELECT '0' code, 'Este articulo no esta configurado para llevar inventario' AS 'message'
            RETURN
        END

       IF EXISTS (
            SELECT 1 
            FROM @tmp 
            WHERE LEN(RTRIM(LTRIM(ISNULL(codArticulo, '')))) = 0
        )
        BEGIN
            SELECT '0' code, 'El campo codArticulo no puede ser nulo o vacío' AS 'message'
            RETURN
        END


        IF EXISTS(
            SELECT 1 
            FROM Recepcion.CompraHabitual ch WITH (NOLOCK) 
            INNER JOIN Proveedor p ON ch.idProveedor = p.idProveedor AND p.idEntidad = @idEntidad
            INNER JOIN @tmp t ON ch.codArticulo = t.codArticulo AND ch.ruc = t.ruc
        )
        BEGIN
            DECLARE @idArticleFounded INT 
            DECLARE @articleFounded VARCHAR(600)
        
            SET @idArticleFounded = (
                SELECT TOP 1 ch.idArticulo 
                FROM Recepcion.CompraHabitual ch WITH (NOLOCK) 
                INNER JOIN Proveedor p ON ch.idProveedor = p.idProveedor AND p.idEntidad = @idEntidad
                INNER JOIN @tmp t ON ch.codArticulo = t.codArticulo 
                                     AND ch.ruc = t.ruc
            )

            SET @articleFounded = (
                SELECT '(' + codigo + ') - ' + descripcion 
                FROM Articulo WITH (NOLOCK) 
                WHERE idArticulo = @idArticleFounded 
            )

            SELECT '1' code, 'El articulo ya se encuentra vinculado previamente con este proveedor: '  + @articleFounded AS 'message'
            RETURN
        END

        BEGIN TRAN
            INSERT INTO Recepcion.CompraHabitual(codEstab,idProveedor, ruc, idArticulo, codArticulo, idUsuario)
            SELECT @codEstab, idProveedor, ruc, idArticulo, codArticulo, @idUsuario 
            FROM @tmp t
            WHERE NOT EXISTS (
                SELECT * 
                FROM Recepcion.CompraHabitual ch
                INNER JOIN @tmp t ON ch.idProveedor = t.idProveedor 
                                   AND ch.idArticulo = t.idArticulo
                                   AND ch.codArticulo = t.codArticulo
                WHERE ch.codEstab = @codEstab
            )

            SELECT '1' code, 'Exitos al guardar' AS 'message'
        COMMIT TRAN
    END TRY
    BEGIN CATCH
        SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() AS 'message'
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN
        INSERT INTO ErroresSistema(
            [token], 
            [method], 
            [errorNumber], 
            [errorSeverity], 
            [errorState], 
            [errorProcedure], 
            [errorLine], 
            [errorMessage], 
            [errorDate], 
            [idUsuario]
        )
        VALUES (
            NEWID(), 
            'CompraHabitual/Post', 
            ERROR_NUMBER(), 
            ERROR_SEVERITY(), 
            ERROR_STATE(), 
            ERROR_PROCEDURE(), 
            ERROR_LINE(), 
            ERROR_MESSAGE(), 
            dbo.ufnGetDateEcuador(), 
            @idUsuario
        )
    END CATCH
END
GO
