USE Acontplus 
go

CREATE OR ALTER VIEW Mechanical.v_Maintenance WITH SCHEMABINDING AS (
	SELECT Id
          ,SupportId
          ,[Date]
          ,Obs
          ,CompanyId
	FROM Mechanical.Maintenance ma WITH (NOLOCK)
)

