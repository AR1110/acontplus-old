USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPDocumentoElectronicoErrorInsert]    Script Date: 12/18/2022 2:16:19 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-06-09
-- Description:	sp for update doc elect
-- =============================================
-- 
IF OBJECT_ID(N'FactElect.Doc_Elect_Error_Insert', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Elect_Error_Insert 
GO
CREATE PROCEDURE FactElect.Doc_Elect_Error_Insert 
 @id INT
,@estado VARCHAR(30)
,@identificador VARCHAR(2)
,@mensaje VARCHAR(300)
,@informacionAdicional VARCHAR(500)
,@tipo VARCHAR(50)
,@xmlSri XML = NULL
AS

DECLARE @claveAcceso VARCHAR(50)

SELECT @claveAcceso = claveAcceso FROM dbo.DocumentoElectronico WHERE idDocumentoElectronico = @id
BEGIN
	BEGIN TRY 
		BEGIN TRAN  
			INSERT INTO dbo.DocumentoElectronicoError(xmlSri, claveAcceso, estado, identificador, mensaje, informacionAdicional, tipo, fechaRegistro)
			VALUES(@xmlSri, @claveAcceso, @estado, @identificador, @mensaje, @informacionAdicional, @tipo, dbo.ufnGetDateEcuador()) 
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0', ERROR_MESSAGE()
		IF(@@TRANCOUNT > 0)
			ROLLBACK TRAN
	END CATCH

END
