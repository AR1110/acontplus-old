USE AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-03-09
-- Description:	 SP FOR DELETE DETAIL
-- =============================================
IF OBJECT_ID(N'Recepcion.DocumentoDetalle_Delete', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.DocumentoDetalle_Delete 
GO
CREATE PROCEDURE Recepcion.DocumentoDetalle_Delete	@idUsuarioRol INT,@id INT 
AS
BEGIN
	SET NOCOUNT ON; 
	set language spanish;
	DECLARE @idEntidad INT , @idUsuario INT
	DECLARE @idDocumento INT ,@fechaEmision DATETIME

	BEGIN TRY
		
		SELECT TOP 1 @idDocumento = idDocumento FROM Recepcion.DocumentoDetalle WITH (NOLOCK) WHERE idDocumentoDetalle = @id

		SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

        IF NOT EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
			BEGIN
				SELECT '0'code,'Tu empresa no lleva Inventario' as 'message'
				RETURN 
			END 

		BEGIN TRAN

			DELETE FROM Recepcion.Doc_Detalle_Impuesto WHERE idDocumentoDetalle = @id

            IF EXISTS (SELECT 1 FROM Recepcion.DocumentoDetalle t INNER JOIN Articulo a WITH(NOLOCK) ON t.idArticulo = a.idArticulo WHERE t.idDocumento = @idDocumento  AND a.llevaInventario = 1)
				BEGIN
			
			        DECLARE @codDoc AS VARCHAR(2) ,@idTipoDocumento INT ,@idTipoTransaccion INT ,@idArticulo INT 
                           ,@idBodega INT ,@cantidad NUMERIC(18,2) ,@fraccion NUMERIC(18,5) ,@idMedida INT 
                           ,@fechaConsolidacion DATETIME ,@stock NUMERIC(18,5)

                    -- variables 

			        SELECT TOP 1 @codDoc = CASE WHEN codDoc = '01' THEN 'FE' WHEN codDoc = '04' THEN 'NC' END , @fechaEmision = cast(fechaEmision as date) FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento

                    SELECT TOP 1 @idArticulo = idArticulo
                                ,@idBodega   = idBodega 
                                ,@idMedida   = idMedida
                                ,@cantidad   = cantidad * IIF(@codDoc = 'FE',-1,1)
                    FROM Recepcion.DocumentoDetalle WITH (NOLOCK) WHERE idDocumentoDetalle = @id

			        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo  = @codDoc

			        SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo  = 'E'
                    
                    -- Articulo Fraccionado
                    IF EXISTS (SELECT 1 FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idMedida = @idMedida)
                        BEGIN
                            SELECT TOP 1 @cantidad = @cantidad  * conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idMedida = @idMedida
                        END
					
                    IF EXISTS (SELECT 1 FROM Inventario.Stock WHERE idArticulo = @idArticulo AND idBodega = @idBodega AND fechaConsolidacion >= @fechaEmision)
                        BEGIN
                            SELECT @cantidad = 0       
                        END 

                    -- TRAN 
			        UPDATE Inventario.Transaccion SET estado = 0 WHERE idDocumento = @idDocumento AND idTipoDocumento = @idTipoDocumento AND idTipoTransaccion = @idTipoTransaccion AND idArticulo = @idArticulo

                    UPDATE Inventario.Stock WITH(ROWLOCK) SET cantidad = cantidad + ISNULL(@cantidad,0) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

	                SELECT @stock = SUM(cantidad) FROM Inventario.Stock s WITH (NOLOCK) WHERE idArticulo = @idArticulo AND s.estado = 1

	                UPDATE dbo.Articulo WITH(ROWLOCK) SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo
				END 
					
                DELETE FROM Recepcion.DocumentoDetalle WHERE idDocumentoDetalle = @id

                IF NOT EXISTS(SELECT 1 FROM Recepcion.DocumentoDetalle WHERE idDocumento = @idDocumento)
				    BEGIN
					    UPDATE Recepcion.DocumentoRecibido SET complete = 0 WHERE idDocumento = @idDocumento
				    END
		COMMIT TRAN
		SELECT '1' code, 'Articulo eliminado exitosamente del stock' as 'message'
	END TRY

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoDetalle/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH

END
GO
