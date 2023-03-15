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
-- Create date: 03/14/2023
-- Description:	SP para actualizar el tiempo de credito de la cuenta x pagar esa solo se podre editar al estar pendiente
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorPagar_Insert', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorPagar_Insert
GO
CREATE PROCEDURE Contabilidad.CuentaPorPagar_Insert  @idUsuarioRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	DECLARE @payload AS VARCHAR(MAX)
    DECLARE @idCuentaPorPagar INT
    DECLARE @idTiempoCredito INT
    DECLARE @codPago VARCHAR(5)
	
	DECLARE @idUsuario AS INT
	DECLARE @idEstadoPago AS INT
	DECLARE @importeTotal AS NUMERIC(18,5)
	DECLARE @fechaEmision AS DATE
	DECLARE @fechaVencimiento AS DATE

	--===========Paramertros para el calculo de cuotas=====================
	DECLARE @count AS INT = 0
	DECLARE @countFechas AS INT
	DECLARE @diasCredito AS INT
	DECLARE @nroCuota AS INT
	DECLARE @tiempoCuotas AS INT
	DECLARE @cuota AS NUMERIC(18,5)
	DECLARE @entrada AS BIT 
	--=====================================================================

	DECLARE @cuotas AS TABLE(
		nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NULL
	)

	BEGIN TRY
		
		SELECT @idCuentaPorPagar = idCuentaPorPagar,@idTiempoCredito = idTiempoCredito, @codPago = codPago FROM OPENJSON(@json) 
		WITH (idCuentaPorPagar INT '$.idCuentaPorPagar',idTiempoCredito INT '$.idTiempoCredito' ,codPago VARCHAR(5)'$.codPago' ) as js
		
		SELECT TOP 1 @importeTotal = importeTotal, @fechaEmision = fechaEmision FROM Contabilidad.CuentaPorPagar WITH (NOLOCK) WHERE idCuentaPorPagar = @idCuentaPorPagar

		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT TOP 1
			 @nroCuota     = numeroCuota
			,@diasCredito  = diasCredito 
		    ,@entrada      = ISNULL(entrada,0)
			,@tiempoCuotas = diasCredito / numeroCuota
			,@cuota        = @importeTotal /numeroCuota
		FROM dbo.TiempoCredito WITH (NOLOCK) WHERE idTiempoCredito = @idTiempoCredito

		SELECT @fechaVencimiento = DATEADD(DAY,@diasCredito,@fechaEmision) 

		IF @codPago != 'PE'
			BEGIN
				SELECT '0' code,'Solo pueden ser actualizadas las Cuentas Por Pagar que se encuentren pendientes' as 'message'
				RETURN 
			END

		BEGIN TRAN 
			--===============================Calculo de cuota con entrada=================================================
			IF @entrada = 1
				BEGIN
					SET @countFechas = 0

					WHILE @count <= @nroCuota
						BEGIN
							INSERT INTO @cuotas(fechaVencimiento,nroCuota,cuota,entrada)
							SELECT
								 fechaVencimiento = CASE WHEN @count = 0 THEN @fechaEmision ELSE DATEADD(DAY,@countFechas,@fechaEmision)END 
								,nroCuota         = @count
						        ,cuota            = CASE WHEN @count = 0 THEN 0 ELSE @cuota END 
								 ,entrada         = CASE WHEN @count = 0 THEN CAST(1 AS BIT )  ELSE CAST(0 AS BIT ) END
							
							SET @countFechas += @tiempoCuotas
							SET @count +=  1;
						END 
				END 
			--=============================================================================================================================

			--=============================================Calculo de cuota sin entrada====================================================
			ELSE IF @entrada = 0 
				BEGIN
					SET @countFechas = @tiempoCuotas

					WHILE @count < @nroCuota
						BEGIN
							INSERT INTO @cuotas(fechaVencimiento,nroCuota,cuota,entrada)
							SELECT
								 fechaVencimiento = DATEADD(DAY,@countFechas,@fechaEmision) 
								,nroCuota         = @count+1  
								,cuota            = @cuota 
								,entrada          = CAST(0 AS BIT)

							SET @countFechas += @tiempoCuotas
							SET @count +=  1;
						END 
				END 

			 IF (SELECT COUNT(*) FROM @cuotas) = 0
					BEGIN
						SELECT '0' code,'Error al generar las cuotas' as 'message'
						ROLLBACK TRAN 
                        RETURN
					END 

			UPDATE Contabilidad.CuotaPorPagar SET estado = 0 WHERE idCuentaPorPagar = @idCuentaPorPagar

			UPDATE Contabilidad.CuentaPorPagar SET idTiempoCredito = @idTiempoCredito, fechaVencimiento = @fechaVencimiento WHERE idCuentaPorPagar = @idCuentaPorPagar

			INSERT INTO Contabilidad.CuotaPorPagar(idCuentaPorPagar,idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada)
			SELECT @idCuentaPorPagar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada FROM @cuotas

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
		SELECT '1'code,'Registrado Correctamente' as 'message', @payload payload
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
							 ,'/CuentaPorPagar/Post'
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
