use Acontplus
GO
USE AcontPlus
GO
CREATE OR ALTER VIEW Config.v_Notificacion_Sistema WITH SCHEMABINDING AS (
   SELECT st.idSistema
		 ,st.idEntidad
		 ,JSON_VALUE(dj.[value],'$.codigo') as codigo
		 ,JSON_VALUE(dj.[value],'$.estado') as estado
   FROM Config.Sistema st WITH (NOLOCK)
   CROSS APPLY OPENJSON(st.jsonConfig) dj
   WHERE st.codConfig = 'CS'
)


