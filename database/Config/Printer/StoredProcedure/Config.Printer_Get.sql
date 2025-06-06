USE Acontplus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-12-01
-- Description: sp for get printers
-- =============================================
CREATE OR ALTER PROCEDURE Config.Printer_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @tipo INT
    ,@id INT
    ,@idEntidad INT

    SELECT @tipo = tipo, @id = id FROM OPENJSON (@json) WITH(tipo INT '$.tipo', id INT '$.id')

    SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol =  @userRoleId

    IF (@tipo = 1)
        BEGIN
            SET @tableNames = 'printers'
            SELECT p.* 
                ,e.estab 
                ,pt.[Name] printerTypeName
            FROM Config.Printer p WITH(NOLOCK) 
                INNER JOIN Sri.Establecimiento e WITH(NOLOCK) ON p.EstablecimientoId = e.idEstablecimiento
                INNER JOIN Config.PrinterType pt WITH(NOLOCK) ON p.PrinterTypeId = pt.Id
            WHERE p.IsDeleted = CAST(0 AS BIT)
                AND e.idEntidad = @idEntidad
        END

    IF (@tipo = 2)
        BEGIN
            SET @tableNames = 'estabs,printerTypes,documents'
            SELECT e.idEstablecimiento 
               ,ar.codEstab
	           ,e.nombreComercial
	           ,ar.predeterminado
	        FROM Config.Estab_Asig ar WITH (NOLOCK)
	        INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON e.codEstab = ar.codEstab
	        WHERE ar.idUsuarioRol = @userRoleId
	        ORDER BY ar.predeterminado DESC

	        SELECT * FROM Config.PrinterType WHERE IsDeleted = CAST(0 AS BIT) AND [IsActive] = 1

	        SELECT id = 0,
		        codDoc = codigo,
		        [name] = UPPER(descripcion),
		        [IsActive] = CAST(CASE WHEN codigo IN ('FV', 'NE', 'PR') THEN 1 ELSE 0 END AS BIT),
		        copies = CAST(0 AS BIT)
	        FROM TipoDocumento WITH (NOLOCK)
            WHERE codigo IN ('FV', 'NE', 'PR', 'IC', 'EC', 'A', 'OR', 'ORC')
        END
    IF (@tipo = 3)
        BEGIN
            SET @tableNames = 'printer,documents'
            SELECT * FROM Config.Printer WITH(NOLOCK) WHERE Id = @id
            SELECT td.codigo codDoc
            ,td.descripcion AS 'name'
            ,CAST(ISNULL(pd.[IsActive], 0) AS bit) AS 'IsActive'
            ,ISNULL(pd.Copies, 1) Copies
            ,ISNULL(pd.Id, 0) Id 
            FROM TipoDocumento td WITH (NOLOCK)
                LEFT JOIN Config.PrinterDocument pd WITH(NOLOCK) ON td.codigo = pd.CodDoc
                AND pd.PrinterId = @id
            WHERE codigo IN ('FV', 'NE', 'PR', 'IC', 'EC', 'A', 'OR', 'ORC') 
        END
END
GO
