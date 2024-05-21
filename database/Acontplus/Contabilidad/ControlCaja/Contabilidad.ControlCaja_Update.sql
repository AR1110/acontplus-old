USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspControlCajaClose]    Script Date: 12/13/2022 5:28:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-09-28
-- Description:	SP para cerrar caja.
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.ControlCaja_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON; 
	SET LANGUAGE SPANISH 

	--> Global
	DECLARE @idUsuario INT ,@idEntidad INT ,@payload VARCHAR(MAX)

    --> Data ControlCaja
	DECLARE @idCaja INT ,@totalArqueo DECIMAL(18,5) ,@arqueoCaja VARCHAR(MAX) ,@codEstab VARCHAR(70)

	BEGIN TRY
		
        SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId 

		SELECT @totalArqueo = totalArqueo
			  ,@arqueoCaja  = arqueoCaja
		FROM OPENJSON(@json)WITH
        (
			totalArqueo DECIMAL(18,5)
		   ,arqueoCaja  NVARCHAR(MAX) as json
		)


		--> RECUPERAR VARIABLES 
		SELECT TOP 1 @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT TOP 1 @idCaja = idCaja FROM dbo.ControlCaja WITH (NOLOCK) WHERE idControlCaja = @id

		--> VALIDACION DE DATOS 
		IF (SELECT COUNT(*) FROM OPENJSON(@arqueoCaja)) = 0 
			BEGIN
				SELECT [Common].[ufnSpResponse]('0','Error en el arqueo de caja',DEFAULT)
				RETURN 
			END

		IF EXISTS (SELECT 1 FROM ControlCaja WHERE idControlCaja = @id AND estado = 0 )
			BEGIN
				SELECT [Common].[ufnSpResponse]('0','La caja ya se encuentra cerrada',DEFAULT)
				RETURN 
			END 

		BEGIN TRAN 
			UPDATE ControlCaja set 
				 fechaCierre  = dbo.ufnGetDateEcuador()
				,estado       = 0
				,faltante     = 0
				,sobrante     = 0 
				,totalArqueo  = @totalArqueo
				,arqueoCaja   = @arqueoCaja
				,totalSistema = 0
			WHERE idControlCaja = @id
			
			UPDATE Caja SET actividad = 0 WHERE idCaja = @idCaja	
		    
            SET @payload = (SELECT codEstab = @codEstab
                                  ,ISNULL(email, '') as receptor
                            FROM dbo.Entidad WHERE idEntidad = @idEntidad FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)

			COMMIT TRAN 
		SELECT [Common].[ufnSpResponse]('1','Cerrada Correctamente',@payload)
	END TRY 
	
	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
		SELECT [Common].[ufnSpResponse]('0','Info: Error en el procedimiento: ',DEFAULT)
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ControlCaja/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	END CATCH 

END
