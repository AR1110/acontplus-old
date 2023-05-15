use [AcontPlus]
go 


DECLARE @tableAplicacion AS TABLE(
	 idAplicacion INT IDENTITY (1,1)
	,codigo AS CAST(idEntidad as VARCHAR)+codConfig
	,idEntidad INT NOT NULL
	,codConfig VARCHAR(5) NOT NULL
	,jsonConfig VARCHAR(MAX) NOT NULL
	,fechaRegistro DATETIME DEFAULT GETDATE()
	,estado BIT DEFAULT 1
)
--SELECT * FROM dbo.Entidad WHERE ruc = '0101374015001'
INSERT INTO @tableAplicacion (idEntidad,codConfig,jsonConfig)
SELECT en.idEntidad,codConfig = 'CV', 
jsonConfig = (
				SELECT gs.idCliente,gs.idArticulo,gs.searchCode,gs.printerAutomatic,gs.payAutomatic 
				FROM Config.GestionSistema gs WITH (NOLOCK) WHERE gs.idEntidad = en.idEntidad FOR JSON PATH )

FROM dbo.Entidad en WITH (NOLOCK) WHERE estado = 1


INSERT INTO @tableAplicacion (idEntidad,codConfig,jsonConfig)
SELECT en.idEntidad,codConfig = 'CD', 
jsonConfig = (
				select cd.idTipoTransaccion,cd.codTransaccion,cd.nroPrecio,cd.nroCantidad,cd.nroIva,cd.nroDescuentoDetalle,cd.nroTotalDetalle,cd.nroTotalSubTotal,cd.nroDescuento,cd.nroIce
				from Config.CantidadDecimal cd WITH (NOLOCK) where cd.idEntidad = en.idEntidad for json path)

FROM dbo.Entidad en WITH (NOLOCK) WHERE estado = 1


INSERT INTO @tableAplicacion (idEntidad,codConfig,jsonConfig)
SELECT en.idEntidad,codConfig = 'CI', 
jsonConfig = (
				SELECT gs.idMetodoValoracion,gs.codMetodoValoracion,gs.llevaInventario FROM Config.GestionSistema gs WHERE gs.idEntidad = en.idEntidad FOR JSON PATH
				)

FROM dbo.Entidad en WITH (NOLOCK) WHERE estado = 1


INSERT INTO @tableAplicacion (idEntidad,codConfig,jsonConfig)
SELECT en.idEntidad,codConfig = 'CS', 
jsonConfig =ISNULL((
				 SELECT ns.idNotificacionSistema,ns.codigo,en.estado
			     FROM Config.EntidadNotificacion et WITH (NOLOCK)
				 INNER JOIN Config.NotificacionSistema ns WITH (NOLOCK) ON ns.idNotificacionSistema = et.idNotificacionSistema
                 WHERE et.idEntidad = en.idEntidad  FOR JSON PATH
			 ),'[]')

FROM dbo.Entidad en WITH (NOLOCK) WHERE estado = 1


--INSERT INTO Config.Sistema (idEntidad,codConfig,jsonConfig)
--SELECT idEntidad,codConfig,jsonConfig FROM @tableAplicacion  order by idEntidad ASC 


select jsonConfig from Config.Sistema WHERE idEntidad = 4 AND codConfig = 'CD'
