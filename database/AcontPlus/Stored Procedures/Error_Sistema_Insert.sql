USE Acontplus
GO
CREATE OR ALTER PROCEDURE dbo.Error_Sistema_Insert
    @token UNIQUEIDENTIFIER,
    @method VARCHAR(150),
    @errorNumber INT,
    @errorSeverity INT,
    @errorState INT,
    @errorProcedure VARCHAR(150),
    @errorLine INT,
    @errorMessage VARCHAR(300),
    @userId INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO ErroresSistema
        (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
    VALUES(@token, @method, @errorNumber, @errorSeverity, @errorState, @errorProcedure, @errorLine, @errorMessage, dbo.ufnGetDateEcuador(), @userId)
END