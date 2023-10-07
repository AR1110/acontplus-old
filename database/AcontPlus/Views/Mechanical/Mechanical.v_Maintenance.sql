USE Acontplus 
GO

CREATE OR ALTER VIEW Mechanical.v_Maintenance WITH SCHEMABINDING AS (
	SELECT Id
          ,SupportId
          ,[Date]
          ,Obs
          ,CompanyId
          ,Total
	FROM Mechanical.Maintenance ma WITH (NOLOCK)
)