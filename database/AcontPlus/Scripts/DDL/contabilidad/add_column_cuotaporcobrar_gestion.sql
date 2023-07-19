use [AcontPlus]
go 


--alter table Contabilidad.CuentaPorCobrar add secuencial INT 

--alter table Contabilidad.CuentaPorCobrar add fechaRegistro DATETIME  

--alter table Contabilidad.CuentaPorCobrar add observacion VARCHAR(300)  

select * from Contabilidad.CuentaPorCobrar


-- paso 2


--alter table Contabilidad.CuentaPorCobrar alter column secuencial INT not null

--alter table Contabilidad.CuentaPorCobrar alter column fechaRegistro DATETIME not null