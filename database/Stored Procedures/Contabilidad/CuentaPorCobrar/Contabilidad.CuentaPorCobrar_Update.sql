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
IF OBJECT_ID(N'Contabilidad.CuentaPorCobrar_Update', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorCobrar_Update
GO
CREATE PROCEDURE Contabilidad.CuentaPorCobrar_Update
	@codDoc VARCHAR(5)
   ,@idDocumento INT
   ,@idCliente INT
   ,@importeTotal NUMERIC(18,5)
   ,@fechaEmision DATETIME 
   ,@fechaVencimiento DATETIME
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @idCuentaPorCobrar INT
	DECLARE @idTiempoCredito INT

	--===========Parametros para el calculo de cuotas=====================
	DECLARE @count AS INT = 0
	DECLARE @countFechas AS INT
	DECLARE @diasCredito AS INT
	DECLARE @nroCuota AS INT
	DECLARE @tiempoCuotas AS INT
	DECLARE @cuota AS NUMERIC(18,5)
	DECLARE @entrada AS BIT 
	DECLARE @uniqueId VARCHAR(50)

	-- ======= Pameteter table ============================================
	DECLARE @cuotas AS TABLE(
		nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATETIME NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NULL
	)

	SELECT TOP 1 @idCuentaPorCobrar = idCuentaPorCobrar, @idTiempoCredito = idTiempoCredito FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = @codDoc AND idDocumento = @idDocumento

	SELECT TOP 1
			 @nroCuota     = numeroCuota
			,@diasCredito  = diasCredito 
		    ,@entrada      = ISNULL(entrada,0)
			,@tiempoCuotas = diasCredito / numeroCuota
			,@cuota        = @importeTotal /numeroCuota
	FROM dbo.TiempoCredito WITH (NOLOCK) WHERE idTiempoCredito = @idTiempoCredito

	--===============================Calculo de cuota con entrada=================================================
	IF @entrada = 1
		BEGIN
			SET @countFechas = 0

			WHILE @count <= @nroCuota
				BEGIN
					INSERT INTO @cuotas(fechaVencimiento,nroCuota,cuota,entrada)
					SELECT
							fechaVencimiento = CASE WHEN @count = 0 THEN @fechaEmision ELSE DATEADD(DAY,@countFechas,@fechaEmision)END 
							,nroCuota        = @count
						    ,cuota           = CASE WHEN @count = 0 THEN 0 ELSE @cuota END 
							,entrada         = CASE WHEN @count = 0 THEN CAST(1 AS BIT )  ELSE CAST(0 AS BIT ) END
							
					SET @countFechas += @tiempoCuotas
					SET @count +=  1;
				END 
		END 
		
	--===============================Calculo de cuota sin entrada=================================================
	IF @entrada = 0
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

	--========================================= VALIDACIONES DE DATOS =======================================================================
	
	IF (SELECT COUNT(*) FROM @cuotas) = 0
		BEGIN
			SELECT '0'code,'Error al generar las cuotas' as  'message'
			ROLLBACK TRAN;
			RETURN 
		END

	UPDATE Contabilidad.CuentaPorCobrar SET idCliente = @idCliente,fechaEmision = @fechaEmision,fechaVencimiento = @fechaVencimiento,importeTotal = @importeTotal WHERE idCuentaPorCobrar = @idCuentaPorCobrar

	UPDATE cc SET	
		 cc.fechaVencimiento = ct.fechaVencimiento
		,cc.cuota            = ct.cuota
	FROM Contabilidad.CuotaPorCobrar cc WITH (NOLOCK)
	INNER JOIN @cuotas ct ON ct.nroCuota = cc.nroCuota
	WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar AND cc.estado = 1
END
GO
