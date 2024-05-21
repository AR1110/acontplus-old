USE [AcontPlus]
GO
/****** Object: StoredProcedure [dbo].[aspSubFamiliaUpdate]    Script Date: 10/11/2022 11:17:46 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez - Danis Manchu.
-- Create date: 2021-06-21
-- Description:	Sp para actualizar las subfamilias
-- =============================================
-- Restaurant.Category_Update 
IF OBJECT_ID(N'Restaurant.Category_Update', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.Category_Update
GO
CREATE PROCEDURE Restaurant.Category_Update
@idUsuarioRol INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON
	SET LANGUAGE SPANISH
	DECLARE @idFamilia INT
			,@descripcion VARCHAR(50)
			,@montoObjetivo NUMERIC(10,5)
			,@estado BIT

	SELECT @idFamilia		= ISNULL(idFamilia, 0)
			,@descripcion	= ISNULL(descripcion, '')
			,@montoObjetivo	= ISNULL(montoObjetivo, 0)
			,@estado		= ISNULL(estado, 0)
	FROM OPENJSON(@json) 
	WITH(
	 idFamilia INT					'$.idFamilia'
	 ,descripcion VARCHAR(50)		'$.descripcion'
	 ,montoObjetivo NUMERIC(10,5)	'$.montoObjetivo'
	 ,estado BIT					'$.estado'
	)
	
	BEGIN TRY
		BEGIN TRAN 
			UPDATE SubFamilia SET
				 idFamilia     = CASE WHEN @idFamilia = 0 THEN NULL ELSE @idFamilia END  
				,descripcion   = LTRIM(RTRIM(@descripcion))
				,montoObjetivo = @montoObjetivo
				,estado        = @estado
			WHERE idSubFamilia = @id
		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
		RETURN;
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
