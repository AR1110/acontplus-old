-- ================================================
-- Template generated from Template Explorer using:
-- Create Inline Function (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the function.
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
ALTER FUNCTION Config.F_Aplicacion_ConvertJson 
(	
	-- Add the parameters for the function here
	@json NVARCHAR(MAX)
)
RETURNS TABLE 
AS
RETURN 
(
	-- Add the SELECT statement with parameter references here
	SELECT 
		codigo = LTRIM(RTRIM(codigo)),
		descripcion = LTRIM(RTRIM(descripcion)),
		urlApp = LTRIM(RTRIM(urlApp)),
		hostApp = LTRIM(RTRIM(hostApp)),
		connectionStrings = LTRIM(RTRIM(connectionStrings))
	FROM OPENJSON(@json)
	WITH (codigo NVARCHAR(10) '$.codigo',
		  descripcion NVARCHAR(250) '$.descripcion',
		  urlApp NVARCHAR(300) '$.urlApp',
		  hostApp NVARCHAR(500) '$.hostApp',
		  connectionStrings NVARCHAR(MAX) '$.connectionStrings')
)
GO
