USE Acontplus
GO
/****** Object:  StoredProcedure [Sri].[CodigoRetencion_Insert]    Script Date: 12/6/2024 15:09:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [Sri].[CodigoRetencion_Insert] @json VARCHAR(MAX)
AS
BEGIN 
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	
	DECLARE @codigo VARCHAR(10);
	DECLARE @concepto VARCHAR(300)
	DECLARE @porcentajeMin NUMERIC(12, 2)
	DECLARE @porcentajeMax NUMERIC(12, 2)



	SELECT 
		@codigo = LTRIM(TRIM(codigo))
		,@concepto = LTRIM(TRIM(concepto))
		,@porcentajeMin = porcentajeMin
		,@porcentajeMax = porcentajeMax
	FROM OPENJSON(@json)
	WITH(
		codigo VARCHAR(10) 
		,concepto VARCHAR(300)  
		,porcentajeMin NUMERIC(18, 2) 
		,porcentajeMax NUMERIC(18, 2)  
	)
	

	BEGIN TRY 
		BEGIN TRAN 

		IF EXISTS(SELECT 1 FROM Sri.CodigoRetencion  WHERE codigo=LTRIM(TRIM(@codigo)))
			BEGIN 
				SELECT '50001'code, 'Hay un impuesto registrado con este código' as 'message'
				RETURN 
			END 

			IF EXISTS(SELECT 1 FROM Sri.CodigoRetencion 
							   WHERE concepto=LTRIM(TRIM(@concepto))  
					  )
				BEGIN 
					SELECT '50001'code, 'Hay un impuesto registrado con estos datos' as 'message'
					RETURN 
				END 

				INSERT INTO Sri.CodigoRetencion (codigo, concepto, porcentajeMin,porcentajeMax)
				VALUES(@codigo, @concepto, @porcentajeMin,@porcentajeMax)
				SELECT '0'code, 'Registrado correctamente' as 'message'
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
            @BusinessProcess = 'CODIGO_RETENCION_INSERT',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';

		SELECT '50001' code, 'Error en el procedimiento ' as 'message'
		
	END CATCH



END 