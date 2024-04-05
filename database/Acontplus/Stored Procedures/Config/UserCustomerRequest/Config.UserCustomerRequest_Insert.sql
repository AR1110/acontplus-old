USE [Acontplus]
GO
/****** Object:  StoredProcedure [Config].[Solicitud_Insert]    Script Date: 3/4/2024 14:19:02 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Emilio Senguana.
-- Create date: 11/04/2023
-- Description:	
-- =============================================
--- Config.UserCustomerRequest_Insert 164, '{"idDocumento":348385,"codDoc":"01","codigoAccion":"E","jsonData":{"idDocumento":348385,"codDoc":"01","tipoDoc":"Factura Electrónica"},"motivo":"FACTURA EDITANDO"}'
CREATE OR ALTER  PROCEDURE Config.UserCustomerRequest_Insert @userRoleId INT, @json VARCHAR(999)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    DECLARE @userCustomerRequestId INT 

	DECLARE  @jsonData NVARCHAR(MAX)
	DECLARE @motivo VARCHAR(50)
 
    DECLARE @codigoAccion VARCHAR(100) 

	DECLARE @idEntidad INT 
    DECLARE @userId INT  
	DECLARE @tbUsersAdmin as Table (
		userRoleIdApprover INT NOT NULL UNIQUE
	) 
   

	SELECT 
		@motivo = motivo
		,@codigoAccion = codigoAccion
		,@jsonData = jsonData 
	FROM OPENJSON(@json)
	WITH(
		motivo VARCHAR(300) '$.motivo'
		,codigoAccion VARCHAR(5) '$.codigoAccion'
		,jsonData NVARCHAR(MAX) '$.jsonData'
		,serieComprobante VARCHAR(50)
        ,tipoDoc VARCHAR(50) '$.tipoDoc'
	)

    SELECT top 1 @idEntidad = idEntidad, @userId = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId
  

	INSERT INTO @tbUsersAdmin (userRoleIdApprover)
    SELECT 
        CONVERT(INT, value) AS userRoleIdApprover
    FROM  Config.v_User_Permission_Sale ups WITH(NOLOCK)
    CROSS APPLY OPENJSON(ups.usersAdmin)
    WHERE ups.idUsuarioRol = @userRoleId 
     
 
    IF @jsonData IS NULL
        BEGIN 
            SELECT '0'code, 'Datos de comprobante no válido' as 'message'
            RETURN 
        END 

    IF (SELECT COUNT(*) FROM @tbUsersAdmin) = 0
		BEGIN
			SELECT '0'code, 'Solictud de Clave de Autorización para modificar o anular el documento no tiene asignado el Receptor de la Solicitud de Aprobación' as 'message'
			RETURN
		END 

	BEGIN TRY
		BEGIN TRAN 	 
			INSERT INTO Config.Solicitud (idUsuarioRolAprobante, idUsuarioRolSolictante, observacion, codigoAccion, codEstado, jsonData, fechaRegistro)
			SELECT  userRoleIdApprover, @userRoleId, UPPER(@motivo), @codigoAccion, 'P', @jsonData, dbo.ufnGetDateEcuador()
			FROM @tbUsersAdmin  
             SET  @userCustomerRequestId = @@IDENTITY
            EXEC Config.UserCustomerRequest_SendMail @userRoleId, @userCustomerRequestId

		COMMIT TRAN  
        SELECT '1' code,'Registrado Correctamente' as 'message'	  
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 


END 