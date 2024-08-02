USE Acontplus
DECLARE @codModule NVARCHAR(255) = 'C';
 
 -- Actualizar la propiedad "verOtrasCajas"  
-- UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.verOtrasCajas.enabled', JSON_VALUE(jsonPermission, '$.verOtrasCajas.view')),
--    '$.verOtrasCajas.view', null)
--WHERE codModule = @codModule;

 
 -- Actualizar la propiedad "reporteMovimientoCaja"  
-- UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.reporteMovimientoCaja.enabled', JSON_VALUE(jsonPermission, '$.reporteMovimientoCaja.view')),
--    '$.reporteMovimientoCaja.view', null)
--WHERE codModule = @codModule;

 
 -- Actualizar la propiedad "cerrarCaja"  
-- UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.cerrarCaja.enabled', JSON_VALUE(jsonPermission, '$.cerrarCaja.cerrar')),
--    '$.cerrarCaja.cerrar', null)
--WHERE codModule = @codModule;


 -- Actualizar la propiedad "enterKey"  
-- UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.enterKey.enabled', JSON_VALUE(jsonPermission, '$.enterKey.isRequerid')),
--    '$.enterKey.isRequerid', null)
--WHERE codModule = @codModule;

--addd reporteTransaccionPendiente 
 
UPDATE Config.UserPermission
SET jsonPermission =JSON_MODIFY(
                jsonPermission, 
                '$.reporteTransaccionPendiente', 
                JSON_QUERY('{"label":"Reporte Transacción Pendiente", "enabled":true}')
            )
WHERE codModule = @codModule;


--addd reporteDetalleControlCaja

UPDATE Config.UserPermission
SET jsonPermission =JSON_MODIFY(
                jsonPermission, 
                '$.reporteDetalleControlCaja', 
                JSON_QUERY('{"label":"Reporte Detalle Control Caja", "enabled":true}')
            )
WHERE codModule = @codModule;



 
 SELECT * FROM Config.UserPermission WHERE codModule='C' AND idUsuarioRol = 67