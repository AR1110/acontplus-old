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
-- Author:		Ivan Paz
-- Create date: 2023-08-10
-- Description: sp for get restaurant menus
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.Menu_Get @userRoleId INT,
											  @json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SELECT *
	FROM Restaurant.Menu
END
GO
