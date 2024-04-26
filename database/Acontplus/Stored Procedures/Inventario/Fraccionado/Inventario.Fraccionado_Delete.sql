USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspArticuloFraccionadoDelete]    Script Date: 10/11/2022 10:14:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-07-12
-- Description:	SP para eliminar
-- =============================================
 
CREATE OR ALTER PROCEDURE Inventario.Fraccionado_Delete @userRoleId INT ,@id INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    DECLARE @idMedida INT

	BEGIN TRY 
        
        SELECT TOP 1 @idMedida = idMedida FROM dbo.ArticuloFraccionado WITH (ROWLOCK) WHERE idArticuloFraccionado = @id

        IF EXISTS(SELECT 1 FROM Inventario.TransaccionDetalle WITH (NOLOCK) WHERE idArticulo = @id AND idMedida = @idMedida AND estado = 1)
            BEGIN
                SELECT Common.ufnSpResponse('0', 'El Articulo tiene realizada transacciones no pueden ser editado', NULL)  			
			    RETURN 
            END 

		BEGIN TRAN 
			DELETE FROM ArticuloFraccionado WHERE idArticuloFraccionado = @id
		COMMIT TRAN 
		SELECT Common.ufnSpResponse('1', 'Eliminado Correctamente', NULL)
	END TRY


	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT Common.ufnSpResponse('0', 'Info: Error en el procedimiento de actualizar ' + ERROR_MESSAGE(), NULL) 		
		RETURN
	END CATCH 
END
