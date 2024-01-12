USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspControlCajaOpen]    Script Date: 12/13/2022 5:17:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-09-27
-- Description: ASP para aperturar caja
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.ControlCaja_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idUsuario INT ,@idEntidad INT
    
    --> DataJson
    DEClARE @idCaja INT ,@idEntidadFinanciera INT ,@concepto VARCHAR(150) ,@entrada NUMERIC(10,5)

	BEGIN TRY 
        
        --> Recuperando Variables
        SELECT TOP 1 @idEntidad  = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT @idCaja              = idCaja 
              ,@idEntidadFinanciera = idEntidadFinanciera
              ,@concepto            = concepto
              ,@entrada             = entrada 
        FROM OPENJSON(@json) WITH
        (
            idCaja INT 
           ,idEntidadFinanciera INT
           ,concepto VARCHAR(300)
           ,entrada NUMERIC(18,5)
        )
        
        --> Validacion de informacion
        IF NOT EXISTS (SELECT 1 FROM AsignacionCaja WITH (NOLOCK) WHERE idCaja = @idCaja AND idUsuario = @idUsuario)
		    BEGIN
			    SELECT [Common].[ufnSpResponse]('0','Solo puede aperturar caja a la persona que le fue asignada',DEFAULT)
			    RETURN 
		    END 

	    IF EXISTS(SELECT 1 FROM ControlCaja WITH (NOLOCK) WHERE idCaja = @idCaja AND estado = 1)
		    BEGIN
			    SELECT [Common].[ufnSpResponse]('0','La caja ya se encuentra aperturada',DEFAULT)
			    RETURN 
		    END 

		BEGIN TRAN 

			INSERT INTO ControlCaja (idCaja,idEntidadFinanciera,fechaApertura,estado,concepto,entrada)
			SELECT @idCaja,@idEntidadFinanciera,dbo.ufnGetDateEcuador(),1,@concepto,@entrada

			UPDATE Caja SET actividad = 1 WHERE idCaja = @idCaja

		COMMIT TRAN 
		SELECT [Common].[ufnSpResponse]('1','Aperturada Correctamente',DEFAULT)
	END TRY
	
	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
		SELECT [Common].[ufnSpResponse]('0','Info: Error en el procedimiento',DEFAULT)
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ControlCaja/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	END CATCH 

END
