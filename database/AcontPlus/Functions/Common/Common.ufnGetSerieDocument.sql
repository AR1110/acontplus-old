USE Acontplus
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'Common' )
	--EXEC('CREATE SCHEMA [Common] AUTHORIZATION [dbo]');
	EXEC('CREATE SCHEMA [Common]');
GO

IF OBJECT_ID (N'Common.ufnGetSerieDocument', N'FN') IS NOT NULL
    DROP FUNCTION Common.ufnGetSerieDocument;
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-22
-- Description: function for get serie document
-- =============================================
CREATE FUNCTION Common.ufnGetSerieDocument
(
	@estab VARCHAR(3), @ptoEmi VARCHAR(3), @secuence INT, @joined BIT = 0
)
RETURNS VARCHAR(18)
AS
BEGIN
	DECLARE @serie VARCHAR(18)
	--
	IF @joined = 0
		SET @serie = (SELECT @estab + '-' + @ptoEmi + '-' + RIGHT('000000000' + CONVERT(VARCHAR, @secuence), 9))
	ELSE
		SET @serie = (SELECT @estab + @ptoEmi + RIGHT('000000000' + CONVERT(VARCHAR, @secuence), 9))

	RETURN @serie
END
GO

