use [Acontplus]
go 


--> ADD COLUMN PARA EL MANEJO DE INFORMACION CREDITICIA

    --ALTER TABLE Cliente ADD infoCrediticia NVARCHAR(MAX) 

--> NORMALIZACION DE COLUMNAS DUPLICADAS 
    
    --> Actualizacion de customer nulos
    --UPDATE cl set
    --       cl.CustomerId = (select top 1 c.Id from Customer.Customer c with (nolock) where c.IDCard = cl.numeroIdentificacion)
    --FROM dbo.Cliente cl
    --where cl.CustomerId IS NULL

    --ALTER TABLE dbo.Cliente ALTER COLUMN CustomerId INT NOT NULL

    --ALTER TABLE dbo.Cliente DROP CONSTRAINT df_cli_validation_sri 
    
    --ALTER TABLE dbo.Cliente DROP COLUMN validationSri

    --alter table Cliente add UpdatedByUserId INT CONSTRAINT fk_User_ClienterUpdate FOREIGN KEY (UpdatedByUserId) references dbo.Usuario(idUsuario)

    --alter table Cliente add UpdatedAt DATETIME2 
    
    --alter table cliente drop column nombreComercial
   
    --alter table cliente drop column nombreFiscal
    
    --alter table cliente drop column numeroIdentificacion

--> 11/01/204 --ALEXIS RAMIREZ
    --ALTER TABLE dbo.Cliente ADD configValorBruto BIT


--> 02/06/2025 Alexis Ramirez
    
    --ALTER TABLE dbo.Cliente DROP CONSTRAINT FK__Cliente__idTipoI__67C95AEA

    --ALTER TABLE dbo.Cliente DROP COLUMN idTipoIdentificacion


    SELECT top 10 * FROM Cliente