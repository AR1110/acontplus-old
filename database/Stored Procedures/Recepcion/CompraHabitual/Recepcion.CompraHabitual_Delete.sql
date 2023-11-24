USE [AcontPlus]
go
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-10-31
-- Description:	SP PARA DESINVICULAR EL ARTICULO DE LA COMPRA HABITUAL
-- =============================================
IF OBJECT_ID(N'Recepcion.CompraHabitual_Delete', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.CompraHabitual_Delete 
GO
CREATE PROCEDURE Recepcion.CompraHabitual_Delete @idUsuarioRol INT
,@id INT
,@backendInfo VARCHAR(MAX) = NULL
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

	SELECT @idArticulo = idArticulo, @productNewCode = codArticulo, @codEstab = codEstab FROM Recepcion.CompraHabitual WITH (NOLOCK) WHERE idCompraHabitual = @id
	
    SET @companyId = (SELECT en.idEntidad FROM Sri.Establecimiento e WITH (NOLOCK)
                                            INNER JOIN dbo.Entidad en WITH (NOLOCK) ON e.ruc = en.ruc WHERE e.codEstab = @codEstab)

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

	IF (@existsProductJoined = 1 AND @existsNewProductJoined = 1)
		BEGIN
			DECLARE @articleInDocs AS VARCHAR(MAX) = (SELECT dr.serieComprobante FROM Recepcion.DocumentoRecibido dr INNER JOIN Recepcion.DocumentoDetalle dd ON dr.idDocumento = dd.idDocumento WHERE dd.idArticulo IN (@idArticulo, @productNewId) for json path)
			SELECT '0' code, 'Imposible desvincular, el articulo esta contabilizado en el stock, primero debe eliminarlo del stock de los siguientes comprobantes --> ' + @articleInDocs as 'message'
			RETURN
		END
	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN
			 DELETE FROM Recepcion.CompraHabitual WHERE idCompraHabitual = @id
			 SELECT '1' code, 'Desvinculado Exitosamente' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
		SET @method = (SELECT method FROM OPENJSON(@backendInfo) WITH(method VARCHAR(200) '$.methodName'))
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), @method, ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
