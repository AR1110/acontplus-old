use [Acontplus]
go 


CREATE TABLE Contabilidad.Servicio
(
	Id INT PRIMARY KEY IDENTITY(1,1)
   ,TipoDocumentoId INT CONSTRAINT FK_Servicios_TipoDoc FOREIGN KEY (TipoDocumentoId) REFERENCES Inventario.TipoDocumento(idTipoDocumento) NOT NULL
   ,PuntoEmisionId INT CONSTRAINT FK_Servicios_PtoEmi FOREIGN KEY (PuntoEmisionId) REFERENCES dbo.PuntoEmision(idPuntoEmision) NOT NULL
   ,ClienteId INT CONSTRAINT FK_Servicios_Cliente FOREIGN KEY (ClienteId) REFERENCES dbo.Cliente(idCliente) NOT NULL
   ,UsuarioId INT CONSTRAINT FK_Servicios_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(idUsuario) NOT NULL
   ,ArticuloId INT CONSTRAINT FK_Servicios_Articulo FOREIGN KEY (ArticuloId) REFERENCES dbo.Articulo(idArticulo) NOT NULL
   ,TarifaId INT CONSTRAINT FK_Servicios_Tarifa FOREIGN KEY (TarifaId) REFERENCES dbo.Tarifa(idTarifa) NOT NULL
   ,MedidaId INT CONSTRAINT FK_Servicios_Medida FOREIGN KEY (MedidaId) REFERENCES dbo.Medida(idMedida) NOT NULL
   ,TipoIvaId INT CONSTRAINT FK_Servicios_Impuesto FOREIGN KEY (TipoIvaId) REFERENCES dbo.TipoIva(idTipoIva) NOT NULL
   ,BodegaId INT CONSTRAINT FK_Servicios_Bodega FOREIGN KEY (BodegaId) REFERENCES dbo.Bodega(idBodega) NOT NULL
   ,DocumentoId INT NOT NULL
   ,Secuencial INT NOT NULL
   ,FechaEmision DATETIME2 NOT NULL
   ,Descripcion VARCHAR(300) NOT NULL
   ,Nota VARCHAR(300) NULL
   ,Cantidad NUMERIC(18,5) NOT NULL
   ,PrecioUnitario NUMERIC(18,5) NOT NULL
   ,PrecioCosto NUMERIC(18,5) NOT NULL
   ,PrecioTotalSinImpuesto NUMERIC(18,5) NOT NULL
   ,Estado BIT DEFAULT 1 NOT NULL
)

