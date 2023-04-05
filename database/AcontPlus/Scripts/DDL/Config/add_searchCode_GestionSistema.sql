use [Acontplus]
go 

--ALTER TABLE Config.GestionSistema ADD searchCode INT DEFAULT 0

--ALTER TABLE Config.GestionSistema ADD printerAutomatic INT DEFAULT 0

--ALTER TABLE Config.GestionSistema ADD payAutomatic INT DEFAULT 0

--UPDATE Config.GestionSistema SET searchCode =  0, payAutomatic = 0, printerAutomatic = 0 

SELECT * FROM Config.GestionSistema