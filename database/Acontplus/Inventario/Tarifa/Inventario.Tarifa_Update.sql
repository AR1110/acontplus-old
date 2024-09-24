USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPTarifaUpdate]    Script Date: 14/5/2023 13:46:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 15/09/2021
-- Description:	ASPTarifaUpdate
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Tarifa_Update @userRoleId INT, @id INT, @json VARCHAR(MAX) , @fromMobile BIT 
AS
BEGIN
		
	SET NOCOUNT ON;
	DECLARE @idEntidad int 
	DECLARE @descripcion VARCHAR(100)
	DECLARE @estado BIT 
	DECLARE @ventaPorMayor BIT
	
	--select '0'code, 'message' = @json
	--RETURN 
	SELECT @idEntidad = idEntidad FROM v_usuario where idUsuarioRol = @userRoleId

	SELECT @descripcion = descripcion, @estado = estado, @ventaPorMayor = ventaPorMayor 
	FROM OPENJSON(@json)
	WITH(
		descripcion VARCHAR(100) , 
		estado BIT ,
		ventaPorMayor BIT 
	)


	IF EXISTS(SELECT 1 FROM Tarifa WHERE descripcion = @descripcion AND idTarifa != @id AND idEntidad = @idEntidad)
		BEGIN 
			SELECT '0'code,'La Tarifa: '+@descripcion+' ya se encuentra registrada' as 'message','Tarifa'
			RETURN;
		END 

	BEGIN TRY
		BEGIN TRAN
			UPDATE Tarifa SET ventaPorMayor = 0 WHERE idEntidad = @idEntidad
			
			UPDATE Tarifa SET 
				    descripcion   = LTRIM(RTRIM(@descripcion))	
				   ,estado        = 1
				   ,ventaPorMayor = @ventaPorMayor
			WHERE idTarifa = @id

		COMMIT TRAN 
		SELECT '1'code,'Actualizado correctamente' as 'message','Tarifa'
		RETURN;
	END TRY


	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0','error','Info: Error en el procedimiento de actualizar' + ERROR_MESSAGE(), 'Tarifa'
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
									,'/Tarifa/UpdateTarifa'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE(), 
									1)
	END CATCH 
END
