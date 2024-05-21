USE [Acontplus]
go 

CREATE OR ALTER VIEW Config.v_Sistema_Inventario WITH SCHEMABINDING AS (
   SELECT JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.llevaInventario') as inventory
         ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.idMetodoValoracion') as idMetodoValoracion
	     ,JSON_VALUE(REPLACE((REPLACE(cs.jsonConfig,'[','')),']',''),'$.codMetodoValoracion') as codMetodoValoracion
	     ,idEntidad 
   FROM Config.Sistema cs WITH (NOLOCK)
   WHERE cs.codConfig = 'CI'
)


