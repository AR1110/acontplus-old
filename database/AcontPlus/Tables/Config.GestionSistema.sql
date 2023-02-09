CREATE TABLE Config.GestionSistema
(
	  idGestionSistema INT PRIMARY KEY IDENTITY(1,1) NOT NULL
   ,idEntidad INT FOREIGN KEY REFERENCES dbo.Entidad(idEntidad) NOT NULL 
   ,idTipoIva INT FOREIGN KEY REFERENCES dbo.TipoIva(idTipoIva) NOT NULL
   ,idCliente INT FOREIGN KEY REFERENCES dbo.Cliente(idCliente) NULL
   ,idArticulo INT FOREIGN KEY REFERENCES dbo.Articulo(idArticulo) NULL
   ,idMetodoValoracion INT FOREIGN KEY REFERENCES inventario.MetodoValoracion(idMetodoValoracion) NULL
   ,llevaInventario VARCHAR(5) DEFAULT 'NO' NOT NULL 
   ,ruc VARCHAR(20) NOT NULL
   ,codigoPorcentaje INT NOT NULL
   ,nroIdentificacion VARCHAR(20) NULL
   ,codArticulo VARCHAR(20) NULL
   ,codMetodoValoracion VARCHAR(20) NULL
   ,estado BIT DEFAULT 1
)

select * from Config.GestionSistema

--INSERT INTO Config.GestionSistema(idEntidad,idTipoIva,ruc,codigoPorcentaje)
--select cp.idEntidad,cp.idTipoIva,e.ruc,ti.codigoPorcentaje 
--from dbo.ConfigPorcentaje  cp
--INNER JOIN dbo.TipoIva ti On ti.idtipoiva = cp.idTipoIva
--inner join dbo.Entidad e ON e.idEntidad = cp.idEntidad
