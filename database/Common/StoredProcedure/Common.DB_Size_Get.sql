USE [Acontplus]
GO
/****** Object:  StoredProcedure [Common].[DB_Size_Get]    Script Date: 7/6/2024 11:59:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-12-21
-- Description:	SP FOR GET DATABASE SIZE
-- =============================================
CREATE OR ALTER   PROCEDURE [Common].[DB_Size_Get]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON; 

	--SIZE OF TABLES IN DB

	create table #TableSize (
		Name varchar(255),
		[rows] int,
		reserved varchar(255),
		data varchar(255),
		index_size varchar(255),
		unused varchar(255))
	create table #ConvertedSizes (
		Name varchar(255),
		[rows] int,
		reservedKb int,
		dataKb int,
		reservedIndexSize int,
		reservedUnused int)

	EXEC sp_MSforeachtable @command1="insert into #TableSize
	EXEC sp_spaceused '?'"
	insert into #ConvertedSizes (Name, [rows], reservedKb, dataKb, reservedIndexSize, reservedUnused)
	select name, [rows], 
	SUBSTRING(reserved, 0, LEN(reserved)-2), 
	SUBSTRING(data, 0, LEN(data)-2), 
	SUBSTRING(index_size, 0, LEN(index_size)-2), 
	SUBSTRING(unused, 0, LEN(unused)-2)
	from #TableSize


	select * from #ConvertedSizes
	where rows > 0
	order by dataKb desc

	drop table #TableSize
	drop table #ConvertedSizes
END
