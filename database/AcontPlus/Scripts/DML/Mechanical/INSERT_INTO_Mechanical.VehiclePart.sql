USE [Acontplus]
GO 


---- PARTES DE UN MOTOR 
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'MT'

--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (2,'VS','Vaso de expansión',GETDATE(),1)
--      ,(2,'LL','Depósito del Líquido de limpiaparabrisas',GETDATE(),1)
--	  ,(2,'BT','Batería',GETDATE(),1)
--	  ,(2,'AL','Alternador',GETDATE(),1)
--	  ,(2,'BM','Bloque motor',GETDATE(),1)
--	  ,(2,'CT','Colectores',GETDATE(),1)
--	  ,(2,'DF','Depósito del líquido de dirección y frenos',GETDATE(),1)
--	  ,(2,'IY','Inyectores',GETDATE(),1)
--	  ,(2,'BJ','Bujías',GETDATE(),1)
--	  ,(2,'CB','Caja de fusibles',GETDATE(),1)
	  
-- Sistema de Transmisión
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'ST'

--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (3,'BB','Bomba',GETDATE(),1)
--      ,(3,'CVT','Convertidor de torque',GETDATE(),1)
--	  ,(3,'SS','Sensores',GETDATE(),1)
--	  ,(3,'CV','Cuerpo de válvulas',GETDATE(),1)
--	  ,(3,'CC','Caja de cambios',GETDATE(),1)
--	  ,(3,'FT','Fluido de transmisión',GETDATE(),1)

-- Sistema de Frenos
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SF'

--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (4,'PD','Pedal',GETDATE(),1)
--      ,(4,'SF','Servofreno',GETDATE(),1)
--	  ,(4,'BN','Bombines',GETDATE(),1)
--	  ,(4,'PZ','Pinza',GETDATE(),1)
--	  ,(4,'PT','Pastillas',GETDATE(),1)
--	  ,(4,'ZT','Zapatas',GETDATE(),1)
--	  ,(4,'TB','Tambores',GETDATE(),1)
--	  ,(4,'DC','Discos',GETDATE(),1)

--Sistema de Dirección 
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SD'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (6,'VT','Volante',GETDATE(),1)
--      ,(6,'SD','Soporte de Dirección',GETDATE(),1)
--	  ,(6,'AD','Árbol de Dirección',GETDATE(),1)
--	  ,(6,'MD','Mecanimos de Dirección',GETDATE(),1)
--	  ,(6,'BI','Bieletas',GETDATE(),1)
--	  ,(6,'BA','Brazo de Acoplamiento',GETDATE(),1)
	  

-- Sistema de Suspensión
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SS'

--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (7,'BRT','Barra de torsión',GETDATE(),1)
--      ,(7,'HQ','Horquillas',GETDATE(),1)
--	  ,(7,'RL','Rótulas',GETDATE(),1)
--	  ,(7,'BE','Barras estabilizadoras',GETDATE(),1)
--	  ,(7,'MH','Muelles helicoidales',GETDATE(),1)
--	  ,(7,'BUJ','Bujes',GETDATE(),1)
--	  ,(7,'BS','Brazos de suspensión',GETDATE(),1)
--	  ,(7,'AT','Amortiguadores',GETDATE(),1)	

-- Cabina
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'CB'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (9,'PBD','Parabrisa delantera',GETDATE(),1)
--      ,(9,'PP','Parabrisa posterior',GETDATE(),1)
--	  ,(9,'VLD','Vidrio lateral derecho',GETDATE(),1)
--	  ,(9,'VLI','Vidrio lateral izquierdo',GETDATE(),1)
--	  ,(9,'PM','Plumillas',GETDATE(),1)
--	  ,(9,'APC','Asiento piloto y copiloto',GETDATE(),1)
--	  ,(9,'AP','Asiento Posterior',GETDATE(),1)
--      ,(9,'CS','Cinturones de Seguridad',GETDATE(),1)	
--	  ,(9,'ER','Espejo retrovisor',GETDATE(),1)	
--	  ,(9,'ELD','Espejo lateral derecho',GETDATE(),1)	
--	  ,(9,'ELI','Espejo lateral izquierdo',GETDATE(),1)	
--	  ,(9,'BC','Bocina',GETDATE(),1)	
--	  ,(9,'TC','Tablero de control',GETDATE(),1)	
--	  ,(9,'RPC','Radio / porta CD',GETDATE(),1)

-- Sistema de luces 
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SL'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (8,'LB','Luz baja',GETDATE(),1)
--      ,(8,'LA','Luz alta',GETDATE(),1)
--	  ,(8,'LD','Luces direccionales',GETDATE(),1)
--	  ,(8,'LF','Luz de frenos',GETDATE(),1)
--	  ,(8,'LR','Luz de retroceso',GETDATE(),1)
--	  ,(8,'FN','Faros neblineros',GETDATE(),1)
--	  ,(8,'FR','Faros de retroceso (Pirata)',GETDATE(),1)
--	  ,(8,'LC','Luz de cabina',GETDATE(),1)	
--	  ,(8,'LIT','Luces Indicadores del tablero',GETDATE(),1)	
--	  ,(8,'AR','Alarma de retroceso',GETDATE(),1)	
--	  ,(8,'CL','Circulina',GETDATE(),1)


-- Rodamiento 
-- SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'RD'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (10,'LDB','Llanta delantera derecho',GETDATE(),1)
--      ,(10,'LDI','Llanta delantera izquierdo',GETDATE(),1)
--	  ,(10,'LPD','Llanta posterior derecho',GETDATE(),1)
--	  ,(10,'LPI','Llanta posterior izquierdo',GETDATE(),1)
--	  ,(10,'LLR','Llanta de repuesto',GETDATE(),1)
--      ,(6,'PL','Portallanta',GETDATE(),1)	
--      ,(6,'GP','Guardapolvos',GETDATE(),1)
	 
--SELECT * FROM Mechanical.VehiclePart