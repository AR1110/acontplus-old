--exec Inventario.Kardex_Get 1052,'[{"byArticulo":"1"}]'
--select * from estadopago
CREATE TABLE Inventario.Movimiento(
	 idMovimiento INT PRIMARY KEY IDENTITY(1,1)
	,codigo NVARCHAR(100) UNIQUE
	,descripcion NVARCHAR(200) NOT NULL
	,estado BIT DEFAULT 1 
)


CREATE TABLE Inventario.Kardex(
	idKardex INT PRIMARY KEY IDENTITY(1,1),
	idMovimiento INT FOREIGN KEY REFERENCES Inventario.Movimiento(idMovimiento),
	idTipoDocumento BIGINT FOREIGN KEY REFERENCES dbo.TipoDocumento(idTipoDocumento) NOT NULL,
	idEstadoDocumento INT FOREIGN KEY REFERENCES dbo.EstadoPago(idEstadoPago) NOT NULL,
	idComprobante INT NOT NULL,
	idArticulo INT FOREIGN KEY REFERENCES dbo.Articulo(idArticulo) NOT NULL,
	idMedida INT FOREIGN KEY REFERENCES dbo.Medida(idMedida) NOT NULL,
	idBodega INT FOREIGN KEY REFERENCES dbo.Bodega(idBodega) NOT NULL,
	idUsuario INT NOT NULL,
	idTarifa INT  NULL,
	numEstab NVARCHAR(20) NOT NULL,
	ptoEmision NVARCHAR(20) NOT NULL,
	nroDocumento INT NOT NULL,
	fechaEmision DATETIME NOT NULL,
	nroIdentificacion NVARCHAR(50),
	precioCosto DECIMAL(20,5),
	cantidad DECIMAL(20,5),
	precio DECIMAL(20,5),
	total AS CAST(cantidad * precio as DECIMAL(20,5))
)

