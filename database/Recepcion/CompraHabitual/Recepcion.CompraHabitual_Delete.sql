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

CREATE OR ALTER PROCEDURE Recepcion.CompraHabitual_Delete @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT 
            ,@id INT
            ,@idDocumento INT
	
	BEGIN TRY
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        SElECT @id = id, @idDocumento = idDocumento FROM OPENJSON(@json) WITH (id INT, idDocumento INT)

        --IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento AND complete = 1)
        --    BEGIN
        --        SELECT '0' code, 'No se puede borrar este historial, proceso de inventario terminado' as 'message'
        --        RETURN
        --    END

        --IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento AND estado = 1)
        --    BEGIN
        --        SELECT '0' code, 'No se puede borrar este historial, documento anulado' as 'message'
        --        RETURN
        --    END

        BEGIN TRAN
            DELETE FROM Recepcion.CompraHabitual WHERE idCompraHabitual = @id
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
