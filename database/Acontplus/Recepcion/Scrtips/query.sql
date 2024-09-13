use [Acontplus]
go 


--ALTER TABLE Recepcion.DocumentoRecibido add estado BIT DEFAULT 1 

--UPDATE Recepcion.DocumentoRecibido SET estado = 1 

select top 1 * from Recepcion.DocumentoRecibido