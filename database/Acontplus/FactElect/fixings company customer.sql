use acontplus
go
--fixings company customer
update c set c.identidad = cpc.identidad from dbo.cliente c
INNER JOIN Contabilidad.cuentaporcobrar cpc On c.idcliente = cpc.idcliente
where c.identidad not in (select identidad from entidad)

delete from dbo.cliente where identidad not in (select identidad from entidad)

IF NOT EXISTS (SELECT * 
               FROM sys.foreign_keys 
               WHERE name = 'fk_cc_entidad' 
               AND parent_object_id = OBJECT_ID('dbo.Cliente'))
BEGIN
    ALTER TABLE dbo.Cliente
    ADD CONSTRAINT fk_cc_entidad FOREIGN KEY (idEntidad) REFERENCES dbo.Entidad(idEntidad);
END
GO