


USE [AcontPlus]



IF OBJECT_ID('Sri.CodigoRetencion_Update')IS NOT NULL
	DROP PROCEDURE Sri.CodigoRetencion_Update 
GO

CREATE PROCEDURE Sri.CodigoRetencion_Update @id INT, @json VARCHAR(MAX)
AS
BEGIN 
	
	DECLARE @codigo VARCHAR(10);
	DECLARE @concepto VARCHAR(300)
	DECLARE @porcentajeMin NUMERIC(12, 2)
	DECLARE @estado BIT


	SELECT 
		@codigo = LTRIM(TRIM(codigo)),
		@concepto = LTRIM(TRIM(concepto)),
		@porcentajeMin = porcentajeMin,
		@estado = estado
	FROM OPENJSON(@json)
	WITH(
		codigo VARCHAR(10) '$.codigo',
		concepto VARCHAR(300) '$.concepto',
		porcentajeMin NUMERIC(18, 2) '$.porcentajeMin',
		estado BIT '$.estado'
	)
	

	BEGIN TRY 
		BEGIN TRAN 

			IF EXISTS(SELECT 1 FROM Sri.CodigoRetencion 
							   WHERE idCodigoRetencion <> @id AND codigo=LTRIM(TRIM(@codigo)) AND  concepto=LTRIM(TRIM(@concepto)) AND porcentajeMin=@porcentajeMin
					  )
				BEGIN 
					SELECT '0'code, 'Hay un impuesto registrado con estos datos' as 'message'
					RETURN 
				END 

				UPDATE Sri.CodigoRetencion SET codigo=@codigo, concepto=@concepto, porcentajeMin = @porcentajeMin, estado = @estado WHERE idCodigoRetencion = @id
			
				SELECT '1'code, 'Actualizado correctamente' as 'message'
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT CAST(0 as bit) result
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		VALUES (NEWID(),'/ImpuestoRenta/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),1)
		
	END CATCH



END 