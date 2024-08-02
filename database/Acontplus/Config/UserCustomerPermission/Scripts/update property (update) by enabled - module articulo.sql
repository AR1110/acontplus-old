USE Acontplus
DECLARE @codModule NVARCHAR(255) = 'AR';
 
 -- Actualizar la propiedad "precio"  
-- UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.precio.enabled', JSON_VALUE(jsonPermission, '$.precio.update')),
--    '$.precio.update', null)
--WHERE codModule = @codModule;


--permiso acceso tab ubicaciones
UPDATE Config.UserPermission
SET jsonPermission =JSON_MODIFY(
                jsonPermission, 
                '$.gestionUbicacion', 
                JSON_QUERY('{"label":"Gestión Ubicación", "enabled":true}')
            )
WHERE codModule = @codModule;
  
 SELECT * FROM Config.UserPermission WHERE idUsuarioRol = 67 AND codModule=@codModule