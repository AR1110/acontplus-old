USE AcontPlus
ALTER TABLE Restaurant.ConfigTpv ADD orden INT NULL

UPDATE Restaurant.ConfigTpv SET orden = CASE WHEN codigo = 'D' THEN 1 WHEN codigo =  'A' THEN 2 ELSE 3 END