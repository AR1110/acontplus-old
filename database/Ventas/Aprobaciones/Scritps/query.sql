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

    SELECT top 10 * FROM Ventas.Aprob_Document