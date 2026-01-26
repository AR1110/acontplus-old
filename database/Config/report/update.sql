USE Acontplus
GO
/****** Object:  StoredProcedure [Config].[Reporte_Update]    Script Date: 27/5/2024 17:49:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [Config].[Report_Update] @userId INT, @id INT, @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	DECLARE @idUsuario INT

	
	DECLARE @codigo VARCHAR(10)
	DECLARE @reportPath VARCHAR(100) 
	DECLARE @contentType VARCHAR(50)
	DECLARE @storedProcedure VARCHAR(200)
	DECLARE @nombreReporte VARCHAR(200)
	DECLARE @estado BIT

	SELECT 
		@codigo = codigo 
		,@reportPath = reportPath
		,@contentType = contentType
		,@storedProcedure = storedProcedure 
		,@nombreReporte = nombreReporte
		,@estado = estado
	FROM OPENJSON(@json)
	WITH( 
		codigo VARCHAR(10)
		,reportPath VARCHAR(100) 
		,contentType VARCHAR(50)
		,storedProcedure VARCHAR(200)
		,nombreReporte VARCHAR(200)
		,estado BIT
	)

	 
	BEGIN TRY
		BEGIN TRAN
			UPDATE Config.Reporte SET codigo = @codigo
			,reportPath = @reportPath 
			,contentType = @contentType
			,storedProcedure = @storedProcedure
			,nombreReporte = @nombreReporte
			,estado = @estado
			WHERE idReporte = @id
			SELECT '0' code,'Actualizado Exitosamente' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '50001' code, ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			BEGIN
				ROLLBACK TRAN
			END
		SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        EXEC dbo.LogError
            @ModuleName = 'CONFIG',
            @BusinessProcess = 'REPORT_UPDATE',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';
	END CATCH
END
