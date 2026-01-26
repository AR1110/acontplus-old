USE Acontplus
GO
/****** Object:  StoredProcedure [Sri].[CodigoRetencion_Update]    Script Date: 12/6/2024 15:24:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [Sri].[CodigoRetencion_Update] @id INT, @json VARCHAR(MAX)
AS
BEGIN 
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	
	DECLARE @codigo VARCHAR(10);
	DECLARE @concepto VARCHAR(300)
	DECLARE @porcentajeMin NUMERIC(12, 2)
	DECLARE @porcentajeMax NUMERIC(12, 2)
	DECLARE @estado BIT


	SELECT 
		@codigo = LTRIM(TRIM(codigo)),
		@concepto = LTRIM(TRIM(concepto)),
		@porcentajeMin = porcentajeMin,
		@porcentajeMax = porcentajeMax,
		@estado = estado
	FROM OPENJSON(@json)
	WITH(
		codigo VARCHAR(10)  
		,concepto VARCHAR(300)
		,porcentajeMin NUMERIC(18, 2)
		,porcentajeMax NUMERIC(18, 2)
		,estado BIT  
	)
	

	BEGIN TRY 
		BEGIN TRAN 

			IF EXISTS(SELECT 1 FROM Sri.CodigoRetencion 
							   WHERE idCodigoRetencion <> @id AND codigo=LTRIM(TRIM(@codigo)) 
					  )
				BEGIN 
					SELECT '50001'code, 'Hay un impuesto registrado con estos datos' as 'message'
					RETURN 
				END 

			IF EXISTS(SELECT 1 FROM Sri.CodigoRetencion 
							   WHERE idCodigoRetencion <> @id AND codigo=LTRIM(TRIM(@codigo))  AND concepto=LTRIM(TRIM(@concepto))  
					  )
				BEGIN 
					SELECT '50001'code, 'Hay un impuesto registrado con estos datos' as 'message'
					RETURN 
				END 

				UPDATE Sri.CodigoRetencion SET codigo=@codigo, concepto=@concepto, porcentajeMin = @porcentajeMin, porcentajeMax=@porcentajeMax, estado = @estado WHERE idCodigoRetencion = @id
			
				SELECT '0'code, 'Actualizado correctamente' as 'message'
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        EXEC dbo.LogError
            @ModuleName = 'SRI',
            @BusinessProcess = 'CODIGO_RETENCION_UPDATE',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';

		SELECT '50001' code, 'Error en el procedimiento ' as 'message'
		
	END CATCH



END 