SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-14
-- Description:	sp for insert order restaurant
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Order_Insert @userRoleId INT
,@json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;

	DECLARE @itemsJson NVARCHAR(MAX)


	BEGIN TRY
		BEGIN TRAN
			
		COMMIT TRAN

	END TRY
	BEGIN CATCH
		
	END CATCH

END
GO
