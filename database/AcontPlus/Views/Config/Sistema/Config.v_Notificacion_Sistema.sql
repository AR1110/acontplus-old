USE AcontPlus
GO
CREATE OR ALTER VIEW Config.v_Notificacion_Sistema WITH SCHEMABINDING AS (
   SELECT st.idSistema
		 ,st.idEntidad
		 ,JSON_VALUE(dj.[value],'$.codigo') as codigo
		 ,CAST(JSON_VALUE(dj.[value],'$.estado') AS BIT) as estado
   FROM Config.Sistema st WITH (NOLOCK)
   CROSS APPLY OPENJSON(st.jsonConfig) dj
   WHERE st.codConfig = 'CS'
)


