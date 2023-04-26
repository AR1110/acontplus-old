USE [AcontPlus]
go
GO
/****** Object:  StoredProcedure [FactElect].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-10-31
-- Description:	SP PARA DESINVICULAR EL ARTICULO DE LA COMPRA HABITUAL
-- =============================================
IF OBJECT_ID(N'FactElect.CompraHabitual_Delete', N'P') IS NOT NULL
DROP PROCEDURE FactElect.CompraHabitual_Delete 
GO
CREATE PROCEDURE FactElect.CompraHabitual_Delete @idRol INT
,@id INT
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT 
	,@idArticulo INT

	SET @idArticulo = (SELECT idArticulo FROM FactElect.CompraHabitual WITH (NOLOCK) WHERE idCompraHabitual = @id)
	
	IF EXISTS(SELECT 1 FROM Recepcion.DocumentoDetalle WHERE idArticulo = @idArticulo)
		BEGIN
			DECLARE @articleInDocs AS VARCHAR(MAX) = (SELECT dr.serieComprobante FROM Recepcion.DocumentoRecibido dr INNER JOIN Recepcion.DocumentoDetalle dd ON dr.idDocumento = dd.idDocumento WHERE dd.idArticulo	 = @idArticulo for json path)
			SELECT '0' code, 'Imposible desvincular, el articulo esta contabilizado en el stock, primero debe eliminarlo del stock de los siguientes comprobantes --> ' + @articleInDocs as 'message'
			RETURN
		END
	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol)
	BEGIN TRY
		BEGIN TRAN
			 DELETE FROM FactElect.CompraHabitual WHERE idCompraHabitual = @id
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
