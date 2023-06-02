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
IF OBJECT_ID(N'Contabilidad.ComprobanteIngreso_Update_Cancel', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.ComprobanteIngreso_Update_Cancel
GO
CREATE PROCEDURE Contabilidad.ComprobanteIngreso_Update_Cancel @idUsuarioRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
	DECLARE @idCuotaXCobrar INT
	DECLARE @codDoc VARCHAR(5)
	DECLARE @idComprobante INT
	DECLARE @idComprobanteIngreso INT
	DECLARE @observacion VARCHAR(300)

	BEGIN TRY 
		
		SELECT @idComprobanteIngreso = idComprobanteIngreso, @observacion = observacion FROM OPENJSON(@json) WITH (idComprobanteIngreso INT '$.idComprobanteIngreso',observacion VARCHAR(500) '$.observacion')

		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		IF EXISTS (SELECT 1 FROM ComprobanteIngreso WITH (NOLOCK) WHERE idComprobanteIngreso = @idComprobanteIngreso  AND estado = 0)
			BEGIN
				SELECT '0'code,'El Comprobante de Ingreso ya se encuentra anulado' as 'message'
				RETURN 
			END

		BEGIN TRAN 
			UPDATE ComprobanteIngreso SET estado = 0,observacion = @observacion,fechaAnulada = dbo.ufnGetDateEcuador() ,idUsuarioAnulado = @idUsuario WHERE idComprobanteIngreso = @idComprobanteIngreso 
			
			DECLARE cursor_Cuotas CURSOR LOCAL FOR
			SELECT idCuotaXCobrar 
			FROM dbo.CobroDetalle cd WITH (NOLOCK)
			INNER JOIN dbo.Cobro  co WITH (NOLOCK) ON co.idCobro = cd.idCobro 
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso
				
				OPEN cursor_Cuotas
				FETCH NEXT FROM cursor_Cuotas INTO @idCuotaXCobrar
					WHILE @@FETCH_STATUS = 0
						BEGIN
							EXEC Contabilidad.CuotaPorCobrar_Update_Status @idCuotaXCobrar
							FETCH NEXT FROM cursor_Cuotas INTO @idCuotaXCobrar
						END
				CLOSE cursor_Cuotas

			DEALLOCATE cursor_Cuotas 


			DECLARE cursor_documentos CURSOR LOCAL FOR
			SELECT codigo,cd.idComprobante 
			FROM dbo.CobroDocumento  cd WITH (NOLOCK) 
			INNER JOIN TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = cd.idTipoDocumento
			WHERE cd.idComprobanteIngreso = @idComprobanteIngreso
				
				OPEN cursor_documentos
				FETCH NEXT FROM cursor_documentos INTO @codDoc,@idComprobante
					WHILE @@FETCH_STATUS = 0
						BEGIN
							EXEC Contabilidad.CuentaPorCobrar_Update_Status @codDoc,@idComprobante
							FETCH NEXT FROM cursor_documentos INTO @codDoc,@idComprobante
						END
				CLOSE cursor_documentos

			DEALLOCATE cursor_documentos  

		COMMIT TRAN 
		SELECT '1' code ,'Anulado Correctamente' as 'message'
		RETURN
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
		RETURN
	END CATCH 
END
GO
