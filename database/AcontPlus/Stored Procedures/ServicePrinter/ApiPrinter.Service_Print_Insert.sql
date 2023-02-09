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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'ApiPrinter.Service_Print_Insert', N'P') IS NOT NULL
DROP PROCEDURE ApiPrinter.Service_Print_Insert
GO
CREATE PROCEDURE ApiPrinter.Service_Print_Insert @idRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codigo VARCHAR(50)
	DECLARE @SP VARCHAR(MAX)
	DECLARE @codEstab VARCHAR(50)

	SELECT @codigo = codigo, @codEstab = codEstab FROM OPENJSON(@json) WITH (codigo VARCHAR(100) '$.codigo',codEstab VARCHAR(50) '$.codEstab')

	SELECT @SP = storedProcedure FROM dbo.ReporteParametro WHERE codigo = @codigo
	
	IF NOT EXISTS (SELECT 1 FROM dbo.ReporteParametro WHERE codigo = @codigo AND estado = 1)
		BEGIN
			SELECT '0' code,'No existe ningun parametro de impresion para este documento' as 'message'
			RETURN 
		END 

	IF NOT EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND estado = 1 AND predeterminada = 1)
		BEGIN
			SELECT '0' code,'No esta configurada ninguna impresora en el establecimiento: '+nombreComercial as 'message' FROM Sri.Establecimiento WHERE codEstab = @codEstab
			RETURN 
		END 

	BEGIN TRY	
		BEGIN TRAN
			EXEC @SP @idRol,@json
		COMMIT TRAN 
		SELECT '1' code,'Imprimiendo...' as 'message'
	END TRY 

	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		SELECT '0' code,'Error en el procedimiento'+ ERROR_MESSAGE() as 'message'
		RETURN
	END CATCH 

END
GO
