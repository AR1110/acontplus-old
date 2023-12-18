USE AcontPlus

GO

truncate table Sri.DocumentoSustentoTrib

go
--sustentos facturas
INSERT INTO Sri.DocumentoSustentoTrib(codDocSustento, codSustento)

VALUES ('01', '01'),
('01', '02'),
('01', '03'),
('01', '04'),
('01', '05'),
('01', '06'),
('01', '07'),
('01', '09'),
('01', '14'),
('01', '15'),
('01', '00')
 