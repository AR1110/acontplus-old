USE [AcontPlus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Author: Ivan Paz
--Date: 2024-05-08
--Description: Sp for get categories
CREATE OR ALTER PROCEDURE Contabilidad.Category_Get @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @tipo INT,
	    @companyId INT,
        @userId INT;

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	SELECT TOP 1 @companyId = idEntidad, @userId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    BEGIN TRY
	    -- ====================== LISTA DE GESTION PRINCIPAL ===============================================
	    IF @tipo = 1
		    BEGIN
                SET @tableNames = 'categories'
			    SELECT c.*
                    ,t.Name TipoName
                FROM Contabilidad.Category c WITH (NOLOCK) 
                    INNER JOIN Contabilidad.Tipo t WITH (NOLOCK)  ON c.TipoId = t.Id
                WHERE c.IsDeleted = 0 
		    END 

	    IF @tipo = 2
		    BEGIN
                SET @tableNames = 'tipos'
			    SELECT * FROM Contabilidad.Tipo WITH (NOLOCK) WHERE IsActive = 1 
		    END

	    --IF @tipo = 3 
	    --	BEGIN
			
	    --	END
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage],
        [idUsuario], [additionalInfo])
        VALUES('Category/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), 'Contabilidad.Category_Get', ERROR_LINE(), ERROR_MESSAGE(),
        @userId, N'{
        '+ @json +'''
        }');
    END CATCH
END
