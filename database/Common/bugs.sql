USE Acontplus
GO
/****** Object:  StoredProcedure [Config].[Solicitud_Get]    Script Date: 27/4/2023 14:21:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE OR ALTER PROCEDURE Common.Bugs_Get  @json VARCHAR(400), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @tipo INT;    
    DECLARE @pageIndex INT
    DECLARE @pageSize INT 
	  DECLARE @dateFrom DATETIME2
    DECLARE @dateTo DATETIME2  

	 
	SELECT 
		@tipo = tipo 
        ,@pageIndex = pageIndex 
        ,@pageSize = pageSize  
		 ,@dateFrom = dateFrom 
        ,@dateTo   = dateTo
	FROM OPENJSON(@json)
	WITH(
            tipo INT  
            ,pageIndex INT 
            ,pageSize INT  
			,dateFrom DATETIME2 
            ,dateTo DATETIME2
        )
	
	IF @tipo = 1
		BEGIN 

            SET @tableNames='bugs'

           DECLARE @params NVARCHAR(MAX) = '
				 @pageIndex INT,
				 @pageSize INT,
				 @dateFrom DATETIME2,
				 @dateTo DATETIME2
			'

            DECLARE @sql NVARCHAR(MAX) = N'
				SELECT 
					idErrorSistema,
					method,
					errorProcedure,
					errorMessage, 
					errorDate  = FORMAT(errorDate, ''dd/MM/yyyy HH:mm''),
					totalRecords = COUNT(*) OVER()
				FROM dbo.ErroresSistema
			--	WHERE CAST(errorDate AS DATE) BETWEEN CAST(@dateFrom AS DATE) AND CAST(@dateTo AS DATE)
				ORDER BY idErrorSistema DESC
				OFFSET @pageSize * (@pageIndex - 1) ROWS 
				FETCH NEXT @pageSize ROWS ONLY;
			'

			EXEC sp_executesql @sql, @params, @pageIndex, @pageSize, @dateFrom, @dateTo;


			
		END 

     
   
	
END 
