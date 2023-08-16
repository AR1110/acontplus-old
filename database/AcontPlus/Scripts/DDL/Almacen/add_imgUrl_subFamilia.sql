use AcontPlus

--- ALTER TABLES -----
---select * from SubFamilia

ALTER TABLE SubFamilia ADD imgUrl VARCHAR(300) NULL
ALTER TABLE SubFamilia ADD applicationId INT NULL 

---- ALTER TABLE Articulo ----
ALTER TABLE Articulo ADD imgUrl VARCHAR(500) NULL


---SELECT * FROM Config.Aplicacion
