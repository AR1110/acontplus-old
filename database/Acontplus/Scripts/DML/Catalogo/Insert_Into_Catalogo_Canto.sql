DECLARE @table TABLE
(
	id INT IDENTITY(1,1)
   ,numero INT
   ,provincia VARCHAR(5)
   ,descripcion VARCHAR(150) NOT NULL
)

INSERT INTO @table (numero,provincia,descripcion)
SELECT  ROW_NUMBER() OVER (PARTITION BY p.codigo ORDER BY c.idCiudad) numero ,provincia = p.codigo, c.descripcion FROM
dbo.Ciudad c
INNER JOIN dbo.Provincia p On p.idProvincia = c.idProvincia


INSERT INTO Catalogo.Canton(provincia,codigo,descripcion)
SELECT provincia,codigo = REPLICATE('0',(2-LEN(numero)))+CONVERT(NVARCHAR(10),numero)+provincia,descripcion FROM @table