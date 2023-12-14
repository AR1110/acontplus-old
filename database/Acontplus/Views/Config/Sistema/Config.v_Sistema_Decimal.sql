USE [Acontplus]
go 
CREATE OR ALTER VIEW Config.v_Sistema_Decimal WITH SCHEMABINDING AS (
   SELECT cs.idSistema
		 ,cs.idEntidad
		 ,codTrasaccion       = JSON_VALUE(dt.[value],'$.codTransaccion')
	     ,nroPrecio           = CAST(JSON_VALUE(dt.[value],'$.nroPrecio') AS INT )
         ,nroCantidad         = CAST(JSON_VALUE(dt.[value],'$.nroCantidad') AS INT )
         ,nroIva              = CAST(JSON_VALUE(dt.[value],'$.nroIva') AS INT )
         ,nroDescuentoDetalle = CAST(JSON_VALUE(dt.[value],'$.nroDescuentoDetalle') AS INT )
         ,nroTotalDetalle     = CAST(JSON_VALUE(dt.[value],'$.nroTotalDetalle') AS INT )
         ,nroTotalSubTotal    = CAST(JSON_VALUE(dt.[value],'$.nroTotalSubTotal') AS INT )
         ,nroDescuento        = CAST(JSON_VALUE(dt.[value],'$.nroDescuento') AS INT )
         ,importeTotal        = CAST(JSON_VALUE(dt.[value],'$.importeTotal') AS INT )
         ,nroIce              = CAST(JSON_VALUE(dt.[value],'$.nroIce') AS INT )
   FROM Config.Sistema cs 
   CROSS APPLY OPENJSON(cs.jsonConfig) dt
   WHERE cs.codConfig = 'CD' 
)