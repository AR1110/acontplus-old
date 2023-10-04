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

-- Sistema de Frenos
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
--	  ,(5,'BI','Bieletas',GETDATE(),1)
--	  ,(5,'BA','Brazo de Acoplamiento',GETDATE(),1)
--	  

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

-- Cabina
--SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'CB'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (8,'PBD','Parabrisa delantera',GETDATE(),1)
--      ,(8,'PP','Parabrisa posterior',GETDATE(),1)
--	  ,(8,'VLD','Vidrio lateral derecho',GETDATE(),1)
--	  ,(8,'VLI','Vidrio lateral izquierdo',GETDATE(),1)
--	  ,(8,'PM','Plumillas',GETDATE(),1)
--	  ,(8,'APC','Asiento piloto y copiloto',GETDATE(),1)
--	  ,(8,'AP','Asiento Posterior',GETDATE(),1)
--      ,(8,'CS','Cinturones de Seguridad',GETDATE(),1)	
--	  ,(8,'ER','Espejo retrovisor',GETDATE(),1)	
--	  ,(8,'ELD','Espejo lateral derecho',GETDATE(),1)	
--	  ,(8,'ELI','Espejo lateral izquierdo',GETDATE(),1)	
--	  ,(8,'BC','Bocina',GETDATE(),1)	
--	  ,(8,'TC','Tablero de control',GETDATE(),1)	
--	  ,(8,'RPC','Radio / porta CD',GETDATE(),1)

-- Sistema de luces 
 --SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'SL'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (7,'LB','Luz baja',GETDATE(),1)
--      ,(7,'LA','Luz alta',GETDATE(),1)
--	  ,(7,'LD','Luces direccionales',GETDATE(),1)
--	  ,(7,'LF','Luz de frenos',GETDATE(),1)
--	  ,(7,'LR','Luz de retroceso',GETDATE(),1)
--	  ,(7,'FN','Faros neblineros',GETDATE(),1)
--	  ,(7,'FR','Faros de retroceso (Pirata)',GETDATE(),1)
--	  ,(7,'LC','Luz de cabina',GETDATE(),1)	
--	  ,(7,'LIT','Luces Indicadores del tablero',GETDATE(),1)	
--	  ,(7,'AR','Alarma de retroceso',GETDATE(),1)	
--	  ,(7,'CL','Circulina',GETDATE(),1)


-- Rodamiento 
-- SELECT * FROM Mechanical.VehiclePartType WHERE Code = 'RD'
--INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description],CreatedAt,[Enabled])
--VALUES (9,'LDB','Llanta delantera derecho',GETDATE(),1)
--      ,(9,'LDI','Llanta delantera izquierdo',GETDATE(),1)
--	  ,(9,'LPD','Llanta posterior derecho',GETDATE(),1)
--	  ,(9,'LPI','Llanta posterior izquierdo',GETDATE(),1)
--	  ,(9,'LLR','Llanta de repuesto',GETDATE(),1)
      --,(5,'PL','Portallanta',GETDATE(),1)	
      --,(5,'GP','Guardapolvos',GETDATE(),1)
	 

--SELECT * FROM Mechanical.VehiclePart