USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Delete]    Script Date: 1/30/2023 10:06:10 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ignacio Manchu.
-- Create date: 2021-07-09
-- Description:	SP para eliminar los datos de los articulos 
-- =============================================
CREATE OR ALTER PROC Inventario.Articulo_Delete
@idRol INT
,@id INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	BEGIN TRY
		IF EXISTS(SELECT 1 FROM Articulo WHERE idArticulo = @id AND estado = 0)
			BEGIN
				SELECT '0'code,'El Articulo esta activo en uso para el sistema no se puede eliminar' as 'message', '' as payload
				RETURN
			END 
		BEGIN TRAN 
			UPDATE  Articulo SET estado = 0 WHERE idArticulo = @id
		COMMIT TRAN
		SELECT '1'code,'Eliminado Correctamente' as 'message', '' as payload
		RETURN 
	END TRY  

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END

		SELECT '0'code, 'Info: Error en el procedimiento de eliminar ' + ERROR_MESSAGE() as 'message', '' as payload		
	END CATCH 
END
