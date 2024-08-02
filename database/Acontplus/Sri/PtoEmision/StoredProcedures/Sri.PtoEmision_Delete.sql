 USE AcontPlus 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
--CREATE OR ALTER PROCEDURE Sri.PtoEmision_Delete @idRol INT, @id INT
--AS
--BEGIN
 
--	SET NOCOUNT ON;

--	IF EXISTS (SELECT 1 FROM dbo.PuntoEmision WHERE idPuntoEmision = @id AND estado = 0)
--		BEGIN
--			SELECT '1' code,'Este punto de emision ya se encuentra anulado' as 'message'
--			RETURN
--		END 
 
--	BEGIN TRY
--		BEGIN TRAN 
			
--			UPDATE dbo.PuntoEmision SET estado = 0 WHERE idPuntoEmision = @id

--		COMMIT TRAN 
--		SELECT '1' code,'Anulado Correctamente' as 'message'
--	    RETURN;

--	END TRY 

--	BEGIN CATCH 
--		IF @@TRANCOUNT > 0 
--		BEGIN
--			ROLLBACK TRAN; 
--		END
--		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
--	END CATCH 
--END
--GO

CREATE OR ALTER PROCEDURE Sri.PtoEmision_Delete @userRoleId INT, @id INT
AS
BEGIN
 
	SET NOCOUNT ON;

	IF EXISTS (SELECT 1 FROM dbo.PuntoEmision WHERE idPuntoEmision = @id AND estado = 0)
		BEGIN
			SELECT '1' code,'Este punto de emision ya se encuentra anulado' as 'message'
			RETURN
		END 
 
	BEGIN TRY
		BEGIN TRAN 
			
			UPDATE dbo.PuntoEmision SET estado = 0 WHERE idPuntoEmision = @id

		COMMIT TRAN 
		SELECT '1' code,'Anulado Correctamente' as 'message'
	    RETURN;

	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 
END
GO