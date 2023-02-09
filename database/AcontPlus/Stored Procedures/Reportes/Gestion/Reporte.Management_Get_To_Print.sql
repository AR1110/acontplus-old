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
IF OBJECT_ID(N'Reporte.Management_Get_To_Print', N'P') IS NOT NULL
DROP PROCEDURE Reporte.Management_Get_To_Print
GO
CREATE PROCEDURE Reporte.Management_Get_To_Print @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @versionComp VARCHAR(10)

	DECLARE @codigo VARCHAR(10)
	DECLARE @format VARCHAR(50)	
	DECLARE @contentType VARCHAR(25)
	DECLARE @fileName VARCHAR(200)
	DECLARE @rdlcParams VARCHAR(200)
	DECLARE @reportPath VARCHAR(200)
	DECLARE @storedProcedure VARCHAR(200)
	DECLARE @id INT
	DECLARE @jsonParameters VARCHAR(max)




	SELECT @codigo = codigo,@format = formato, @id = id, @versionComp = versionComp FROM OPENJSON(@json) WITH (codigo VARCHAR(100) '$.codigo',formato VARCHAR(100) '$.format',id INT '$.id', versionComp VARCHAR(10)) AS jsd

	SELECT @reportPath = reportPath ,@storedProcedure = storedProcedure FROM dbo.ReporteParametro WHERE codigo = @codigo

	IF @format = 'pdf'
		BEGIN
			SET @contentType = 'application/pdf';
			SET @fileName = (SELECT nombreReporte + '.pdf' FROM dbo.ReporteParametro WHERE codigo = @codigo)
		END

	IF @format = 'excel'
		BEGIN
			SET @contentType = 'application/vnd.ms-excel';
			SET @fileName = (SELECT nombreReporte + '.xls' FROM dbo.ReporteParametro WHERE codigo = @codigo)
		END

	IF @format = 'word'
		BEGIN
			SET @contentType = 'application/msword';
			SET @fileName = (SELECT nombreReporte + '.docx' FROM dbo.ReporteParametro WHERE codigo = @codigo)
		END

	SET @rdlcParams = (
						SELECT reportPath  = @reportPath 
						      ,'format'    = @format
							  ,contentType = @contentType							  						  
						FOR JSON PATH
						)

	SET @jsonParameters = ( SELECT rdlcParams = @rdlcParams, id = @id, versionComp = @versionComp FOR JSON PATH )

	EXEC @storedProcedure @jsonParameters
END
GO
