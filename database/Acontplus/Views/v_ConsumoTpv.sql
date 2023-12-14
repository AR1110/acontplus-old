USE Acontplus
GO
IF OBJECT_ID(N'v_ConsumoTpv', N'V') IS NOT NULL
DROP VIEW v_ConsumoTpv
GO
CREATE VIEW v_ConsumoTpv AS ( 
SELECT ct.idConsumoTpv
,ct.fechaRegistro
,ct.estado estadoConsumo
,c.idEntidad
,c.idCliente
,c.numeroIdentificacion
,c.nombreFiscal cliente
,e.idEmpresa
,e.razonSocial empresa
,cft.codEstab
,cft.descripcion servicio
,cft.orden ordenServicio
FROM Restaurant.ConsumoTpv ct WITH (NOLOCK)
INNER JOIN Cliente c WITH (NOLOCK) ON ct.idCliente = c.idCliente
LEFT JOIN Administrador.Empresa e WITH (NOLOCK) ON c.idEmpresa = e.idEmpresa
INNER JOIN Restaurant.ConfigTpv cft WITH (NOLOCK) ON ct.idConfigTpv = cft.idConfigTpv
)