use [AcontPlus]
go 


--ALTER TABLE Inventario.Stock add codigo as CAST(idArticulo AS VARCHAR)+CAST(idBodega AS VARCHAR) 
ALTER TABLE Inventario.Stock add UNIQUE(CODIGO)