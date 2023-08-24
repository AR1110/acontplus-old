USE [Acontplus]
go 


INSERT INTO Mechanical.VehicleType(Description,Code,CreatedAt,Enabled) values ('Automóvil','AT',GETDATE(),1)
INSERT INTO Mechanical.VehicleType(Description,Code,CreatedAt,Enabled) values ('Camión','CM',GETDATE(),1)
INSERT INTO Mechanical.VehicleType(Description,Code,CreatedAt,Enabled) values ('Autobús','AB',GETDATE(),1)
INSERT INTO Mechanical.VehicleType(Description,Code,CreatedAt,Enabled) values ('Motocicleta','MC',GETDATE(),1)
INSERT INTO Mechanical.VehicleType(Description,Code,CreatedAt,Enabled) values ('Tráiler','TR',GETDATE(),1)

select * from Mechanical.VehicleType