USE [Acontplus]
go 
CREATE OR ALTER VIEW Config.v_Sistema_Decimal WITH SCHEMABINDING AS (
   SELECT cs.idSistema
		 ,cs.idEntidad
		 ,codTrasaccion       = JSON_VALUE(dt.[value],'$.codTransaccion')
	     ,codTransaccion      = JSON_VALUE(dt.[value],'$.codTransaccion')
         ,nroPrecio           = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroPrecio'),2) AS INT )
         ,nroCantidad         = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroCantidad'),2) AS INT )
         ,nroIva              = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroIva'),2) AS INT )
         ,nroDescuentoDetalle = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroDescuentoDetalle'),2) AS INT )
         ,nroTotalDetalle     = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroTotalDetalle'),2) AS INT )
         ,nroTotalSubTotal    = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroTotalSubTotal'),2) AS INT )
         ,nroDescuento        = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroDescuento'),2) AS INT )
         ,importeTotal        = CAST(ISNULL(JSON_VALUE(dt.[value],'$.importeTotal'),2) AS INT )
         ,nroIce              = CAST(ISNULL(JSON_VALUE(dt.[value],'$.nroIce'),2) AS INT )
   FROM Config.Sistema cs 
   CROSS APPLY OPENJSON(cs.jsonConfig) dt
   WHERE cs.codConfig = 'CD' 
)