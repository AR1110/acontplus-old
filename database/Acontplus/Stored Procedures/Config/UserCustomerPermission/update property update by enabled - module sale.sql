
DECLARE @codModuleVenta NVARCHAR(255) = 'V';
 
 /***
	COMPROBANTE GENERAL
 */
       
--Fecha Emision  
--UPDATE Config.UserPermission SET
-- jsonPermission = JSON_MODIFY(
--       JSON_MODIFY(jsonPermission, '$.comprobante.fechaEmision.enabled', JSON_VALUE(jsonPermission,'$.comprobante.fechaEmision.update')),
--       '$.comprobante.fechaEmision.update',NULL)

-- WHERE codModule= @codModuleVenta  

 --- tiempoCredito
 --UPDATE Config.UserPermission SET
 --jsonPermission = JSON_MODIFY(
 --      JSON_MODIFY(jsonPermission, '$.comprobante.tiempoCredito.enabled', JSON_VALUE(jsonPermission,'$.comprobante.tiempoCredito.update')),
 --      '$.comprobante.tiempoCredito.update',NULL) 
 --WHERE codModule= @codModuleVenta  

 -- tarifa
 -- UPDATE Config.UserPermission SET
 --jsonPermission = JSON_MODIFY(
 --      JSON_MODIFY(jsonPermission, '$.comprobante.tarifa.enabled', JSON_VALUE(jsonPermission,'$.comprobante.tarifa.update')),
 --      '$.comprobante.tarifa.update',NULL) 
 --WHERE codModule= @codModuleVenta

 --- porcentajeDescuento
 --  UPDATE Config.UserPermission SET
 --jsonPermission = JSON_MODIFY(
 --      JSON_MODIFY(jsonPermission, '$.comprobante.porcentajeDescuento.enabled', JSON_VALUE(jsonPermission,'$.comprobante.porcentajeDescuento.update')),
 --      '$.comprobante.porcentajeDescuento.update',NULL) 
 --WHERE codModule= @codModuleVenta

  --- descuento
 --  UPDATE Config.UserPermission SET
 --jsonPermission = JSON_MODIFY(
 --      JSON_MODIFY(jsonPermission, '$.comprobante.descuento.enabled', JSON_VALUE(jsonPermission,'$.comprobante.descuento.update')),
 --      '$.comprobante.descuento.update',NULL) 
 --WHERE codModule= @codModuleVenta
 
 /***
	COMPROBANTE DETALLE 
 */
 -- Actualizar la propiedad "medida" en "detail"
--UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.detail.medida.enabled', JSON_VALUE(jsonPermission, '$.detail.medida.update')),
--    '$.detail.medida.update', null)
--WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "tipoIva" en "detail"
--UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.detail.tipoIva.enabled', JSON_VALUE(jsonPermission, '$.detail.tipoIva.update')),
--    '$.detail.tipoIva.update', null)
--WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "tarifa" en "detail"
--UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.detail.tarifa.enabled', JSON_VALUE(jsonPermission, '$.detail.tarifa.update')),
--    '$.detail.tarifa.update', null)
--WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "precioUnitario" en "detail"
--UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.detail.precioUnitario.enabled', JSON_VALUE(jsonPermission, '$.detail.precioUnitario.update')),
--    '$.detail.precioUnitario.update', null)
--WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "precioConIva" en "detail"
--UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.detail.precioConIva.enabled', JSON_VALUE(jsonPermission, '$.detail.precioConIva.update')),
--    '$.detail.precioConIva.update', null)
--WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "porcentajeDescuento" en "detail"
--UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.detail.porcentajeDescuento.enabled', JSON_VALUE(jsonPermission, '$.detail.porcentajeDescuento.update')),
--    '$.detail.porcentajeDescuento.update', null)
--WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "descuento" en "detail"
--UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    JSON_MODIFY(
--        jsonPermission, 
--        '$.detail.descuento.enabled', JSON_VALUE(jsonPermission, '$.detail.descuento.update')),
--    '$.detail.descuento.update', null)
--WHERE codModule = @codModuleVenta;


-----------------COMPROBANTE ADICIONALES---------------------------------
UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(jsonPermission, '$.additional.requestAuthorizationKey', NULL)   
WHERE codModule = @codModuleVenta;


-- Actualizar la propiedad "viewOthersDocs" en "detail"
UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.additional.viewOthersDocs.enabled', JSON_VALUE(jsonPermission, '$.additional.viewOthersDocs.view')),
    '$.additional.viewOthersDocs.view', null)
WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "kardex" en "detail"
UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.additional.kardex.enabled', JSON_VALUE(jsonPermission, '$.additional.kardex.view')),
    '$.additional.kardex.view', null)
WHERE codModule = @codModuleVenta;

-- Actualizar la propiedad "totalesVenta" en "detail"
UPDATE Config.UserPermission
SET jsonPermission = JSON_MODIFY(
    JSON_MODIFY(
        jsonPermission, 
        '$.additional.totalesVenta.enabled', JSON_VALUE(jsonPermission, '$.additional.totalesVenta.view')),
    '$.additional.totalesVenta.view', null)
WHERE codModule = @codModuleVenta;

 
 -- Agregando la propiedad "keyRequest" en "additional"
-- UPDATE Config.UserPermission
--SET jsonPermission = JSON_MODIFY(
--    jsonPermission, 
--    '$.additional.keyRequest', 
--    JSON_QUERY('
--        {
--            "label": "Solicitar Autorización para Editar o Anular el Doc. Venta",
--            "enabled": false,
--            "usersAdmin": [],
--            "isKeyRequest": true
--        }'
--    )
--)
--WHERE codModule = @codModuleVenta;


 SELECT * FROM Config.UserPermission WHERE idUserPermission = 4