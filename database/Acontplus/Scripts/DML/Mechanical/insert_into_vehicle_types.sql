USE [Acontplus]
go 


--ALTER TABLE Mechanical.VehicleCompany ADD DEFAULT 1 FOR [Enabled]

--INSERT INTO Mechanical.VehicleType(Description,Code) values ('Automóvil','AT')
--INSERT INTO Mechanical.VehicleType(Description,Code) values ('Camión','CM')
--INSERT INTO Mechanical.VehicleType(Description,Code) values ('Autobús','AB')
--INSERT INTO Mechanical.VehicleType(Description,Code) values ('Motocicleta','MC')
--INSERT INTO Mechanical.VehicleType(Description,Code) values ('Tráiler','TR')

select * from Mechanical.SupportStatus


--INSERT INTO Mechanical.SupportStatus (Code,[Name],[Order],UserId)
--SELECT 'PE','PENDIENTE',1,1
--UNION ALL
--SELECT 'PR','EN PROCESO',2,1
--UNION ALL
--SELECT 'ET','POR ENTREGAR',3,1
--UNION ALL
--SELECT 'AP','APROBADO',4,1
--UNION ALL
--SELECT 'A','ANULADO',5,1



