use AcontPlus
GO
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
DROP PROC IF EXISTS Pet.MedicalHistory_Get
GO
CREATE OR ALTER PROCEDURE Vet.MedicalHistory_Get @userRoleId INT
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
            SELECT * FROM Vet.Behavior WITH (NOLOCK) WHERE [IsActive] = 1
            SELECT * FROM Vet.BehaviorStatus WITH (NOLOCK) WHERE [IsActive] = 1
            SELECT * FROM Vet.Disease WITH (NOLOCK) WHERE [IsActive] = 1
            SELECT * FROM Vet.DiseaseStatus WITH (NOLOCK) WHERE [IsActive] = 1
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
		,cc.businessName customer
		,CONVERT(VARCHAR, FORMAT([mh].[Date], ''dd-MM-yyyy''), 106) AS ''Date''
        ,mh.EstablecimientoId
        ,totalRecords = COUNT(*) over()
	FROM Vet.MedicalHistory mh WITH(NOLOCK)
		INNER JOIN Vet.Pet p WITH(NOLOCK) ON mh.PetId = p.Id
		INNER JOIN dbo.Cliente c WITH(NOLOCK) ON p.CustomerCompanyId = c.idCliente
        LEFT JOIN Customer.Customer cc WITH(NOLOCK) ON c.CustomerId = cc.Id
	WHERE c.idEntidad = @companyId
	    AND mh.establecimientoId = @idEstablecimiento
	    AND mh.IsDeleted = CAST(0 AS BIT) '


     IF LEN(LTRIM(RTRIM(@textSearch))) >= 3
                BEGIN
                    SET @sql = @sql + ' AND (p.[Name] LIKE ''%''+@textSearch+''%'' 
                                        OR cc.[BusinessName] LIKE ''%''+@textSearch+''%'') '
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
