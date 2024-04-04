
USE AcontPlus;
 GO

CREATE OR ALTER PROCEDURE Config.UserCustomerRequest_Insert  @userRoleId INT, @json VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    DECLARE @jsonData NVARCHAR(MAX) 
	DECLARE @motivo VARCHAR(50)
	DECLARE @codigoAccion VARCHAR(5)

	DECLARE @idEntidad INT = (SELECT top 1 idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId)
 
    DECLARE @tbUsersAdmin AS TABLE (
        idUsuarioRol INT NOT NULL UNIQUE 
    )

 
	SELECT @motivo = motivo, @codigoAccion = codigoAccion, @jsonData = jsonData FROM OPENJSON(@json)
	WITH(
            motivo VARCHAR(50) '$.motivo', 
            codigoAccion VARCHAR(5) '$.codigoAccion',
            jsonData VARCHAR(300) '$.jsonData'
        )
         

    INSERT INTO @tbUsersAdmin (idUsuarioRol)
    SELECT 
        CONVERT(INT, value) AS idUsuarioRol
    FROM  Config.v_User_Permission_Sale ups WITH(NOLOCK)
    CROSS APPLY OPENJSON(ups.usersAdmin)
    WHERE ups.idUsuarioRol = @userRoleId 

    IF (SELECT COUNT(*) FROM @tbUsersAdmin) = 0 
		BEGIN
			SELECT '0'code, 'La solicitud de clave de autorización para modificar o anular el documento no tiene asignado el receptor de la solicitud de aprobación' as 'message'
			RETURN
		END  
  
	BEGIN TRY
		BEGIN TRAN 			 

            INSERT INTO Config.Solicitud (idUsuarioRolAprobante, idUsuarioRolSolictante, observacion, codigoAccion, codEstado, jsonData)
           SELECT ua.idUsuarioRol, @userRoleId, UPPER(@motivo),  @codigoAccion, 'P', @jsonData
            FROM @tbUsersAdmin ua;

		COMMIT TRAN 
		IF @@ROWCOUNT > 0
        BEGIN
            SELECT '0'code, 'Registro insertado correctamente.' as [message];
        END
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code ,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
	END CATCH 


END 