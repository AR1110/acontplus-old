USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04
-- Description:	sp for update tarifa impuestos
-- =============================================
CREATE OR ALTER PROCEDURE Sri.TarifaImpuesto_Update @id INT
	,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;

	BEGIN TRY
		DECLARE @codImpuesto VARCHAR(1)
		,@codigo VARCHAR(5)
		,@descripcion VARCHAR(300)
		,@porcentaje NUMERIC(4,2)
		,@estado BIT

		SELECT @codImpuesto = codImpuesto
			,@codigo = codigo
			,@descripcion = descripcion
			,@porcentaje = porcentaje 
			,@estado = estado
		FROM OPENJSON(@json) WITH (
									codImpuesto VARCHAR(1),
									codigo VARCHAR(5),
									descripcion VARCHAR(300),
									porcentaje NUMERIC(4,2),
									estado BIT
									)

		IF EXISTS (SELECT TOP 1 1 FROM Sri.TarifaImpuesto WITH (NOLOCK) 
					WHERE codImpuesto = @codImpuesto AND codigo = @codigo AND idTarifaImpuesto <> @id)
			BEGIN
				SELECT '50001' Code, Message = 'Este cdigo ya existe'
				RETURN
			END
		BEGIN TRAN
			UPDATE Sri.TarifaImpuesto 
			SET codImpuesto = @codImpuesto
			,codigo = @codigo
			,descripcion = @descripcion
			,porcentaje = @porcentaje
			,estado = @estado
			WHERE idTarifaImpuesto = @id 

        IF (@@ROWCOUNT > 0) 
        BEGIN
            COMMIT TRAN;
            SELECT '0' AS Code, 'Updated successfully' AS Message;
        END
        ELSE
        BEGIN
            ROLLBACK TRAN;
            SELECT '50001' AS Code, 'Failed to update' AS Message;
        END
	END TRY
	BEGIN CATCH
		SELECT '50001' Code, Message = 'Error al insertar!'
		IF (@@TRANCOUNT > 0)
			BEGIN 
				SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
                EXEC dbo.LogError
                    @ModuleName = 'SRI',
                    @BusinessProcess = 'TARIFA_IMPUESTO_UPDATE',
                    @ErrorCategory = 'BUSINESS_RULE',
                    @ErrorSeverityLevel = 'HIGH',
                    @ResponseTime = @ResponseTime,
                    @EnvironmentName = 'PROD',
                    @BuildVersion = '3.0.0';
			END
	END CATCH
END
GO
