USE [Acontplus]
GO 

---- PARTES DE UN MOTOR 
INSERT INTO Mechanical.VehiclePart
       (VehiclePartTypeId,Code,[Description])
SELECT Id,'VS','Vaso de expansión'                          FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'LL','Depósito del Líquido de limpiaparabrisas'   FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'BT','Batería'                                    FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'AL','Alternador'                                 FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'BM','Bloque motor'                               FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'CT','Colectores'                                 FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'DF','Depósito del líquido de dirección y frenos' FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'IY','Inyectores'                                 FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'BJ','Bujías'                                     FROM Mechanical.VehiclePartType WHERE Code = 'MT'
UNION ALL
SELECT Id,'CB','Caja de fusibles'                           FROM Mechanical.VehiclePartType WHERE Code = 'MT'
	  
-- Sistema de Transmisión
INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description])
SELECT Id,'BB','Bomba'                  FROM Mechanical.VehiclePartType WHERE Code = 'ST'
UNION ALL
SELECT Id,'CVT','Convertidor de torque' FROM Mechanical.VehiclePartType WHERE Code = 'ST'
UNION ALL
SELECT Id,'SS','Sensores'               FROM Mechanical.VehiclePartType WHERE Code = 'ST'
UNION ALL
SELECT Id,'CV','Cuerpo de válvulas'     FROM Mechanical.VehiclePartType WHERE Code = 'ST'
UNION ALL
SELECT Id,'CC','Caja de cambios'        FROM Mechanical.VehiclePartType WHERE Code = 'ST'
UNION ALL
SELECT Id,'FT','Fluido de transmisión'  FROM Mechanical.VehiclePartType WHERE Code = 'ST'

-- Sistema de Frenos
INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description])
SELECT Id,'PD','Pedal' FROM Mechanical.VehiclePartType WHERE Code = 'SF'
union all
SELECT Id,'SF','Servofreno' FROM Mechanical.VehiclePartType WHERE Code = 'SF'
union all
SELECT Id,'BN','Bombines' FROM Mechanical.VehiclePartType WHERE Code = 'SF'
union all
SELECT Id,'PZ','Pinza' FROM Mechanical.VehiclePartType WHERE Code = 'SF'
union all
SELECT Id,'PT','Pastillas' FROM Mechanical.VehiclePartType WHERE Code = 'SF'
union all
SELECT Id,'ZT','Zapatas' FROM Mechanical.VehiclePartType WHERE Code = 'SF'
union all
SELECT Id,'TB','Tambores' FROM Mechanical.VehiclePartType WHERE Code = 'SF'
union all
SELECT Id,'DC','Discos' FROM Mechanical.VehiclePartType WHERE Code = 'SF'

--Sistema de Dirección 
INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description])
Select Id,'VT','Volante' FROM Mechanical.VehiclePartType WHERE Code = 'SD'
union all
Select Id,'SD','Soporte de Dirección' FROM Mechanical.VehiclePartType WHERE Code = 'SD'
union all
Select Id,'AD','Árbol de Dirección' FROM Mechanical.VehiclePartType WHERE Code = 'SD'
union all
Select Id,'MD','Mecanimos de Dirección' FROM Mechanical.VehiclePartType WHERE Code = 'SD'
union all
Select Id,'BI','Bieletas' FROM Mechanical.VehiclePartType WHERE Code = 'SD'
union all
Select Id,'BA','Brazo de Acoplamiento' FROM Mechanical.VehiclePartType WHERE Code = 'SD'
	  

-- Sistema de Suspensión
INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description])
SELECT Id,'BRT','Barra de torsión' FROM Mechanical.VehiclePartType WHERE Code = 'SS'
UNION ALL
SELECT Id,'HQ','Horquillas' FROM Mechanical.VehiclePartType WHERE Code = 'SS'
UNION ALL
SELECT Id,'RL','Rótulas' FROM Mechanical.VehiclePartType WHERE Code = 'SS'
UNION ALL
SELECT Id,'BE','Barras estabilizadoras' FROM Mechanical.VehiclePartType WHERE Code = 'SS'
UNION ALL
SELECT Id,'MH','Muelles helicoidales' FROM Mechanical.VehiclePartType WHERE Code = 'SS'
UNION ALL
SELECT Id,'BUJ','Bujes' FROM Mechanical.VehiclePartType WHERE Code = 'SS'
UNION ALL
SELECT Id,'BS','Brazos de suspensión' FROM Mechanical.VehiclePartType WHERE Code = 'SS'
UNION ALL
SELECT Id,'AT','Amortiguadores' FROM Mechanical.VehiclePartType WHERE Code = 'SS'	

-- Cabina
INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description])
SELECT Id,'PBD','Parabrisa delantera' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'PP','Parabrisa posterior' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'VLD','Vidrio lateral derecho' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'VLI','Vidrio lateral izquierdo' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'PM','Plumillas' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'APC','Asiento piloto y copiloto' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'AP','Asiento Posterior' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'CS','Cinturones de Seguridad' FROM Mechanical.VehiclePartType WHERE Code = 'CB'	
union all
SELECT Id,'ER','Espejo retrovisor' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'ELD','Espejo lateral derecho' FROM Mechanical.VehiclePartType WHERE Code = 'CB'	
union all
SELECT Id,'ELI','Espejo lateral izquierdo' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'BC','Bocina' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'TC','Tablero de control' FROM Mechanical.VehiclePartType WHERE Code = 'CB'
union all
SELECT Id,'RPC','Radio / porta CD' FROM Mechanical.VehiclePartType WHERE Code = 'CB'

-- Sistema de luces 
INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description])
SELECT Id,'LB','Luz baja' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'LA','Luz alta' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'LD','Luces direccionales' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'LF','Luz de frenos' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'LR','Luz de retroceso' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'FN','Faros neblineros' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'FR','Faros de retroceso (Pirata)' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'LC','Luz de cabina' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'LIT','Luces Indicadores del tablero' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'AR','Alarma de retroceso' FROM Mechanical.VehiclePartType WHERE Code = 'SL'
UNION ALL
SELECT Id,'CL','Circulina' FROM Mechanical.VehiclePartType WHERE Code = 'SL'


-- Rodamiento 
INSERT INTO Mechanical.VehiclePart(VehiclePartTypeId,Code,[Description])
SELECT Id,'LDB','Llanta delantera derecho' FROM Mechanical.VehiclePartType WHERE Code = 'RD'
union all
SELECT Id,'LDI','Llanta delantera izquierdo' FROM Mechanical.VehiclePartType WHERE Code = 'RD'
union all
SELECT Id,'LPD','Llanta posterior derecho' FROM Mechanical.VehiclePartType WHERE Code = 'RD'
union all
SELECT Id,'LPI','Llanta posterior izquierdo' FROM Mechanical.VehiclePartType WHERE Code = 'RD'
union all
SELECT Id,'LLR','Llanta de repuesto' FROM Mechanical.VehiclePartType WHERE Code = 'RD'
union all
SELECT Id,'PL','Portallanta' FROM Mechanical.VehiclePartType WHERE Code = 'RD'
union all
SELECT Id,'GP','Guardapolvos' FROM Mechanical.VehiclePartType WHERE Code = 'RD'

	 
--SELECT * FROM Mechanical.VehiclePart