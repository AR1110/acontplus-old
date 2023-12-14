use [Acontplus]
go 

--alter table contabilidad.cuentaporpagar add idDocumento INT 

--alter table contabilidad.cuentaporpagar ALTER COLUMN idDocumento INT NOT NULL

select top 100 * from contabilidad.cuentaporpagar 