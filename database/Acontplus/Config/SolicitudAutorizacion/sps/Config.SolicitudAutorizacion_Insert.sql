USE [Acontplus]
GO
 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Emilio Senguana.
-- Create date: 11/04/2023
-- Description:	
-- =============================================
CREATE OR ALTER  PROCEDURE Config.SolicitudAutorizacion_Insert @userRoleId INT, @json VARCHAR(999)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idSolicitudAutorizacion INT

    DECLARE @idUsuarioRolSolicitante INT 
	DECLARE @codigoModulo VARCHAR(5)
	DECLARE @idDocumentoRef INT 
	DECLARE @codigoAccion  VARCHAR(5)
	--DECLARE CodigoEstado  VARCHAR(10) DEFAULT 'P',  

	DECLARE @obs VARCHAR(200)
    DECLARE @infoExtraJson  NVARCHAR(MAX) 
	DECLARE @rowguid UNIQUEIDENTIFIER = NEWID()

	DECLARE @jsonDetalles NVARCHAR(MAX)
   

  

	DECLARE @idEntidad INT 
	DECLARE @userIdFrontEnd INT 
    DECLARE @userId INT  

	DECLARE @tbUsersAdmin as Table (
		idUsuarioRolAprobante INT NOT NULL UNIQUE
	) 
	DECLARE @tbDetalles AS TABLE(
		 nombre VARCHAR(100),
		 valor VARCHAR(100),
		 nuevoValor VARCHAR(100),
		 obs VARCHAR(200) 
	)
    

	SELECT 
		 @userIdFrontEnd = idUsuario
		,@codigoModulo = codigoModulo 
		,@idDocumentoRef = idDocumentoRef
		,@codigoAccion = codigoAccion
		,@obs          = obs 
		,@infoExtraJson = infoExtraJson 
		,@jsonDetalles   = detalles
	FROM OPENJSON(@json)
	WITH(
		 codigoModulo VARCHAR(5)  
		,idDocumentoRef INT
		,codigoAccion VARCHAR(5)
		,obs VARCHAR(200)
		,infoExtraJson NVARCHAR(MAX) 
		,idUsuario INT
		,detalles NVARCHAR(MAX) as json
	)

    SELECT top 1 @idEntidad = idEntidad, @userId = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId
	SELECT TOP 1 @idUsuarioRolSolicitante = idUsuarioRol FROM v_usuario WHERE idEntidad = idEntidad AND idUsuario = @userIdFrontEnd

	INSERT INTO @tbUsersAdmin (idUsuarioRolAprobante)
    SELECT 
        CONVERT(INT, value) AS idUsuarioRolAprobante
    FROM  Config.v_User_Permission_Sale ups WITH(NOLOCK)
    CROSS APPLY OPENJSON(ups.usersAdmin)
    WHERE ups.idUsuarioRol = @userRoleId 


	INSERT INTO @tbDetalles(nombre, valor, nuevoValor, obs)
	SELECT nombre, valor, nuevoValor, obs
	FROM OPENJSON(@jsonDetalles)
	WITH(
		 nombre VARCHAR(100),
		 valor VARCHAR(100),
		 nuevoValor VARCHAR(100),
		 obs VARCHAR(200) 
	)
     
 
    IF @infoExtraJson IS NULL
        BEGIN 
            SELECT '0'code, 'Datos adicionales no válido' as 'message'
            RETURN 
        END 

    IF (SELECT COUNT(*) FROM @tbUsersAdmin) = 0
		BEGIN
			SELECT '0'code, 'Solictud de Autorización para realizar la acción requiere que este asignado el Receptor de la Solicitud' as 'message'
			RETURN
		END 

	BEGIN TRY
		BEGIN TRAN 	 

			INSERT INTO Config.SolicitudAutorizacion(IdUsuarioRolSolicitante,IdUsuarioRolAprobante,IdEntidad,CodigoModulo,IdDocumentoRef,CodigoAccion,FechaRegistro,obs,infoExtraJson,RowGuid)
			SELECT  @idUsuarioRolSolicitante,idUsuarioRolAprobante, @idEntidad, @codigoModulo, @idDocumentoRef, @codigoAccion, dbo.ufnGetDateEcuador(), @obs, @infoExtraJson, @rowguid
			FROM @tbUsersAdmin
			 
             SET  @idSolicitudAutorizacion = @@IDENTITY

             INSERT INTO Config.SolicitudAutorizacionDetalle(IdSolicitudAutorizacion, Nombre, Valor, NuevoValor, Obs)
             SELECT @idSolicitudAutorizacion, nombre, valor, nuevoValor, obs 
             FROM @tbDetalles

            EXEC Config.SolicitudAutorizacion_SendMail @userRoleId, @idSolicitudAutorizacion

		COMMIT TRAN  
        SELECT '1' code,'Registrado Correctamente' as 'message'	  
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
        INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/SolicitudAutorizacion/Post',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@userId
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 


END 