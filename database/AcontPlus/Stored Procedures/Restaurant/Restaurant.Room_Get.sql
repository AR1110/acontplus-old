USE Acontplus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
-- Restaurant.Room_Get 0, '{"value": "1"}', ''
CREATE OR ALTER PROC Restaurant.Room_Get
@userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(600) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SET @tableNames = 'rooms'
	SELECT * FROM Restaurant.Room WHERE Deleted IS NULL
END
GO