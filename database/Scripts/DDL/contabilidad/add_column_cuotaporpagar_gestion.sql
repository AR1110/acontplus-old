use [Acontplus]
go 


--alter table contabilidad.cuentaporpagar add fechaRegistro DATETIME DEFAULT GETDATE()


select * from contabilidad.cuentaporpagar



--alter table contabilidad.cuentaporpagar ALTER COLUMN fechaRegistro DATETIME NOT NULL