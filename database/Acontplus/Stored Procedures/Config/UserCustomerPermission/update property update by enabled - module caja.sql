
DECLARE @codModule NVARCHAR(255) = 'C';
 
 -- Actualizar la propiedad "verOtrasCajas"  
 UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.verOtrasCajas.enabled', JSON_VALUE(jsonPermission, '$.verOtrasCajas.view')),
    '$.verOtrasCajas.view', null)
WHERE codModule = @codModule;

 
 -- Actualizar la propiedad "reporteMovimientoCaja"  
 UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.reporteMovimientoCaja.enabled', JSON_VALUE(jsonPermission, '$.reporteMovimientoCaja.view')),
    '$.reporteMovimientoCaja.view', null)
WHERE codModule = @codModule;

 
 -- Actualizar la propiedad "cerrarCaja"  
 UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.cerrarCaja.enabled', JSON_VALUE(jsonPermission, '$.cerrarCaja.cerrar')),
    '$.cerrarCaja.cerrar', null)
WHERE codModule = @codModule;


 -- Actualizar la propiedad "enterKey"  
 UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.enterKey.enabled', JSON_VALUE(jsonPermission, '$.enterKey.isRequerid')),
    '$.enterKey.isRequerid', null)
WHERE codModule = @codModule;


 
 SELECT * FROM Config.UserPermission WHERE idUsuarioRol = 67