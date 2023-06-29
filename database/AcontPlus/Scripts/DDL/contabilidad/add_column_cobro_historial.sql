use [AcontPlus]
go 

--ALTER TABLE CobroDetalle ADD interes NUMERIC(18,5) DEFAULT 0
--ALTER TABLE CobroDetalle ADD diasMora INT DEFAULT 0
--ALTER TABLE CobroDetalle ADD mora NUMERIC(18,5) DEFAULT 0


--UPDATE CobroDetalle SET interes =  0
--UPDATE CobroDetalle SET diasMora =  0
--UPDATE CobroDetalle SET mora =  0

--ALTER TABLE CobroDetalle ALTER COLUMN  interes NUMERIC(18,5) NOT NULL
--ALTER TABLE CobroDetalle ALTER COLUMN  diasMora INT NOT NULL
--ALTER TABLE CobroDetalle ALTER COLUMN  mora NUMERIC(18,5) NOT NULL

--ALTER TABLE Contabilidad.Historial_Cobro ADD diasMora INT 
--ALTER TABLE Contabilidad.Historial_Cobro ADD mora NUMERIC(18,5) 

--ALTER TABLE Contabilidad.Historial_Cobro ADD CONSTRAINT df_diasMora_History DEFAULT 0 FOR diasMora
--ALTER TABLE Contabilidad.Historial_Cobro ADD CONSTRAINT df_mora_History DEFAULT 0 FOR mora

--UPDATE Contabilidad.Historial_Cobro SET mora =  0
--UPDATE Contabilidad.Historial_Cobro SET diasMora =  0

--ALTER TABLE Contabilidad.Historial_Cobro ALTER COLUMN  diasMora INT NOT NULL
--ALTER TABLE Contabilidad.Historial_Cobro ALTER COLUMN  mora NUMERIC(18,5) NOT NULL

SELECT * FROM Contabilidad.Historial_Cobro
SELECT * FROM CobroDetalle