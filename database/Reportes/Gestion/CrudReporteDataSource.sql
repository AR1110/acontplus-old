



USE [AcontPlus]
GO 

/****** Object:  StoredProcedure [Reporte].[R_Get]    Script Date: 3/3/2023 13:19:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('Reporte.R_Get')IS NOT NULL
	DROP PROCEDURE Reporte.R_Get 
GO


-- Reporte.R_Get '{"typeList": 2, "id": 12}'
CREATE PROCEDURE [Reporte].[R_Get] @json VARCHAR(200)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;


	DECLARE @typeList VARCHAR(2)
	DECLARE @id INT 

	SELECT 
		 @typeList = typeList 
		,@id       = id
	FROM OPENJSON(@json)
	WITH(
		typeList VARCHAR(2) '$.typeList',
		id INT               '$.id'
	)

	IF @typeList = 1
		BEGIN	
			SELECT 
				idReporteParametro
				,codigo
				,reportPath
				,contentType
				,dataSource
				,storedProcedure
				,ISNULL(nombreReporte, '') as nombreReporte
				,estado
			FROM dbo.ReporteParametro
			ORDER BY storedProcedure 
		END 

	IF @typeList = 2
		BEGIN 
			SELECT 
			*
			FROM dbo.ReporteDataSource WHERE idReporteParametro = @id 
		END 


END 

GO


IF OBJECT_ID('Reporte.DataSource_Save')IS NOT NULL
	DROP PROCEDURE Reporte.DataSource_Save
GO

-- exec Reporte.DataSource_Save '{"idReporteDataSource": 166,"idReporteParametro": 34,"position": 3,"dataSource": "tes","estado": true,  "typeRegister": 2}'

CREATE PROCEDURE [Reporte].[DataSource_Save] @json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 

	DECLARE @typeRegister VARCHAR 
	DECLARE @id INT 
	DECLARE @idReporteParametro INT 
	DECLARE @dataSource VARCHAR(50)
	DECLARE @position INT 
	DECLARE @estado BIT 


	SELECT 
		@typeRegister = typeRegister,
		@id           = id,
		@idReporteParametro = idReporteParametro,
		@dataSource   = dataSource,
		@position     = position,
		@estado       = estado 
	FROM OPENJSON(@json)
	WITH(
		typeRegister INT '$.typeRegister',
		id INT '$.idReporteDataSource',
		idReporteParametro INT '$.idReporteParametro',
		dataSource VARCHAR(50) '$.dataSource',
		position INT '$.position',
		estado BIT '$.estado'
	)

	BEGIN TRY
		BEGIN TRAN 
			IF @typeRegister = 1
				BEGIN 
					INSERT INTO dbo.ReporteDataSource(idReporteParametro, position, dataSource)VALUES(@idReporteParametro, @position, @dataSource)										
				END 
			IF @typeRegister = 2
				BEGIN 
					UPDATE dbo.ReporteDataSource SET position = @position, dataSource = @dataSource, estado = @estado WHERE idReporteDataSource = @id					
				END 
				SELECT '1'code, 'message' = IIF(@typeRegister=1, 'Registrado Existosamente', 'Actualizado Existosamente')
		COMMIT TRAN
	END TRY 
	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento ' + ERROR_MESSAGE() as 'message', ''
	END CATCH 
		
	


END 
GO

IF OBJECT_ID('Reporte.DataSource_Delete')IS NOT NULL
	DROP PROCEDURE Reporte.DataSource_Delete
GO

CREATE PROCEDURE Reporte.DataSource_Delete @json VARCHAR(200)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 

	DECLARE @id INT 

	SELECT 		
		@id = id
	FROM OPENJSON(@json)
	WITH(	
		id INT '$.idReporteDataSource'							
	)


	BEGIN TRY
		BEGIN TRAN 
			DELETE FROM ReporteDataSource WHERE idReporteDataSource = @id
			SELECT '1'code, 'message' = 'Eliminada Existosamente'
		COMMIT TRAN
	END TRY 
	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento de Eliminar' + ERROR_MESSAGE() as 'message'
	END CATCH 
	


END 


