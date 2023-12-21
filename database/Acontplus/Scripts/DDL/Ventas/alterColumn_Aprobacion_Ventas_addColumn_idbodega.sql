use [AcontPlus]
GO 

--ALTER TABLE Ventas.Aprob_Document_Detailt ADD idBodega INT FOREIGN KEY REFERENCES dbo.Bodega(idBodega) 


DECLARE @tbTabla AS TABLE(
	idAprob_Document_Detailt INT UNIQUE NOT NULL
   ,idBodega INT 
)

INSERT INTO @tbTabla (idAprob_Document_Detailt,idBodega)
SELECT d.idAprob_Document_Detailt
	  ,idBodega = (SELECT TOP 1 ab.idBodega FROM Config.Bodeg_Asig ab 
					INNER JOIN Config.Estab_Asig e ON e.codEstab_Asig = ab.codEstab_Asig
					inner join App.UsuarioRol u ON u.idUsuarioRol = e.idUsuarioRol
					where e.predeterminado = 1 
					  and ab.predeterminado = 1
				      and u.idUsuario = a.idUsuario
				)
FROM Ventas.Aprob_Document_Detailt d
INNER JOIN Ventas.Aprob_Document a ON a.uniqueId = d.uniqueId

update ad set
	ad.idBodega = t.idBodega
FROM Ventas.Aprob_Document_Detailt ad 
inner join @tbTabla t ON t.idAprob_Document_Detailt = ad.idAprob_Document_Detailt

select * from Ventas.Aprob_Document_Detailt

ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN idBodega INT NOT NULL