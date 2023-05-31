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
IF OBJECT_ID(N'Contabilidad.CuotaPorCobrar_Update', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuotaPorCobrar_Update
GO
CREATE PROCEDURE Contabilidad.CuotaPorCobrar_Update @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT
	DECLARE @codDoc VARCHAR(5)
	DECLARE @fechaVencimiento AS DATETIME 
	DECLARE @codEstado VARCHAR(5)
	DECLARE @idTipoDocumento INT 
	DECLARE @idDocumento INT
	DECLARE @cuotas VARCHAR(MAX)
	DECLARE @tbCuotas AS TABLE (
		idCuotaXCobrar INT UNIQUE NOT NULL
	   ,fechaVencimiento DATETIME NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,mora NUMERIC(18,5) NOT NULL
	   ,diasMora INT NOT NULL
	)

	BEGIN TRY
		
		SELECT @codEstado = codEstado, @idTipoDocumento = idTipoDocumento,@idDocumento = idDocumento,@cuotas = cuotas 
		FROM OPENJSON(@json) WITH (codEstado VARCHAR(5) '$.codEstado'
		                          ,idTipoDocumento  INT '$.idTipoDocumento'
								  ,idDocumento      INT '$.idDocumento'
								  ,cuotas NVARCHAR(MAX) '$.cuotas' AS JSON
								  )

		INSERT INTO @tbCuotas (idCuotaXCobrar,fechaVencimiento,cuota,mora,diasMora)
						SELECT idCuotaXCobrar,fechaVencimiento,cuota,mora,diasMora
						FROM OPENJSON(@cuotas) WITH (idCuotaXCobrar        INT '$.idCuotaXCobrar'
												    ,fechaVencimiento DATETIME '$.fechaVencimiento'
												    ,cuota       NUMERIC(18,5) '$.cuota'
												    ,mora        NUMERIC(18,5) '$.mora'
												    ,diasMora              INT '$.diasMora' 
												    )

	    -- ========================== recuperar variables ==================================================================
		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @codDoc = codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento

		SELECT TOP 1 @fechaVencimiento =  MAX(fechaVencimiento) FROM @tbCuotas

		IF (SELECT COUNT(*) FROM @tbCuotas) = 0 
			BEGIN
				SELECT '0'code,'Erro en la informacion de las cuotas' as 'message'
				RETURN 
			END 
		
		IF @codEstado != 'PE'
			BEGIN
				SELECT '0'code,'No puedes Actualizar las cuotas el Documento tiene un historial de Cobro.' as 'message'
				RETURN 
			END 

		BEGIN TRAN 
			UPDATE cx SET 
				cx.fechaVencimiento  = tb.fechaVencimiento
	           ,cx.cuota             = tb.cuota
	           ,cx.mora              = tb.mora
	           ,cx.diasMora          = tb.diasMora
			FROM dbo.CuotaXCobrar cx WITH (NOLOCK)
			INNER JOIN @tbCuotas tb ON tb.idCuotaXCobrar = cx.idCuotaXCobrar

			IF @codDoc = 'FV'
				BEGIN
					UPDATE dbo.Factura SET fechaVencimiento = @fechaVencimiento WHERE idFactura = @idDocumento
				END 

			IF @codDoc = 'NE'
				BEGIN
					UPDATE dbo.NotaEntrega SET fechaVencimiento = @fechaVencimiento WHERE idNotaEntrega = @idDocumento
				END 

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
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
