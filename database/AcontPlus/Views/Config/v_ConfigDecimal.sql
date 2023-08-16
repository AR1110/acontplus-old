use Acontplus
GO
IF OBJECT_ID(N'v_ConfigDecimal', N'V') IS NOT NULL
DROP VIEW v_ConfigDecimal
GO
CREATE VIEW v_ConfigDecimal
AS
(
   SELECT cs.idSistema
		 ,cs.idEntidad
		 ,codTrasaccion       = JSON_VALUE(dt.[value],'$.codTransaccion') 
	     ,nroPrecio           = JSON_VALUE(dt.[value],'$.nroPrecio')
         ,nroCantidad         = JSON_VALUE(dt.[value],'$.nroCantidad')
         ,nroIva              = JSON_VALUE(dt.[value],'$.nroIva')
         ,nroDescuentoDetalle = JSON_VALUE(dt.[value],'$.nroDescuentoDetalle')
         ,nroTotalDetalle     = JSON_VALUE(dt.[value],'$.nroTotalDetalle')
         ,nroTotalSubTotal    = JSON_VALUE(dt.[value],'$.nroTotalSubTotal')
         ,nroDescuento        = JSON_VALUE(dt.[value],'$.nroDescuento')
         ,importeTotal        = JSON_VALUE(dt.[value],'$.importeTotal')
         ,nroIce              = JSON_VALUE(dt.[value],'$.nroIce')
   FROM Config.Sistema cs 
   CROSS APPLY OPENJSON(cs.jsonConfig) dt
   WHERE cs.codConfig = 'CD' 
)