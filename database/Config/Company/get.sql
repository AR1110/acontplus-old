USE Acontplus
GO
/****** Object:  StoredProcedure [App].[aspEntidad_Insert]    Script Date: 10/7/2022 11:49:46 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-04
-- Description:	Proceso Almacenado para listar las entidades
-- =============================================
CREATE OR ALTER PROCEDURE Config.Company_Get 
	 @UserRoleId INT
    ,@Json VARCHAR(MAX)
    ,@TableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON
	SET LANGUAGE SPANISH;

	DECLARE @Tipo INT 
		,@TextSearch VARCHAR(100)
		,@PageSize INT 
		,@PageIndex INT 

	SELECT @Tipo = tipo
		,@PageSize = pageSize
		,@PageIndex  = pageIndex
		,@TextSearch = REPLACE(textSearch,SPACE(1),'%')
	FROM OPENJSON(@Json) WITH (
								tipo INT '$.tipo', 
								pageIndex INT,
								pageSize  INT,
								textSearch VARCHAR(100)
							)

	-- GET 
	IF @Tipo = 1
		BEGIN
			SET @TableNames = 'companies'
			SELECT Id
				,BusinessName
				,TradeName
				,[IDCard]
				,[Email]
				,[Address]
				,[Telephone]
				,[IsActive]
				,COUNT(*) OVER() TotalRecords
			FROM Config.Company WITH (NOLOCK)
			WHERE IsDeleted = CAST(0 AS BIT)
			ORDER BY CreatedAt DESC OFFSET @PageSize*(@PageIndex-1) ROWS FETCH NEXT @PageSize ROWS ONLY 
			RETURN 
		END

	--MAIN search
	IF @Tipo = 3
		BEGIN
			SET @TableNames = 'companies'
			SELECT Id
				,BusinessName
				,TradeName
				,[IdCard]
				,[Email]
				,[Address]
				,[Telephone]
				,[IsActive]
				,COUNT(*) OVER() TotalRecords
			FROM Config.Company WITH (NOLOCK)
			WHERE IsDeleted = CAST(0 AS BIT)
			AND (
			      IdCard             LIKE '%' + @TextSearch + '%'
			   OR BusinessName     LIKE '%' + @TextSearch + '%'
			   OR TradeName LIKE '%' + @TextSearch + '%'
			)
			ORDER BY Id DESC OFFSET @PageSize*(@PageIndex-1) ROWS FETCH NEXT @PageSize ROWS ONLY 
			RETURN 
		END 

	-- SEARCH ENTERPIRCE
	IF @Tipo = 2
		BEGIN
			
			SET @TableNames = 'companies'
			SELECT c.Id
			      ,IdCard
				  ,TradeName
				  ,BusinessName
				  ,c.Uuid
			FROM Config.Company c WITH (NOLOCK) 
			WHERE [IsActive] = 1 AND 
		    (
			      IDCard             LIKE '%' + @TextSearch + '%'
			   OR TradeName     LIKE '%' + @TextSearch + '%'
			   OR BusinessName LIKE '%' + @TextSearch + '%'
			)
			ORDER BY c.BusinessName DESC
		END 

END
