use [Acontplus]
go 

CREATE OR ALTER VIEW Config.v_Sistema_Ventas WITH SCHEMABINDING AS (
	SELECT JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.idCliente')                                  as idCliente
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.idArticulo')                                 as idArticulo
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.searchCode') as bit)                    as searchCode
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.printerAutomatic') as bit)              as printerAutomatic
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.payAutomatic') as bit)                  as payAutomatic
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.multipleVendedor') as bit)              as multipleVendedor
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.detailDuplicate') as bit)               as detailDuplicate
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.idFormaPagoSri') as int)                as idFormaPagoSri
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.cc')                                         as cc
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.configInteres') as bit)                 as configDeuda
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.infoInteres.tipoConfig')                     as tipoConfig
		  ,CAST(JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.infoInteres.interes') as numeric(18,5)) as interes
		  ,cs.idEntidad
          ,cs.idSistema
	FROM Config.Sistema cs WITH (NOLOCK)
	WHERE cs.codConfig = 'CV'
)