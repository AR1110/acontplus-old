USE Acontplus
GO
 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Sri.PorcentajeRetIva_Update @Id INT, @Json VARCHAR(MAX)
AS
BEGIN 
	
	DECLARE @Codigo VARCHAR(10);
	DECLARE @Descripcion VARCHAR(300)
	DECLARE @Porcentaje NUMERIC(12, 2)	
	DECLARE @Estado BIT


	SELECT 
		@Codigo = LTRIM(TRIM(codigo)),
		@Descripcion = LTRIM(TRIM(descripcion)),
		@Porcentaje = porcentaje,		
		@Estado = estado
	FROM OPENJSON(@Json)
	WITH(
		codigo VARCHAR(10)  
		,descripcion VARCHAR(300)
		,porcentaje NUMERIC(18, 2)		
		,estado BIT  
	)
	

	BEGIN TRY 
		BEGIN TRAN 
		S
			IF EXISTS(SELECT 1 FROM Sri.PorcentajeRetIva
							   WHERE idPorcentajeRetIva <> @Id AND codigo=LTRIM(TRIM(@Codigo)) 
					  )
				BEGIN 
					SELECT '50001'code, 'Hay un Porcentaje Retencin Iva registrado con estos datos' as 'message'
					RETURN 
				END 

			IF EXISTS(SELECT 1 FROM Sri.PorcentajeRetIva
							   WHERE idPorcentajeRetIva <> @Id AND codigo=LTRIM(TRIM(@Codigo)) AND descripcion=LTRIM(TRIM(@Descripcion)) 
					  )
				BEGIN 
					SELECT '50001'code, 'Hay un Porcentaje Retencin Iva registrado con estos datos' as 'message'
					RETURN 
				END 

				UPDATE Sri.PorcentajeRetIva SET codigo=@Codigo, descripcion=@Descripcion, porcentaje = @Porcentaje, estado = @Estado WHERE idPorcentajeRetIva = @Id
			
				SELECT '0'code, 'Actualizado correctamente' as 'message'
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		INSERT INTO [Common].[ErrorLog] ([ErrorMethod],[ErrorNumber],[ErrorSeverity],[ErrorState],[ErrorProcedure],[ErrorLine],[ErrorMessage])
		VALUES ('PorcentajeRetIva/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE())

		SELECT '50001' code, 'Error en el procedimiento ' as 'message'
		
	END CATCH



END 