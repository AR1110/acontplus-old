use Acontplus
 DECLARE @idEntidad INT
SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = 490


 DECLARE @CurrentSubscriptionId int
   SELECT TOP 1
            @CurrentSubscriptionId = s.Id
        FROM AcontplusAdmin.Sales.Suscripcion s WITH (NOLOCK)
            INNER JOIN AcontplusAdmin.Config.Company ccc WITH (NOLOCK)
            ON s.CompanyId = ccc.Id
            INNER JOIN Acontplus.dbo.Entidad enn WITH (NOLOCK)
            ON enn.Uuid = ccc.Uuid
        WHERE enn.idEntidad = @idEntidad
            AND s.[IsActive] = 1
        ORDER BY s.Id DESC;

--       UPDATE lad
--SET lad.Actions = '[{"code":"LEER","name":"leer"},{"code":"CREAR","name":"crear"},{"code":"EDITA","name":"editar"},{"code":"ELIMI","name":"eliminar"},{"code":"REPOR","name":"reporte"},{"code":"EC","name":"enviarCorreo"},{"code":"CP","name":"cobroPago"},{"code":"ES","name":"enviarSri"},{"code":"HF","name":"historialFinanciero"},{"code":"CUOTA","name":"cuota"},{"code":"ANULA","name":"anular"},{"code":"IMPUE","name":"impuesto"},{"code":"KARDE","name":"kardex"},{"code":"IMAGE","name":"imagen"},{"code":"ACCES","name":"acceso"},{"code":"AC","name":"aperturarCaja"},{"code":"CC","name":"cerrarCaja"},{"code":"GD","name":"generarDocumento"},{"code":"MOVIM","name":"movimiento"}]'
--SELECT lad.Actions, m.Name, m.Code FROM AcontplusAdmin.Seguridad.LicenciaAccesoDetalle lad
--INNER JOIN AcontplusAdmin.Config.Menu m
--    ON lad.MenuId = m.Id
--INNER JOIN AcontplusAdmin.Config.Aplicacion a
--    ON m.AplicacionId = a.Id
--INNER JOIN AcontplusAdmin.Seguridad.LicenciaAcceso la
--    ON lad.LicenciaAccesoId = la.Id AND la.[IsActive] = 1
--INNER JOIN AcontplusAdmin.Config.LicenciaDetalle ld
--    ON a.Id = ld.AplicacionId AND ld.LicenciaId = la.LicenciaId
--INNER JOIN AcontplusAdmin.Sales.SuscripcionDetalle sd
--    ON ld.Id = sd.LicenciaDetalleId AND sd.[IsActive] = 1
--INNER JOIN AcontplusAdmin.Sales.Suscripcion s
--    ON sd.SuscripcionId = s.Id AND s.[IsActive] = 1
--INNER JOIN AcontplusAdmin.Config.Licencia acl ON acl.Id = ld.LicenciaId
--INNER JOIN  AcontplusAdmin.Config.LicenseType aclt ON aclt.Id = acl.LicenseTypeId
--WHERE m.Code='IMP-I'
--WHERE  aclt.Code IN ('P','B') AND m.code = 'CINV';
-- s.Id = @CurrentSubscriptionId
--SELECT lad.Id, m.Code, m.Name, lad.Actions
--FROM AcontplusAdmin.Seguridad.LicenciaAccesoDetalle lad
--INNER JOIN AcontplusAdmin.Config.Menu m ON lad.MenuId = m.Id
--WHERE m.Code = 'IMP-I';

UPDATE lad
SET lad.Actions = '[
  {"code":"LEER","name":"leer"},
  {"code":"CREAR","name":"crear"},
  {"code":"EDITA","name":"editar"},
  {"code":"ELIMI","name":"eliminar"},
  {"code":"REPOR","name":"reporte"},
  {"code":"EC","name":"enviarCorreo"},
  {"code":"CP","name":"cobroPago"},
  {"code":"ES","name":"enviarSri"},
  {"code":"HF","name":"historialFinanciero"},
  {"code":"CUOTA","name":"cuota"},
  {"code":"ANULA","name":"anular"},
  {"code":"IMPUE","name":"impuesto"},
  {"code":"KARDE","name":"kardex"},
  {"code":"IMAGE","name":"imagen"},
  {"code":"ACCES","name":"acceso"},
  {"code":"AC","name":"aperturarCaja"},
  {"code":"CC","name":"cerrarCaja"},
  {"code":"GD","name":"generarDocumento"},
  {"code":"MOVIM","name":"movimiento"}
]'
FROM AcontplusAdmin.Seguridad.LicenciaAccesoDetalle lad
INNER JOIN AcontplusAdmin.Config.Menu m ON lad.MenuId = m.Id
WHERE m.Code = 'IMP-I';
