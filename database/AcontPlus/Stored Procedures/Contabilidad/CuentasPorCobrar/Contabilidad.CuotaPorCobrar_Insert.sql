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
IF OBJECT_ID(N'Contabilidad.CuotaPorCobrar_Insert', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuotaPorCobrar_Insert
GO
CREATE PROCEDURE Contabilidad.CuotaPorCobrar_Insert @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 

	-- ============ Parameter Json ========================================
	DECLARE @fechaEmision AS DATETIME
	DECLARE @idTipoDocumento AS INT 
	DECLARE @idDocumento AS INT 
	DECLARE @idTiempoCredito AS INT 
	DECLARE @codEstado AS VARCHAR(5)
	DECLARE @importeTotal AS NUMERIC(18,5)

	--===========Paramertros para el calculo de cuotas=====================
	DECLARE @count AS INT = 0
	DECLARE @countFechas AS INT
	DECLARE @diasCredito AS INT
	DECLARE @nroCuota AS INT
	DECLARE @tiempoCuotas AS INT
	DECLARE @cuota AS NUMERIC(18,5)
	DECLARE @entrada AS BIT 

	--=========Parameter Update Document ========================================
	DECLARE @fechaVencimiento AS DATETIME 
	DECLARE @idEstadoPago AS INT
	DECLARE @codDoc AS VARCHAR(5)

	-- ======= Pameteter table ============================================
	DECLARE @cuotas AS TABLE(
		nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATETIME NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NULL
	)

	-- =========== PARAMETER PAYLOAD ======================================
	DECLARE @payload AS VARCHAR(MAX)


	BEGIN TRY 

		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT @fechaEmision    = CONVERT(DATETIME,fechaEmision,121)
		      ,@idTipoDocumento = idTipoDocumento 
			  ,@idDocumento     = idDocumento
			  ,@idTiempoCredito = idTiempoCredito
			  ,@codEstado       = codEstado 
			  ,@importeTotal    = importeTotal
		FROM OPENJSON(@json) WITH (fechaEmision NVARCHAR(150) '$.fechaEmision'
		                          ,idTipoDocumento        INT '$.idTipoDocumento'
							      ,idDocumento            INT '$.idDocumento'
							      ,idTiempoCredito        INT '$.idTiempoCredito'
							      ,codEstado       VARCHAR(5) '$.codEstado' 
								  ,importeTotal NUMERIC(18,5) '$.importeTotal') as dt

		SELECT TOP 1 @codDoc = codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

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

		SELECT TOP 1  @fechaVencimiento = MAX(fechaVencimiento) FROM @cuotas

		-- ======================================== Validacion de informacion ========================================
		IF (SELECT COUNT(*) FROM @cuotas) = 0
			BEGIN
				SELECT '0' code,'Error al generar las cuotas' as 'message'
                RETURN
			END 

		IF @codEstado != 'PE'
			BEGIN
				SELECT '0' code,'Solo pueden ser actualizadas las Cuotas Por Cobrar que se encuentren pendientes' as 'message'
				RETURN 
			END

		BEGIN TRAN 
			
			UPDATE dbo.CuotaXCobrar SET estado = 0 WHERE idTipoDocumento = @idTipoDocumento AND idComprobante = @idDocumento

			IF @codDoc = 'FV'
				BEGIN
					UPDATE dbo.Factura SET fechaVencimiento = @fechaVencimiento, idTiempoCredito = @idTiempoCredito WHERE idFactura = @idDocumento
				END 

			IF @codDoc = 'NE'
				BEGIN
					UPDATE dbo.NotaEntrega SET fechaVencimiento = @fechaVencimiento, idTiempoCredito = @idTiempoCredito WHERE idNotaEntrega = @idDocumento
				END

			INSERT INTO dbo.CuotaXCobrar (idTipoDocumento,idComprobante,idEstadoPago,fechaVencimiento,nroCuota,cuota,entrada)
			                      SELECT @idTipoDocumento,@idDocumento,@idEstadoPago,fechaVencimiento,nroCuota,cuota,entrada FROM @cuotas
			
			SET @payload = (SELECT cx.idCuotaXCobrar
			                      ,cx.nroCuota
								  ,interes = 0
								  ,cx.cuota
								  ,cx.diasMora
								  ,cx.abono
								  ,cx.saldo
								  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				                  ,fechaGracia      = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
								  ,estado           = ep.descripcion
								  ,codEstado        = ep.codigo
			                FROM dbo.CuotaXCobrar     cx WITH (NOLOCK)
							INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
							WHERE cx.idTipoDocumento = @idTipoDocumento AND cx.idComprobante = @idDocumento AND cx.estado = 1
						   FOR JSON PATH)

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' as 'message', @payload as payload
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
