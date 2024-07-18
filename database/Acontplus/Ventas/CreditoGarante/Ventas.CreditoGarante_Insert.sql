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

    -- GLOBAL
	DECLARE @idUsuario INT , @fechaRegistro DATETIME2	

    -- Data Json
    DECLARE @creditoGarante VARCHAR(MAX)
 

	
	 
    DECLARE @tbCreditoGarante AS TABLE (
		idCuentaPorCobrar INT NOT NULL
	   ,idCliente INT NOT NULL
	   ,tipoAccion CHAR(1) NOT NULL
	)
	 

     
	BEGIN TRY
         
        SELECT TOP 1 @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
		SET @fechaRegistro = (SELECT dbo.ufnGetDateEcuador())
 

        INSERT INTO @tbCreditoGarante
		      (idCuentaPorCobrar, idCliente, tipoAccion)
		SELECT idCuentaPorCobrar, idCliente, tipoAccion
		FROM OPENJSON(@json, '$.guarantors') WITH (
            idCuentaPorCobrar INT,
            idCliente INT,
			tipoAccion CHAR(1)
        ) AS js;


		   
        IF NOT EXISTS(SELECT * FROM @tbCreditoGarante)  
            BEGIN
                SELECT '0' code,'Error Empty Data' AS 'message'
				RETURN
            END 

        
		BEGIN TRAN 

			

		    -- C - create
			INSERT INTO Ventas.CreditoGarante 
				   (idCuentaPorCobrar, idCliente, idUsuario, fechaRegistro)
			SELECT idCuentaPorCobrar, idCliente, @idUsuario,@fechaRegistro 
			FROM @tbCreditoGarante  tb
			WHERE tb.tipoAccion='C'

            -- D - deleted
			DELETE cg
			FROM Ventas.CreditoGarante cg
			INNER JOIN @tbCreditoGarante tg ON cg.idCuentaPorCobrar = tg.idCuentaPorCobrar AND cg.idCliente = tg.idCliente
			WHERE tg.tipoAccion = 'D';


				
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
