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
IF OBJECT_ID(N'Contabilidad.CuentaPorPagar_Update', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorPagar_Update
GO
CREATE PROCEDURE Contabilidad.CuentaPorPagar_Update 
    @idCuentaPorPagar INT
   ,@idUsuarioRol INT
   ,@idTiempoCredito INT
   ,@codPago VARCHAR(5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario AS INT
	DECLARE @importeTotal AS NUMERIC(18,5)
	DECLARE @fechaEmision AS DATETIME

	BEGIN TRY
		
		SELECT TOP 1 @importeTotal = importeTotal, @fechaEmision = fechaEmision FROM Contabilidad.CuentaPorPagar WITH (NOLOCK) WHERE idCuentaPorPagar = @idCuentaPorPagar

		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		IF @codPago != 'PE'
			BEGIN
				SELECT '0' code,'Solo pueden ser actualizadas las Cuentas Por Pagar que se encuentren pendientes' as 'message'
				RETURN 
			END 
		BEGIN TRAN 
			UPDATE Contabilidad.CuotaPorPagar SET estado = 0 WHERE idCuentaPorPagar = @idCuentaPorPagar



		COMMIT TRAN 
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
