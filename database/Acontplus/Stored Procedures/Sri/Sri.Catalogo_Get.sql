USE AcontPlus
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
-- Create date: 2023-02-21
-- Description:	SP FOR GET SRI CATALOGS
-- =============================================
IF OBJECT_ID(N'Sri.Catalogo_Get', N'P') IS NOT NULL
DROP PROCEDURE Sri.Catalogo_Get 
GO
CREATE PROCEDURE Sri.Catalogo_Get
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SELECT schema_name(t.schema_id) as schema_name,
		   t.name as table_name,
		   t.create_date,
		   t.modify_date
	FROM sys.tables t
	WHERE schema_name(t.schema_id) = 'Sri' -- put schema name here
	ORDER BY table_name;
END
GO
