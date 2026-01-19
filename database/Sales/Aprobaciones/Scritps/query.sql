use [Acontplus]
go

--select top 50 * from Ventas.Aprob_Document 


--> NORMALIZACION DE LA TABLA Ventas.Aprob_Document_Detailt ENTIDAD RELACION POR ID

    --ALTER TABLE Ventas.Aprob_Document_Detailt ADD idAprob_Document INT CONSTRAINT fk_Aprob_Document_Aprob_Document_Detail FOREIGN KEY (idAprob_Document) REFERENCES Ventas.Aprob_Document  (idAprob_Document)

    --UPDATE ad set
    --       ad.idAprob_Document = av.idAprob_Document
    --from Ventas.Aprob_Document_Detailt ad 
    --inner join Ventas.Aprob_Document av on av.uniqueId = ad.uniqueId
    
    --ALTER TABLE Ventas.Aprob_Document_Detailt ALTER COLUMN idAprob_Document INT NOT NULL

    --ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN uniqueId
    
    --ALTER TABLE Ventas.Aprob_Document_Detailt DROP COLUMN old_codArticulo



--> NORMALIZACION DE TABLA [Ventas].[Aprob_Document_Audit] ENTIDAD RELACION POR ID
    
    
    --ALTER TABLE Ventas.Aprob_Document_Audit ADD idAprob_Document INT CONSTRAINT fk_Aprob_DocumentAprob_Document_Audit FOREIGN KEY (idAprob_Document) REFERENCES Ventas.Aprob_Document  (idAprob_Document)

    --UPDATE ad set
    --       ad.idAprob_Document = av.idAprob_Document
    --from [Ventas].[Aprob_Document_Audit] ad 
    --inner join Ventas.Aprob_Document av on av.uniqueId = ad.uniqueId

    --ALTER TABLE Ventas.Aprob_Document_Audit ALTER COLUMN idAprob_Document INT NOT NULL

    --ALTER TABLE Ventas.Aprob_Document_Audit DROP COLUMN uniqueId

    --ALTER TABLE Ventas.Aprob_Document_Audit DROP COLUMN idEntidad

    --ALTER TABLE Ventas.Aprob_Document_Audit ADD CONSTRAINT FK_User_Aprob_Document_Audit FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)

--> NORMALIZACION DE TABLA [Ventas].[Aprob_Document_Hist] ENTIDAD RELACION POR ID
    
    --ALTER TABLE Ventas.[Aprob_Document_Hist] ADD idAprob_Document INT CONSTRAINT fk_Aprob_Document_Aprob_Document_Hist FOREIGN KEY (idAprob_Document) REFERENCES Ventas.Aprob_Document  (idAprob_Document)

    --UPDATE ad set
    --       ad.idAprob_Document = av.idAprob_Document
    --from [Ventas].[Aprob_Document_Hist] ad 
    --inner join Ventas.Aprob_Document av on av.uniqueId = ad.uniqueId

    --ALTER TABLE Ventas.[Aprob_Document_Hist] ALTER COLUMN idAprob_Document INT NOT NULL

    --ALTER TABLE Ventas.[Aprob_Document_Hist] DROP COLUMN uniqueId
    
    --ALTER TABLE Ventas.Aprob_Document_Hist DROP CONSTRAINT FK_idUsuario_Aprob_Document_Hist 

    --ALTER TABLE Ventas.[Aprob_Document_Hist] DROP COLUMN idUsuario
    
    --ALTER TABLE Ventas.[Aprob_Document_Hist] DROP COLUMN fechaRegistro


