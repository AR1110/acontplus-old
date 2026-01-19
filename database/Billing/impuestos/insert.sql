USE AcontplusAdmin
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04
-- Description:	sp for insert tarifa impuestos
-- =============================================
CREATE OR ALTER PROCEDURE Sri.TarifaImpuesto_Insert @Json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;

	DECLARE @Id INT
		,@CodImpuesto VARCHAR(1)
		,@Codigo VARCHAR(5)
		,@Descripcion VARCHAR(300)
		,@Porcentaje NUMERIC(4,2)

	BEGIN TRY
		SELECT @CodImpuesto = codImpuesto
			,@Codigo = codigo
			,@Descripcion = descripcion
			,@Porcentaje = porcentaje 
		FROM OPENJSON(@Json) WITH (
									codImpuesto VARCHAR(1),
									codigo VARCHAR(5),
									descripcion VARCHAR(300),
									porcentaje NUMERIC(4,2)
									)

		IF EXISTS (SELECT TOP 1 1 FROM Acontplus.Sri.TarifaImpuesto WITH (NOLOCK) 
					WHERE codImpuesto = @CodImpuesto AND codigo = @Codigo)
			BEGIN
				SELECT '50001' Code, Message = 'Este cdigo ya existe'
				RETURN
			END
		BEGIN TRAN
			INSERT INTO Acontplus.Sri.TarifaImpuesto(codImpuesto, codigo, descripcion, porcentaje)
			VALUES (@CodImpuesto, @Codigo, @Descripcion, @Porcentaje)
			SET @Id = SCOPE_IDENTITY()
		IF (@Id > 0) 
			BEGIN
				COMMIT TRAN
				SELECT '0' Code, Message = 'Registrada correctamente'
			END
		ELSE
			BEGIN
				ROLLBACK TRAN
				SELECT '50001' Code, Message = 'No se pudo Insertar'
			END
	END TRY
	BEGIN CATCH
		SELECT '50001' Code, Message = 'Error al insertar!'
		IF (@@TRANCOUNT > 0)
			BEGIN 
				SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
                EXEC dbo.LogError
                    @ModuleName = 'SRI',
                    @BusinessProcess = 'TARIFA_IMPUESTO_INSERT',
                    @ErrorCategory = 'BUSINESS_RULE',
                    @ErrorSeverityLevel = 'HIGH',
                    @ResponseTime = @ResponseTime,
                    @EnvironmentName = 'PROD',
                    @BuildVersion = '3.0.0';
			END
	END CATCH
END
GO
