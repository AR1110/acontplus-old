USE [Acontplus]
GO 


---- PARTES DE UN MOTOR 
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'MT'

--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (1,'VS','Vaso de expansión',GETDATE(),1)
--      ,(1,'LL','Depósito del Líquido de limpiaparabrisas',GETDATE(),1)
--	  ,(1,'BT','Batería',GETDATE(),1)
--	  ,(1,'AL','Alternador',GETDATE(),1)
--	  ,(1,'BM','Bloque motor',GETDATE(),1)
--	  ,(1,'CT','Colectores',GETDATE(),1)
--	  ,(1,'DF','Depósito del líquido de dirección y frenos',GETDATE(),1)
--	  ,(1,'IY','Inyectores',GETDATE(),1)
--	  ,(1,'BJ','Bujías',GETDATE(),1)
--	  ,(1,'CB','Caja de fusibles',GETDATE(),1)
	  
-- Sistema de Transmisión
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'ST'

--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (2,'BB','Bomba',GETDATE(),1)
--      ,(2,'CVT','Convertidor de torque',GETDATE(),1)
--	  ,(2,'SS','Sensores',GETDATE(),1)
--	  ,(2,'CV','Cuerpo de válvulas',GETDATE(),1)
--	  ,(2,'CC','Caja de cambios',GETDATE(),1)
--	  ,(2,'FT','Fluido de transmisión',GETDATE(),1)

-- Sistema de Transmisión
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SF'

--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (3,'PD','Pedal',GETDATE(),1)
--      ,(3,'SF','Servofreno',GETDATE(),1)
--	  ,(3,'BN','Bombines',GETDATE(),1)
--	  ,(3,'PZ','Pinza',GETDATE(),1)
--	  ,(3,'PT','Pastillas',GETDATE(),1)
--	  ,(3,'ZT','Zapatas',GETDATE(),1)
--	  ,(3,'TB','Tambores',GETDATE(),1)
--	  ,(3,'DC','Discos',GETDATE(),1)

--Sistema de Dirección 
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SD'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (5,'VT','Volante',GETDATE(),1)
--      ,(5,'SD','Soporte de Dirección',GETDATE(),1)
--	  ,(5,'AD','Árbol de Dirección',GETDATE(),1)
--	  ,(5,'MD','Mecanimos de Dirección',GETDATE(),1)
--	  ,(5,'GP','Guardapolvos',GETDATE(),1)
--	  ,(5,'BI','Bieletas',GETDATE(),1)
--	  ,(5,'BA','Brazo de Acoplamiento',GETDATE(),1)
--	  ,(5,'PL','Portallanta',GETDATE(),1)	

-- Sistema de Suspensión
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SS'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (6,'BRT','Barra de torsión',GETDATE(),1)
--      ,(6,'HQ','Horquillas',GETDATE(),1)
--	  ,(6,'RL','Rótulas',GETDATE(),1)
--	  ,(6,'BE','Barras estabilizadoras',GETDATE(),1)
--	  ,(6,'MH','Muelles helicoidales',GETDATE(),1)
--	  ,(6,'BUJ','Bujes',GETDATE(),1)
--	  ,(6,'BS','Brazos de suspensión',GETDATE(),1)
--	  ,(6,'AT','Amortiguadores',GETDATE(),1)	

SELECT * FROM Mechanical.VehiclePartType