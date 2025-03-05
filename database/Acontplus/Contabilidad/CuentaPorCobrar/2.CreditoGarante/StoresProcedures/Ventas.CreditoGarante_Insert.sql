USE [AcontPlus]
GO
 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
  
CREATE OR ALTER PROCEDURE Ventas.CreditoGarante_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET DEADLOCK_PRIORITY LOW;

	SET LANGUAGE SPANISH 

    --> GLOBAL
	DECLARE @idUsuario INT , @fechaRegistro DATETIME2	

 
    DECLARE @tbCreditoGarante AS TABLE (
	    idCreditoGarante INT NOT NULL
       ,idCuentaPorCobrar INT NOT NULL
	   ,idCliente INT NOT NULL
	)
	 

     
	BEGIN TRY
        
        --> Json
        INSERT INTO @tbCreditoGarante
		      (idCreditoGarante,idCuentaPorCobrar,idCliente)
		SELECT idCreditoGarante,idCuentaPorCobrar,idCliente
		FROM OPENJSON(@json, '$.guarantors') WITH 
        (
            idCreditoGarante  INT
           ,idCuentaPorCobrar INT
           ,idCliente         INT

        ) AS js

        --> Variables
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SET @fechaRegistro = (SELECT dbo.ufnGetDateEcuador())
 
		--> Validaciones
        IF NOT EXISTS(SELECT 1 FROM @tbCreditoGarante)  
            BEGIN
                SELECT '0' code,'Error Empty Data' AS 'message'
				RETURN
            END 

        
		BEGIN TRAN 

			INSERT INTO Ventas.CreditoGarante 
				  (idCuentaPorCobrar, idCliente, idUsuario, fechaRegistro)
			SELECT idCuentaPorCobrar, idCliente, @idUsuario,@fechaRegistro 
			FROM @tbCreditoGarante  tb
			WHERE tb.idCreditoGarante = 0

            UPDATE cg
               SET cg.estado    = 0
                  ,cg.updatedAt = (SELECT dbo.ufnGetDateEcuador())
            FROM Ventas.CreditoGarante   cg
            INNER JOIN @tbCreditoGarante tg ON tg.idCreditoGarante = cg.idCreditoGarante
				
		COMMIT TRAN
		SELECT '1'code,'Registrado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
		
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/CreditoGarante/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	    
        SELECT '0'code,'Info: Error en el procedimiento:' as 'message'
    END CATCH 
END
