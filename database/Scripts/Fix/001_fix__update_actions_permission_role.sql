use Acontplus
 DECLARE @idEntidad INT
SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = 490


 DECLARE @CurrentSubscriptionId int
   SELECT TOP 1
            @CurrentSubscriptionId = s.Id
        FROM Sales.Suscripcion s WITH (NOLOCK)
            INNER JOIN Config.Company ccc WITH (NOLOCK)
            ON s.CompanyId = ccc.Id
            INNER JOIN dbo.Entidad enn WITH (NOLOCK)
            ON enn.Uuid = ccc.Uuid
        WHERE enn.idEntidad = @idEntidad
            AND s.[IsActive] = 1
        ORDER BY s.Id DESC;

--       UPDATE lad
--SET lad.Actions = '[{"code":"LEER","name":"leer"},{"code":"CREAR","name":"crear"},{"code":"EDITA","name":"editar"},{"code":"ELIMI","name":"eliminar"},{"code":"REPOR","name":"reporte"},{"code":"EC","name":"enviarCorreo"},{"code":"CP","name":"cobroPago"},{"code":"ES","name":"enviarSri"},{"code":"HF","name":"historialFinanciero"},{"code":"CUOTA","name":"cuota"},{"code":"ANULA","name":"anular"},{"code":"IMPUE","name":"impuesto"},{"code":"KARDE","name":"kardex"},{"code":"IMAGE","name":"imagen"},{"code":"ACCES","name":"acceso"},{"code":"AC","name":"aperturarCaja"},{"code":"CC","name":"cerrarCaja"},{"code":"GD","name":"generarDocumento"},{"code":"MOVIM","name":"movimiento"}]'
--SELECT lad.Actions, m.Name, m.Code FROM Seguridad.LicenciaAccesoDetalle lad
--INNER JOIN Config.Menu m
--    ON lad.MenuId = m.Id
--INNER JOIN Config.Aplicacion a
--    ON m.AplicacionId = a.Id
--INNER JOIN Seguridad.LicenciaAcceso la
--    ON lad.LicenciaAccesoId = la.Id AND la.[IsActive] = 1
--INNER JOIN Config.LicenciaDetalle ld
--    ON a.Id = ld.AplicacionId AND ld.LicenciaId = la.LicenciaId
--INNER JOIN Sales.SuscripcionDetalle sd
--    ON ld.Id = sd.LicenciaDetalleId AND sd.[IsActive] = 1
--INNER JOIN Sales.Suscripcion s
--    ON sd.SuscripcionId = s.Id AND s.[IsActive] = 1
--INNER JOIN Config.Licencia acl ON acl.Id = ld.LicenciaId
--INNER JOIN  Config.LicenseType aclt ON aclt.Id = acl.LicenseTypeId
--WHERE m.Code='IMP-I'
--WHERE  aclt.Code IN ('P','B') AND m.code = 'CINV';
-- s.Id = @CurrentSubscriptionId
--SELECT lad.Id, m.Code, m.Name, lad.Actions
--FROM Seguridad.LicenciaAccesoDetalle lad
--INNER JOIN Config.Menu m ON lad.MenuId = m.Id
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
FROM Seguridad.LicenciaAccesoDetalle lad
INNER JOIN Config.Menu m ON lad.MenuId = m.Id
WHERE m.Code = 'IMP-I';
