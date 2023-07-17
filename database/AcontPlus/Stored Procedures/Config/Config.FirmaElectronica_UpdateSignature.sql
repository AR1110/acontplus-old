USE [AcontPlus]
GO
/****** Object:  StoredProcedure [DocumentoTributario].[FirmaElectronica_Update]    Script Date: 7/17/2023 11:02:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2021-11-05
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID('Config.FirmaElectronica_UpdateSignature')IS NOT NULL
	DROP PROCEDURE Config.FirmaElectronica_UpdateSignature
GO
CREATE PROCEDURE Config.FirmaElectronica_UpdateSignature
     @idUsuarioRol INT
	,@id INT 
	,@fileName VARCHAR(300)
	,@firma VARBINARY(MAX)
	,@contentType VARCHAR(50)  
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON; 

	BEGIN TRY 
		BEGIN TRAN  
			UPDATE dbo.FirmaElectronica SET  
				nombreArchivo  = @fileName
				,mimeType       = @contentType
				,firma          = @firma 
			WHERE idFirmaElectronica = @id
			SELECT '1'code,'Actualizada exitosamente' as 'message'
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
		SELECT '0'code,ERROR_MESSAGE() as 'message'
		RETURN 
	END CATCH 
	--UPDATE dbo.FirmaElectronica SET contrasenia = @contrasenia, estado = @estado  where idFirmaElectronica = @idFirmaElectronica
	
END
