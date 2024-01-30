use [Acontplus]
go 

CREATE OR ALTER VIEW Config.v_Sistema_Ventas WITH SCHEMABINDING AS (
	SELECT JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.idCliente')        as idCliente
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.idArticulo')       as idArticulo
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.searchCode')       as searchCode
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.printerAutomatic') as printerAutomatic
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.payAutomatic')     as payAutomatic
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.multipleVendedor') as multipleVendedor
		  ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.detailDuplicate')  as detailDuplicate
		  ,cs.idEntidad
	FROM Config.Sistema cs WITH (NOLOCK)
	WHERE cs.codConfig = 'CV'
)