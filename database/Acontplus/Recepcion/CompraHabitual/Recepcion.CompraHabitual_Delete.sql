USE [AcontPlus]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-10-31
-- Description:	SP PARA DESINVICULAR EL ARTICULO DE LA COMPRA HABITUAL
-- =============================================

CREATE OR ALTER PROCEDURE Recepcion.CompraHabitual_Delete @userRoleId INT
    ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT 
	    ,@idArticulo INT
        ,@companyId INT
        ,@productNewCode VARCHAR(25)
        ,@codEstab VARCHAR(50)
        ,@productNewId INT
        ,@existsProductJoined BIT = 0
        ,@existsNewProductJoined BIT = 0
        ,@id INT
        ,@idDocumento INT
        ,@tipo INT;
	
	BEGIN TRY

        SElECT @id = id, @idDocumento = idDocumento, @tipo = tipo FROM OPENJSON(@json) WITH (id INT, idDocumento INT, tipo INT)

        SELECT @idArticulo = idArticulo, @productNewCode = codArticulo, @codEstab = codEstab 
        FROM Recepcion.CompraHabitual WITH (NOLOCK)
        WHERE idCompraHabitual = @id
	
        SET @companyId = (SELECT en.idEntidad FROM Sri.Establecimiento e WITH (NOLOCK)
                                                INNER JOIN dbo.Entidad en WITH (NOLOCK) ON en.idEntidad = e.idEntidad WHERE e.codEstab = @codEstab)

        IF NOT EXISTS (SELECT 1 FROM dbo.Articulo WITH (NOLOCK) WHERE codigo = @productNewCode AND idEntidad = @companyId)
            BEGIN
                SET @existsNewProductJoined = 0;
            END
        ELSE
            BEGIN
                --EXISTE STOCK DE ARTICULO NUEVO
                SET @productNewId = (SELECT idArticulo FROM dbo.Articulo WITH (NOLOCK) WHERE codigo = @productNewCode AND idEntidad = @companyId)
                IF EXISTS (SELECT 1 FROM Recepcion.DocumentoDetalle WITH (NOLOCK) WHERE idArticulo = @productNewId)
                    BEGIN
                        SET @existsNewProductJoined = 1
                    END
                --EXISTE STOCK DE ARTICULO VINCULADO
                IF EXISTS(SELECT 1 FROM Recepcion.DocumentoDetalle WITH (NOLOCK) WHERE idArticulo = @idArticulo)
		            BEGIN
			            SET @existsProductJoined = 1
		            END
            END

        IF (@existsProductJoined = 1 AND @existsNewProductJoined = 1 AND @tipo = 1)
        BEGIN
            DECLARE @articleInDocs AS VARCHAR(MAX) = (
                SELECT 
                    '<table class="table table-hover">
                    <thead>
                        <tr>
                            <th style="padding: 8px; background-color: #f2f2f2;">Serie Comprobante</th>
                        </tr>
                    </thead>
                    <tbody>' +
                    STRING_AGG(
                        '<tr><td style="padding: 8px;">' + dr.serieComprobante + '</td></tr>', 
                        ''
                    ) +
                    '</tbody></table>'
                FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                INNER JOIN Recepcion.DocumentoDetalle dd WITH (NOLOCK) 
                    ON dr.idDocumento = dd.idDocumento 
                WHERE dd.idArticulo IN (@idArticulo, @productNewId)
            )

            SELECT '0' code, 
                   'Imposible desvincular, el articulo esta contabilizado en el stock, primero debe eliminarlo del stock de los siguientes comprobantes: ' + @articleInDocs as 'message'
            RETURN
        END

	    SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId)

		BEGIN TRAN
            --SI NO ES CASO ESPECIAL TIPO 2
            IF (@tipo = 1)
                BEGIN
			        DELETE FROM Recepcion.CompraHabitual WITH (ROWLOCK) WHERE idCompraHabitual = @id
                END

             IF EXISTS (SELECT 1 FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = @idDocumento AND idArticulo = @idArticulo)
                BEGIN
                    UPDATE Recepcion.Doc_Detalle_Temp WITH (ROWLOCK)
                    SET idArticulo = NULL,
                        idMedida = NULL 
                    WHERE idDocumento = @idDocumento 
                        AND idArticulo = @idArticulo
                END
		COMMIT TRAN
        SELECT '1' code, 'Desvinculado Exitosamente' as 'message'
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN 
		INSERT INTO ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES ('CompraHabitual/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
