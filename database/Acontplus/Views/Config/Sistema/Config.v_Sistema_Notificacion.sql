USE AcontPlus
GO
CREATE OR ALTER VIEW Config.v_Sistema_Notificacion WITH SCHEMABINDING AS (
   SELECT st.idSistema
		 ,st.idEntidad
         ,JSON_VALUE(dj.[value],'$.idNotificacionSistema') as idNotificacionSistema
		 ,JSON_VALUE(dj.[value],'$.codigo') as codigo
         ,JSON_VALUE(dj.[value],'$.descripcion') as descripcion
		 ,CAST(JSON_VALUE(dj.[value],'$.estado') AS BIT) as estado
   FROM Config.Sistema st WITH (NOLOCK)
   CROSS APPLY OPENJSON(st.jsonConfig) dj
   WHERE st.codConfig = 'CS'
)


