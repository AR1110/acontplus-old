USE AcontPlus
GO
--- Mechanical.Support_Report 139, '{"supportId": 1 }',''
CREATE OR ALTER PROC Mechanical.Support_Report
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    DECLARE @supportId INT ,@userName VARCHAR(200) ,@userId INT

    SELECT @supportId = supportId FROM OPENJSON(@json) WITH( supportId INT)
        
    SELECT TOP 1 @userId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT TOP 1 @userName = nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @userId
    
    SET @tableNames = 'headerDs,userAssignedDs,clientDs,vehicleDs,maintenanceDs'

    BEGIN TRY

        SELECT en.ruc
              ,en.razonSocial                                                     as companyName
              ,es.nombreComercial                                                 as estabName
              ,es.telefono                                                        as estabPhoneNumber
              ,es.correo                                                          as estabAddress
              ,@userName                                                          as userName
              ,[Common].[ufnGetSerieDocument](es.estab,pe.ptoEmi,sp.[Sequence],0) as [sequence]
        FROM Mechanical.Support        sp WITH (NOLOCK)
        INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = sp.PuntoEmisionId
        INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento    = pe.idEstablecimiento
        INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad            = es.idEntidad
        WHERE sp.Id = @SupportId

        SELECT FORMAT(sp.[Date], 'dd/MM/yyyy HH:mm:ss') as [date]
              ,ur.nombreUsuario                         as userRecived
              ,ua.nombreUsuario                         as userAssigned
              ,sp.obs
        FROM Mechanical.Support sp WITH (NOLOCK)
        INNER JOIN dbo.Usuario  ur WITH (NOLOCK) ON ur.idUsuario = sp.UserId
        INNER JOIN dbo.Usuario  ua WITH (NOLOCK) ON ua.idUsuario = sp.UserAssignedId
        WHERE sp.Id = @supportId

        SELECT cu.IDCard               as IDCard
              ,cu.BusinessName         as BusinessName
              ,cu.TradeName            as TradeName
              ,cl.correo               as Email
              ,cl.telefono             as Telephone
              ,cl.direccion            as [Address]
        FROM Mechanical.Support      sp WITH (NOLOCK)
        INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = sp.CustomerId
        INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
        WHERE sp.Id = @supportId

        SELECT ve.licensePlate as LicensePlate
              ,ve.brand        as Brand
              ,ve.model        as Model
              ,ve.[year]       as [Year]
              ,ve.color        as Color
              ,ve.engine       as Engine
              ,ve.chassis      as Chassis
              ,ve.cylindraje   as Cylindraje
        FROM Mechanical.Support sp WITH (NOLOCK)
        INNER JOIN Mechanical.VehicleCompany vc WITH (NOLOCK) ON vc.Id = sp.VehicleCompanyId
        INNER JOIN Mechanical.Vehicle        ve WITH (NOLOCK) ON ve.Id = vc.VehicleId
        WHERE sp.Id = @supportId

        SELECT md.Id as idDetail
              ,md.[Description]
              ,CONVERT(NUMERIC(18,2), md.Quantity) as quantity
              ,CONVERT(NUMERIC(18,2), md.Price)    as price
              ,CONVERT(NUMERIC(18,2), md.TaxValue) as taxValue
              ,CONVERT(NUMERIC(18,2), md.Total)    as totalDetail
              ,md.Obs
              ,md.Medida                           as medida
              ,md.codigo                           as code
        FROM Mechanical.v_SupportDetail md WITH (NOLOCK) 
        WHERE md.SupportId = @supportId
          AND md.[Enabled] = 1
          AND md.Deleted IS NULL
    END TRY 

    BEGIN CATCH 
        INSERT INTO ErroresSistema
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Support/Report',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
    END CATCH 
    
END
