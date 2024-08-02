USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspSubFamiliaGet]    Script Date: 10/11/2022 11:14:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-21
-- Description:	SP Para listar las subfamilias
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Subfamilia_Get @idUsuarioRol INT,@json VARCHAR(MAX) 
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @byRecords INT
	DECLARE @ByEntidad INT 
	DECLARE @byIndex INT 
	DECLARE @typelist INT
	DECLARE @bySize INT 
	DECLARE @pagination NVARCHAR(MAX) = 'OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'
	
	DECLARE @params NVARCHAR(MAX)= '@pageIndex INT,
		                            @pageSize INT,
								    @idEntidad INT,
									@totalRecords INT'
	
	DECLARE @sql NVARCHAR(MAX) = 'SELECT idSubFamilia = sf.idSubFamilia
									    ,idFamilia = ISNULL(sf.idFamilia,0)
									    ,descripcion = sf.descripcion
									    ,estado = sf.estado
									    ,siglas = sf.siglas
									    ,codigo = sf.codigo
									    ,montoObjetivo = ISNULL(sf.montoObjetivo,0)
									    ,nombreFamilia = ISNULL(sf.familia, ''Ninguna'')
									    ,ultimoSecuencial
                                        ,s3ObjectKey
									    ,s3ObjectUrl
                                        ,ISNULL(subcategoryPhotoId,0) AS subcategoryPhotoId
									    ,COUNT(*) OVER() as totalRecords
								   FROM Inventario.v_Subfamilia  sf WITH (NOLOCK) 
								   WHERE sf.idEntidad = @idEntidad '
	
	SELECT TOP 1 @ByEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol 
	
	SET @byRecords = (SELECT COUNT(*) FROM dbo.SubFamilia WITH (NOLOCK) WHERE idEntidad = @ByEntidad )
		   
	SELECT @byIndex = pageIndex,@bySize = pageSize FROM OPENJSON(@json) WITH(pageIndex INT '$.pageIndex',pageSize INT '$.pageSize')

	SET @sql= @sql+' ORDER BY sf.idSubFamilia DESC '+IIF(@typelist=1,'',@pagination)

	EXEC sp_executesql 
			    @sql
			    ,@params 
			    ,@idEntidad = @byEntidad
				,@pageIndex = @byIndex
				,@pageSize = @bySize
				,@totalRecords = @byRecords
	    
END
