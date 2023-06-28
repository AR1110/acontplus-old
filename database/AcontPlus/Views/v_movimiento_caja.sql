USE AcontPlus
GO
IF OBJECT_ID(N'v_movimiento_caja', N'V') IS NOT NULL
DROP VIEW v_movimiento_caja
GO
CREATE VIEW v_movimiento_caja AS (
	SELECT 
	mc.idMovimientoCaja
	,e.razonSocial
	,e.ruc
	,establecimiento  = s.nombreComercial
	,s.dirEstablecimiento
	,s.estab 
	,fechaEmision = mc.fechaEmision							
	,mc.nroDoc
	,tipoDoc = tdoc.descripcion
	,codDoc = tdoc.codigo
	,entregadoPor = u.nombreCompleto
	,recibidoPor = em.nombreCompleto
	,entidadFinanciera = sef.descripcion
	,valor = mc.valor
	,observacion = mc.observaciones
	,usuario = u.nombreUsuario							
	FROM dbo.MovimientoCaja mc	WITH(NOLOCK)
	INNER JOIN dbo.Entidad e WITH(NOLOCK)    ON e.idEntidad = mc.idEntidad
	INNER JOIN Sri.Establecimiento s WITH(NOLOCK)  ON s.codEstab = mc.codEstab
	INNER JOIN dbo.Empleado em WITH(NOLOCK) ON em.idEmpleado = mc.idEmpleado
	INNER JOIN dbo.SubEntidadFinanciera sef WITH(NOLOCK) ON sef.idSubEntidadFinanciera = mc.idSubEntidadFinanciera	
	INNER JOIN dbo.TipoDocumento tdoc WITH(NOLOCK) ON tdoc.idTipoDocumento = mc.idTipoDocumento 
	INNER JOIN dbo.Usuario u ON u.idUsuario = mc.idUsuarioRegister
 )
