USE Acontplus
GO
CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Error_Get_Id @userRoleId INT
,@id INT
,@tableNames VARCHAR(500) OUT
AS
BEGIN
    SET NOCOUNT ON; 
    DECLARE @userId INT
    BEGIN TRY
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId);
        SET @tableNames = 'errors';

	    SELECT ISNULL(dee.estado, '')                  estado
                ,dee.mensaje
                ,ISNULL(dee.informacionAdicional, '')  informacionAdicional
                ,tipo
                ,fechaRegistro  
        FROM dbo.DocumentoElectronicoError dee WITH (NOLOCK) 
        WHERE idDocumentoElectronico = @id 
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES('DocumentoElectronicoError/GetById', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
        THROW;
    END CATCH
END 

