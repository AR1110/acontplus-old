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
-- Author:		Alexis Ramirez
-- Create date: 3/15/2023
-- Description:	SP para editar las cuotas de una cuenta por pagar.
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorPagar_Update', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorPagar_Update
GO
CREATE PROCEDURE Contabilidad.CuentaPorPagar_Update @idUsuarioRol INT,@idCuentaPorPagar INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	--=============Parametros para la validacion de datos======================
	DECLARE @idEstadoPago AS INT
	DECLARE @idUsuario AS INT
	DECLARE @codPago AS VARCHAR(5)
	DECLARE @payload AS VARCHAR(MAX)

	DECLARE @fechaVencimiento AS DATE

	DECLARE @cuotas AS TABLE(
		idCuotaPorPagar INT UNIQUE NOT NULL
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	)

	BEGIN TRY 
		
		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM Contabilidad.CuentaPorPagar WITH (NOLOCK) WHERE idCuentaPorPagar = @idCuentaPorPagar

		SELECT TOP 1 @codPago = codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE idEstadoPago = @idEstadoPago
		
		IF @codPago != 'PE'
			BEGIN
				SELECT '0' code,'No puedes editar esta Cuenta tiene abonos realizados.' as 'message'
				RETURN
			END

		BEGIN TRAN 
			INSERT INTO @cuotas (idCuotaPorPagar,fechaVencimiento,cuota)
			SELECT idCuotaPorPagar,fechaVencimiento,cuota
			FROM OPENJSON(@json) WITH (idCuotaPorPagar INT '$.idCuotaPorPagar',fechaVencimiento DATE '$.fechaVencimiento', cuota NUMERIC(18,5))

			SELECT @fechaVencimiento =  MAX(fechaVencimiento) FROM @cuotas 

			UPDATE xc SET 
				 xc.fechaVencimiento = c.fechaVencimiento
				,xc.cuota = c.cuota
			FROM Contabilidad.CuotaPoragar xc
			INNER JOIN @cuotas c ON c.idCuotaPorPagar = xc.idCuotaPorPagar
			WHERE xc.idCuentaPorPagar = @idCuentaPorPagar

			UPDATE Contabilidad.CuentaPorPagar SET fechaVencimiento = @fechaVencimiento WHERE idCuentaPorPagar = @idCuentaPorPagar

			SET @payload = (SELECT 
								 c.idCuotaPorPagar
								,fechaVencimiento = c.fechaVencimiento
								,c.nroCuota
								,c.cuota
								,c.abono
								,c.saldo
								,ep.descripcion
								,ep.codigo
							FROM Contabilidad.CuotaPorPagar c 
							INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = c.idEstadoPago
							WHERE c.idCuentaPorPagar = @idCuentaPorPagar	
							  AND c.estado = 1 
			                FOR JSON PATH)

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message', @payload payload
		RETURN  
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0' code,'Info: Error en el procedimiento: '+ERROR_MESSAGE() as 'message'
			INSERT INTO ErroresSistema
							 (token
							 ,method
							 ,errorNumber
							 ,errorSeverity 
							 ,errorState
							 ,errorProcedure
							 ,errorLine
							 ,errorMessage
							 ,errorDate
							 ,idUsuario)
						 VALUES
							 (NEWID()
							 ,'/CuentaPorPagar/Put'
							 ,ERROR_NUMBER()
							 ,ERROR_SEVERITY()
							 ,ERROR_STATE()
							 ,ERROR_PROCEDURE()
							 ,ERROR_LINE()
							 ,ERROR_MESSAGE()
							 ,GETDATE()
							 ,@idUsuario)
	END CATCH 
END
GO
