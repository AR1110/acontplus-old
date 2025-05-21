USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspSubFamiliaDelete]    Script Date: 10/11/2022 11:19:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-21
-- Description:	SP para eliminar subFamilias 
-- =============================================
IF OBJECT_ID(N'Restaurant.Category_Update_Cancel', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.Category_Update_Cancel
GO
CREATE PROCEDURE Restaurant.Category_Update_Cancel @idUsuarioRol int,@id int 
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	BEGIN TRY
		BEGIN TRAN 
			UPDATE dbo.SubFamilia SET estado = 0 WHERE idSubFamilia = @id
		COMMIT TRAN 
		SELECT '1'code,'Anulado Correctamente' as 'message'
		RETURN ;
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
		RETURN 
	END CATCH 
END
