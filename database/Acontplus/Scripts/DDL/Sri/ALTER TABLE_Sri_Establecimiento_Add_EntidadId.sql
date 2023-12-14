use [Acontplus]
go 


ALTER TABLE Sri.Establecimiento ADD EntidadId INT 

ALTER TABLE Sri.Establecimiento ADD CONSTRAINT fk_de_entidad FOREIGN KEY (EntidadId) REFERENCES dbo.Entidad(idEntidad)

select * from Sri.Establecimiento

--UPDATE es set 
--	es.EntidadId = (select en.idEntidad from dbo.Entidad en where en.ruc = es.ruc)
--FROM Sri.Establecimiento es with (nolock) 

ALTER TABLE Sri.Establecimiento ALTER COLUMN EntidadId INT NOT NULL