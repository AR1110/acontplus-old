USE Acontplus
GO
/****** Object:  StoredProcedure [Sri].[CodigoRetencion_Insert]    Script Date: 12/6/2024 15:09:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [Sri].[PorcentajeRetIva_Insert] @json VARCHAR(MAX)
AS
BEGIN 
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;
	
	DECLARE @codigo VARCHAR(10);
	DECLARE @descripcion VARCHAR(300)
	DECLARE @porcentaje NUMERIC(12, 2)	



	SELECT 
		@codigo = LTRIM(TRIM(codigo))
		,@descripcion = LTRIM(TRIM(descripcion))
		,@porcentaje = porcentaje		
	FROM OPENJSON(@json)
	WITH(
		codigo VARCHAR(10) 
		,descripcion VARCHAR(300)  
		,porcentaje NUMERIC(18, 2) 		
	)
	

	BEGIN TRY 
		BEGIN TRAN 

		IF EXISTS(SELECT 1 FROM AcontPlus.Sri.PorcentajeRetIva  WHERE codigo=LTRIM(TRIM(@codigo)))
			BEGIN 
				SELECT '50001'code, 'Hay un Porcentaje Retencin Iva registrado con este cdigo' as 'message'
				RETURN 
			END 

			IF EXISTS(SELECT 1 FROM AcontPlus.Sri.PorcentajeRetIva
							   WHERE descripcion=LTRIM(TRIM(@descripcion))  
					  )
				BEGIN 
					SELECT '50001'code, 'Hay un Porcentaje Retencin Iva registrado con estos datos' as 'message'
					RETURN 
				END 

				INSERT INTO AcontPlus.Sri.PorcentajeRetIva (codigo, descripcion, porcentaje)
				VALUES(@codigo, @descripcion, @porcentaje)
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
            @BusinessProcess = 'PORCENTAJE_RET_IVA_INSERT',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';

		SELECT '50001' code, 'Error en el procedimiento ' as 'message'
		
	END CATCH



END 