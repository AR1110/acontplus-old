use AcontPlus
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
-- Create date: 2022-07-06
-- Description:	sp for get medical histories
-- =============================================
CREATE OR ALTER PROCEDURE Pet.MedicalHistory_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE  @companyId INT 
            ,@pageIndex INT
            ,@pageSize INT
            ,@textSearch VARCHAR(100)
            ,@sql NVARCHAR(MAX)
            ,@params NVARCHAR(MAX)
            ,@idEstablecimiento INT
            ,@tipo INT


	SET @companyId = (SELECT idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)
	
    SELECT @idEstablecimiento = idEstablecimiento
        ,@pageIndex = pageIndex
        ,@pageSize = pageSize
        ,@textSearch = textSearch
        ,@tipo = tipo
    FROM OPENJSON(@json) WITH(
		                       idEstablecimiento INT '$.idEstablecimiento',
                               pageIndex		    INT         '$.pageIndex',
		                       pageSize		    INT         '$.pageSize',
                               textSearch         VARCHAR(20) '$.textSearch',
                               tipo INT
	                          )

    IF (@tipo = 1)
        BEGIN
            SET @tableNames = 'estabs'
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
            RETURN
        END

    IF (@tipo = 2)
        BEGIN
            SET @tableNames = 'behaviors,behaviorsStatuses,diseases,diseasesStatuses,estabs'
            SELECT * FROM Pet.Behavior WITH (NOLOCK) WHERE [Enabled] = 1
            SELECT * FROM Pet.BehaviorStatus WITH (NOLOCK) WHERE [Enabled] = 1
            SELECT * FROM Pet.Disease WITH (NOLOCK) WHERE [Enabled] = 1
            SELECT * FROM Pet.DiseaseStatus WITH (NOLOCK) WHERE [Enabled] = 1
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
            RETURN
        END

    SET @tableNames = 'medicalHistories'

    SET @params = N'@companyId INT, @idEstablecimiento INT, @pageIndex INT, @pageSize INT, @textSearch VARCHAR(20)'

    SET @sql = '
	SELECT mh.Id
        ,mh.Observations
        ,mh.Age
        ,mh.[Weight]
        ,p.[Name] petName
        ,p.Color
		,c.businessName customer
		,[mh].[Date]
        ,mh.EstablecimientoId
        ,totalRecords = COUNT(*) over()
	FROM Pet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Pet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN Customer.Customer c WITH(NOLOCK) ON p.CustomerId = c.Id
	WHERE p.CompanyId = @companyId
	    AND mh.establecimientoId = @idEstablecimiento
	    AND mh.Deleted is null '


     IF LEN(LTRIM(RTRIM(@textSearch))) >= 3
                BEGIN
                    SET @sql = @sql + ' AND p.[Name] LIKE ''%''+@textSearch+''%'' 
                                        OR c.[BusinessName] LIKE ''%''+@textSearch+''%'' '
                END
                
	        SET @sql = @sql + ' ORDER BY mh.Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'
		           
	        EXEC sp_executesql @sql 
                                ,@params
                                ,@companyId
                                ,@idEstablecimiento
                                ,@pageIndex
                                ,@pageSize
                                ,@textSearch
END
GO
