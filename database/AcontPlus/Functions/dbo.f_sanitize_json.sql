-- ================================================
-- Template generated from Template Explorer using:
-- Create Scalar Function (New Menu).SQL
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
-- Author:		Alexis Ramirez
-- Create date: 5/11/2023 
-- Description:	<Description, ,>
-- =============================================
IF OBJECT_ID(N'dbo.f_sanitize_json', N'FN') IS NOT NULL
DROP FUNCTION dbo.f_sanitize_json
GO
CREATE FUNCTION dbo.f_sanitize_json
(
	@json VARCHAR(MAX)
)
RETURNS VARCHAR(MAX)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @jsonSanitaze AS VARCHAR(MAX)

	SET @jsonSanitaze = (REPLACE((REPLACE(@json,'[','')),']',''))

	-- Return the result of the function
	RETURN @jsonSanitaze

END
GO

