USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-03-21
-- Description: sp for get accessos details
-- =============================================
CREATE OR ALTER PROCEDURE Seguridad.LicenciaAccesoDetalle_Get
    @UserRoleId INT,
    @Json VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON; 
	DECLARE @MenuId INT 
    DECLARE @LicenciaAccesoId INT
		,@Id INT
		,@Tipo INT
		,@Payload NVARCHAR(MAX)
		

    SELECT @LicenciaAccesoId = licenciaAccesoId 
		,@Id = id
		,@Tipo = tipo
		,@MenuId = menuId
	FROM OPENJSON(@Json) 
	WITH(licenciaAccesoId INT, id INT, tipo INT, menuId INT); 

	IF (@Tipo = 3)
		BEGIN
			SET @Payload = (
				SELECT detail = (SELECT 
									lad.id, 
									m.Id menuId,
									lad.licenciaAccesoId,
									m.[name], 
									m.[url], 
									lad.[Order], 
									ISNULL(lad.Actions, '[]') as 'actions'
								FROM Seguridad.LicenciaAccesoDetalle lad WITH (NOLOCK)  
								INNER JOIN Config.Menu m WITH (NOLOCK) ON lad.MenuId = m.Id
								WHERE lad.Id = @Id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
								)
						,actions = (
								SELECT sa.id, sa.code, sa.[name]
								FROM Config.MenuActions csa WITH(NOLOCK)
								INNER JOIN Seguridad.Actions sa WITH (NOLOCK) 
								ON  csa.ActionId = sa.Id
								WHERE csa.menuId = @MenuId 
								AND csa.IsDeleted = CAST(0 AS BIT) FOR JSON PATH
							)
			FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
			)
			SELECT '0' code, @Payload payload
			RETURN
		END 
	
	SET @Payload = 
	(
        SELECT 
            menus = (
                SELECT m.id, m.[name], m.[url], lad.licenciaAccesoId, lad.[order]
                FROM Seguridad.LicenciaAccesoDetalle lad WITH (NOLOCK)
                INNER JOIN Config.Menu m WITH (NOLOCK) ON lad.MenuId = m.Id
                WHERE LicenciaAccesoId = @LicenciaAccesoId
                FOR JSON PATH
            )
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    ); 
    SELECT '0' AS code, 'Operation successful' AS message, @Payload AS payload;
END;
GO
