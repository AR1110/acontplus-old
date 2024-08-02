 USE Acontplus
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO  
--CREATE OR ALTER PROCEDURE Sri.PtoEmision_Update 
--	@idRol INT
--   ,@id INT 
--   ,@ambiente VARCHAR(5)
--   ,@ptoEmi VARCHAR(5)
--   ,@estado BIT 
--AS
--BEGIN 
--	SET NOCOUNT ON;

 
--	BEGIN TRY
--		BEGIN TRAN 
			
--			UPDATE dbo.PuntoEmision SET 
--				ambiente = @ambiente
--			   ,ptoEmi = @ptoEmi
--			   ,estado = @estado
--			WHERE idPuntoEmision = @id

--		COMMIT TRAN 
--		SELECT '1' code,'Actualizado Correctamente' as 'message'
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


-- es lo nuevo que se usa en client-angular
CREATE OR ALTER PROCEDURE Sri.PtoEmision_Update 
	@userRoleId INT
   ,@id INT 
   ,@json VARCHAR(900) 
AS
BEGIN 
	SET NOCOUNT ON;

   DECLARE @ambiente VARCHAR(5)
   DECLARE @ptoEmi VARCHAR(5)
   DECLARE @estado BIT 

   SELECT 
        @ambiente  =ambiente 
       ,@ptoEmi = ptoEmi 
       ,@estado = estado 
   FROM OPENJSON(@json)
   WITH(ambiente VARCHAR(5),ptoEmi VARCHAR(5),estado BIT)
 
	BEGIN TRY
		BEGIN TRAN 
			
			UPDATE dbo.PuntoEmision SET 
				ambiente = @ambiente
			   ,ptoEmi = @ptoEmi
			   ,estado = @estado
			WHERE idPuntoEmision = @id

		COMMIT TRAN 
		SELECT '1' code,'Actualizado Correctamente' as 'message'
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