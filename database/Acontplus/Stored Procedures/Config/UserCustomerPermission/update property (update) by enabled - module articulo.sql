
DECLARE @codModule NVARCHAR(255) = 'AR';
 
 -- Actualizar la propiedad "precio"  
 UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.precio.enabled', JSON_VALUE(jsonPermission, '$.precio.update')),
    '$.precio.update', null)
WHERE codModule = @codModule;

  
 SELECT * FROM Config.UserPermission WHERE idUsuarioRol = 67