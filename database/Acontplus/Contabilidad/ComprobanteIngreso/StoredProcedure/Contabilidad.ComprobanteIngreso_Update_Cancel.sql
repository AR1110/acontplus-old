USE [AcontPlus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteIngreso_Update_Cancel @idUsuarioRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANINS;

    --> Global
	DECLARE @idUsuario INT 

    --> ControlCaja 
    DECLARE @idControlCaja INT ,@idComprobanteIngreso INT ,@observacion VARCHAR(300)

    --> Cursores
	DECLARE @idCuotaPorCobrar INT ,@cuota NUMERIC(18,5) ,@idCuentaPorCobrar INT ,@importeTotal NUMERIC(18,5)


	BEGIN TRY 
		--> Validaciones
		SELECT @idComprobanteIngreso = idComprobanteIngreso, @observacion = observacion FROM OPENJSON(@json) WITH (idComprobanteIngreso INT ,observacion VARCHAR(500))

        SELECT TOP 1 @idControlCaja = idControlCaja FROM ComprobanteIngreso WITH (NOLOCK) WHERE idComprobanteIngreso = @idComprobanteIngreso

        --> Validaciones
		IF EXISTS (SELECT 1 FROM ComprobanteIngreso WITH (NOLOCK) WHERE idComprobanteIngreso = @idComprobanteIngreso AND estado = 0)
			BEGIN 
                SELECT '0' as code,'El Comprobante de Ingreso ya se encuentra anulado' as 'message'
				RETURN 
			END

        IF EXISTS (SELECT 1 FROM ControlCaja WITH (NOLOCK) WHERE idControlCaja = @idControlCaja AND estado = 0)
            BEGIN 
                SELECT '0' as code,'El control de caja se encuentra cerrado no puede ser anulado el comproabnte' as 'message'
				RETURN
            END

		BEGIN TRAN 
			UPDATE ComprobanteIngreso WITH (ROWLOCK)
               SET estado              = 0
                  ,observacion         = @observacion
                  ,fechaAnulada        = dbo.ufnGetDateEcuador() 
                  ,idUsuarioAnulado    = @idUsuario 
            WHERE idComprobanteIngreso = @idComprobanteIngreso 
			
            --> Editarmos los estados y abonos de los estados de las cuentas
            IF EXISTS (SELECT 1 FROM dbo.Cobro WITH (NOLOCK) WHERE idCuentaPorCobrar > 0 AND idComprobanteIngreso = @idComprobanteIngreso)
                BEGIN
                    DECLARE @idEstadoPago INT

                    SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

                    UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK)
                       SET idEstadoPago = @idEstadoPago
                    WHERE idCuentaPorCobrar IN (SELECT idCuentaPorCobrar FROM dbo.Cobro WITH (NOLOCK) WHERE idCuentaPorCobrar > 0 AND idComprobanteIngreso = @idComprobanteIngreso)
                END

			DECLARE cursor_Cuotas CURSOR LOCAL FOR
			SELECT cd.idCuotaPorCobrar 
			FROM dbo.CobroDetalle cd WITH (NOLOCK)
			INNER JOIN dbo.Cobro  co WITH (NOLOCK) ON co.idCobro = cd.idCobro 
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso
				
				OPEN cursor_Cuotas
				FETCH NEXT FROM cursor_Cuotas INTO @idCuotaPorCobrar
					WHILE @@FETCH_STATUS = 0
						BEGIN
							EXEC Contabilidad.CuotaPorCobrar_Update_Status @idCuotaPorCobrar
							FETCH NEXT FROM cursor_Cuotas INTO @idCuotaPorCobrar
						END
				CLOSE cursor_Cuotas

			DEALLOCATE cursor_Cuotas 


			DECLARE cursor_documentos CURSOR LOCAL FOR
			SELECT idCuentaPorCobrar 
			FROM Contabilidad.Historial_Cobro  WITH (NOLOCK) 
			WHERE idComprobanteIngreso = @idComprobanteIngreso
				
				OPEN cursor_documentos
				FETCH NEXT FROM cursor_documentos INTO @idCuentaPorCobrar
					WHILE @@FETCH_STATUS = 0
						BEGIN
							EXEC Contabilidad.CuentaPorCobrar_Update_Status @idCuentaPorCobrar
							FETCH NEXT FROM cursor_documentos INTO @idCuentaPorCobrar
						END
				CLOSE cursor_documentos

			DEALLOCATE cursor_documentos  

		COMMIT TRAN 
		SELECT '1' code ,'Anulado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ComprobanteIngreso/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento' as 'message'
	END CATCH 
END
GO