--> NORMALIZACION DE LA TABLA Ventas.Aprob_Document COLUMNAS DE AUDITORIAS 

    --ALTER TABLE Ventas.Aprob_Document add UpdatedByUserId INT CONSTRAINT fk_User_ClienterUpdate FOREIGN KEY (UpdatedByUserId) references dbo.Usuario(idUsuario)

    --ALTER TABLE Ventas.Aprob_Document add UpdatedAt DATETIME2 

    --UPDATE ad
    --   set ad.UpdatedByUserId = (select top 1 a.idUsuario from Ventas.Aprob_Document_Anul a where a.uniqueId = ad.uniqueId)
    --      ,ad.UpdatedAt = (select top 1 a.fechaRegistro from Ventas.Aprob_Document_Anul a where a.uniqueId = ad.uniqueId) 
    --FROM Ventas.Aprob_Document ad

    --> ELIMINAMOS LA TABLA Ventas.Aprob_Document_Anul Y SOOLO REGISTRAMOS EL HISTORIAL EN LAS TABLAS DE QUIEN Y CUANDO ANULARON

    --DROP TABLE Ventas.Aprob_Document_Anul;

    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN identificacionComprador

    --ALTER TABLE Ventas.Aprob_Document ADD serieComprobante VARCHAR(50)


    --update ad
    --    set ad.serieComprobante = estab + '-' + ptoEmi  + '-' +  Helper.F_Auto_Sequential(secuencial)
    --from Ventas.Aprob_Document ad 

    --ALTER TABLE Ventas.Aprob_Document alter column serieComprobante VARCHAR(50) not null

    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN estab 
    
    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN ptoEmi 
    
    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN ruc 
    
    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN ambiente 
    
    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN tipoEmision 
    
    --ALTER TABLE Ventas.Aprob_Document DROP CONSTRAINT  UQ__Aprob_Do__AA552EF336D3C563
    
    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN uniqueId 
    
    --ALTER TABLE Ventas.Aprob_Document DROP COLUMN idEntidad 

    
    --update ad set 
    --ad.idCliente = 
    --      (
    --            select TOP 1 cl.idCliente
    --            from Cliente cl 
    --            inner join customer.customer cu on cu.id = cl.CustomerId
    --            where cl.idEntidad = es.idEntidad
    --              AND cu.IDCard = '9999999999999'
    --       ) 
    --FROM Ventas.Aprob_Document ad
    --INNER JOIN dbo.PuntoEmision pe on pe.idPuntoEmision = ad.idPuntoEmision
    --inner join Sri.Establecimiento es on es.idEstablecimiento = pe.idEstablecimiento
    --WHERE ad.idCliente NOT IN (SELECT idCliente FROM dbo.Cliente);

    --> foreing key 

    --ALTER TABLE Ventas.Aprob_Document ADD CONSTRAINT FK_Cliente_Aprob_Document FOREIGN KEY (idCliente) REFERENCES dbo.Cliente(idCliente)
    
    --ALTER TABLE Ventas.Aprob_Document ADD CONSTRAINT FK_PtoEmi_Aprob_Document FOREIGN KEY (idPuntoEmision) REFERENCES dbo.PuntoEmision(idPuntoEmision)
    
    --ALTER TABLE Ventas.Aprob_Document ADD CONSTRAINT FK_User_Aprob_Document FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(idUsuario)
    
    --EXEC sp_rename 'Ventas.Aprob_Document.UdpatedAt', 'UpdatedAt', 'COLUMN';


    --> |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    ---> NORMALICACION DE ID ENTIDAD REALCION IDTIPODOCUMENTO, IDTIPODOCORRIGEN, IDESTADODOCUMENTO 5/26/2025

    --ALTER TABLE Ventas.Aprob_Document ADD idTipoDocumento BIGINT CONSTRAINT fk_idTipDocumento_Aprobacion FOREIGN KEY REFERENCES dbo.TipoDocumento(idTipoDocumento)

    --UPDATE ad set 
    --       ad.idTipoDocumento = case ad.codDoc when '01' THEN (select top 1 idTipoDocumento from dbo.TipoDocumento td where td.codigoSri = '01') 
    --                                           when 'ne' THEN (select top 1 idTipoDocumento from dbo.TipoDocumento td where codigo = 'NE')
    --                            end 
    --from Ventas.Aprob_Document ad

    --ALTER TABLE Ventas.Aprob_Document ALTER COLUMN idTipoDocumento BIGINT NOT NULL

    --ALTER TABLE Ventas.Aprob_Document ADD idTipoDocOrigen BIGINT CONSTRAINT fk_idTipDocOrigen_Aprobacion FOREIGN KEY REFERENCES dbo.TipoDocumento(idTipoDocumento)

    --UPDATE Ventas.Aprob_Document set docOrigen = 'NE' WHERE docOrigen = '01'

    --UPDATE ad set 
    --       ad.idTipoDocOrigen = case ad.docOrigen when 'PR' THEN (select top 1 idTipoDocumento from dbo.TipoDocumento td where td.codigo = 'PR') 
    --                                           when 'NE' THEN (select top 1 idTipoDocumento from dbo.TipoDocumento td where codigo = 'NE')
    --                            end 
    --from Ventas.Aprob_Document ad

    --ALTER TABLE Ventas.Aprob_Document ALTER COLUMN idTipoDocOrigen BIGINT NOT NULL

    --ALTER TABLE Ventas.Aprob_Document ADD idEstadoDocumento INT CONSTRAINT fk_idEstadoDocumento_Aprobacion_05262025 FOREIGN KEY REFERENCES dbo.EstadoPago(idEstadoPago)

    --UPDATE ad set 
    --       ad.idEstadoDocumento = (select top 1 ep.idEstadoPago from dbo.EstadoPago ep where ep.codigo = ad.codEstado) 
    --from Ventas.Aprob_Document ad

    --ALTER TABLE Ventas.Aprob_Document ALTER COLUMN idEstadoDocumento INT NOT NULL

    --ALTER TABLE Ventas.Aprob_Document drop column codDoc
    
    --ALTER TABLE Ventas.Aprob_Document drop column docOrigen
    
    -- ALTER TABLE Ventas.Aprob_Document drop constraint DF__Aprob_Doc__codEs__20FCAC79
     
    -- ALTER TABLE Ventas.Aprob_Document drop column codEstado

    
    --> ENTIDAD REALCION DIRECTA PARA LA TABLA DE HISTORIAL CON LAS TABLAS PROFORMA Y NOTA DE ENTREGA

    --ALTER TABLE Ventas.Aprob_Document_Hist ADD idNotaEntrega BIGINT CONSTRAINT FK_idNotaEntrega_Aprob_Document_Hist FOREIGN KEY REFERENCES dbo.NotaEntrega(idNotaEntrega)

    --update ah
    --   set ah.idNotaEntrega = ne.idNotaEntrega
    --FROM Ventas.Aprob_Document_Hist ah
    --INNER JOIN dbo.NotaEntrega      ne on ne.idNotaEntrega = ah.idDocumento
    --WHERE codDocumento = 'NE'

    --ALTER TABLE Ventas.Aprob_Document_Hist ADD idProforma BIGINT CONSTRAINT FK_idProforma_Aprob_Document_Hist FOREIGN KEY REFERENCES dbo.Proforma(idProforma)
    

    --update ah
    --   set ah.idProforma = pr.idProforma
    --FROM Ventas.Aprob_Document_Hist ah
    --INNER JOIN dbo.Proforma         pr on pr.idProforma = ah.idDocumento
    --WHERE codDocumento = 'PR'


    --alter table Ventas.Aprob_Document_Hist drop column idDocumento 

    --alter table Ventas.Aprob_Document_Hist drop column codDocumento 
    
    --alter table Ventas.Aprob_Document_Hist drop column serie 

    --SELECT TOP 100 * FROM Ventas.Aprob_Document_Hist


    --> ENTIDAD REALCION DIRECTA PARA LA TABLA DE AUDITORIA CON LAS TABLAS FACTURA Y NOTA DE ENTREGA

    --ALTER TABLE Ventas.Aprob_Document_Audit ADD idFactura BIGINT CONSTRAINT FK_idFactura_Aprob_Document_Audit FOREIGN KEY REFERENCES dbo.Factura(idFactura)

    --update au
    --   set au.idFactura = fa.idFactura
    --FROM Ventas.Aprob_Document_Audit au
    --INNER JOIN dbo.Factura           fa on fa.idFactura = au.idDocumento
    --WHERE codDoc = '01'

    --ALTER TABLE Ventas.Aprob_Document_Audit ADD idNotaEntrega BIGINT CONSTRAINT FK_idNotaEntrega_Aprob_Document_Audit FOREIGN KEY REFERENCES dbo.NotaEntrega(idNotaEntrega)

    --update au
    --   set au.idNotaEntrega = ne.idNotaEntrega
    --FROM Ventas.Aprob_Document_Audit au
    --INNER JOIN dbo.NotaEntrega       ne on ne.idNotaEntrega = au.idDocumento
    --WHERE codDoc = 'NE'

    --ALTER TABLE Ventas.Aprob_Document_Audit DROP COLUMN estab 
    --ALTER TABLE Ventas.Aprob_Document_Audit DROP COLUMN ptoEmi 
    --ALTER TABLE Ventas.Aprob_Document_Audit DROP COLUMN secuencial 
    --ALTER TABLE Ventas.Aprob_Document_Audit DROP COLUMN codDoc 
    --ALTER TABLE Ventas.Aprob_Document_Audit DROP COLUMN idDocumento 


    --select * FROM Ventas.Aprob_Document_Audit au
    

    