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
IF OBJECT_ID('Restaurant.Floors_Update') IS NOT NULL
BEGIN 
	DROP PROC Restaurant.Floors_Update
END
GO
CREATE PROC Restaurant.Floors_Update
@userRoleId INT
,@id INT
,@json NVARCHAR(MAX)
AS
BEGIN
	DECLARE @Code VARCHAR(5)
		,@Description VARCHAR(50)
		,@Capacity INT
		,@CodEstad VARCHAR(50)
		,@Enabled BIT
		,@UpdateAt DATETIME
		,@UserId INT
END
GO

select * from Restaurant.Floor