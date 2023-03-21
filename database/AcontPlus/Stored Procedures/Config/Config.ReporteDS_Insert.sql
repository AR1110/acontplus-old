USE [AcontPlus]
GO
DROP PROCEDURE IF EXISTS [Reporte].[DataSource_Save]
GO
/****** Object:  StoredProcedure [Reporte].[DataSource_Save]    Script Date: 03/20/2023 5:44:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2023-03-20
-- Description:	ASP PARA INSERTAR REPORTES DS
-- =============================================
IF OBJECT_ID(N'Config.ReporteDS_Insert', N'P') IS NOT NULL
DROP PROCEDURE Config.ReporteDS_Insert
GO
CREATE PROCEDURE Config.ReporteDS_Insert @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
 
	DECLARE @idReporteParametro INT 
	DECLARE @dataSource VARCHAR(50)
	DECLARE @position INT 
	DECLARE @estado BIT
	DECLARE @idUsuario INT

	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)

	SELECT  
		@idReporteParametro = idReporteParametro,
		@dataSource   = dataSource,
		@position     = position,
		@estado       = estado 
	FROM OPENJSON(@json)
	WITH(
		idReporteParametro INT '$.idReporteParametro',
		dataSource VARCHAR(50) '$.dataSource',
		position INT '$.position',
		estado BIT '$.estado'
	)

	BEGIN TRY
		BEGIN TRAN  
			INSERT INTO dbo.ReporteDataSource(idReporteParametro, position, dataSource)VALUES(@idReporteParametro, @position, @dataSource)										
	 
			SELECT '1'code, 'message' = 'Registrado Existosamente'
		COMMIT TRAN
	END TRY 
	BEGIN CATCH 
		SELECT '0'code,'Info: Error en el procedimiento ' + ERROR_MESSAGE() as 'message'
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), '/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END 
