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

    DECLARE @supportId INT ,@userName VARCHAR(200)

    SELECT @supportId =  supportId FROM OPENJSON(@json) WITH( supportId INT)
        
    SELECT TOP 1 @userName = nombreUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId
    
    SET @tableNames = 'headerDs,userAssignedDs,clientDs,vehicleDs,maintenanceDs'

    SELECT en.ruc
          ,en.razonSocial                                                     as companyName
          ,es.nombreComercial                                                 as estabName
          ,es.telefono                                                        as estabPhoneNumber
          ,es.correo                                                          as estabAddress
          ,@userName                                                          as userName
          ,[Common].[ufnGetSerieDocument](es.estab,pe.ptoEmi,sp.[Sequence],0) as [sequence]
    FROM Mechanical.Support        sp WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = sp.PuntoEmisionId
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
    INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.ruc            = es.ruc
    WHERE sp.Id = @SupportId

    SELECT sp.[Date]        as [date]
          ,ur.nombreUsuario as userRecived
          ,ua.nombreUsuario as userAssigned
          ,sp.obs
    FROM Mechanical.Support sp WITH (NOLOCK)
    INNER JOIN dbo.Usuario  ur WITH (NOLOCK) ON ur.idUsuario = sp.UserId
    INNER JOIN dbo.Usuario  ua WITH (NOLOCK) ON ua.idUsuario = sp.UserAssignedId
    WHERE sp.Id = @supportId

    SELECT cl.numeroIdentificacion as IDCard
          ,cl.nombreFiscal         as BusinessName
          ,cl.nombreComercial      as TradeName
          ,cl.correo               as Email
          ,cl.telefono             as Telephone
          ,cl.direccion            as [Address]
    FROM Mechanical.Support sp WITH (NOLOCK)
    INNER JOIN dbo.Cliente  cl WITH (NOLOCK) ON cl.idCliente = sp.CustomerId
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
          ,CONVERT(NUMERIC(18,2), md.Total)    as totalDetail
          ,md.Obs
          ,md.[Percentage]                     as [percentage]
          ,md.Medida                           as medida
          ,md.codigo                           as code
    FROM Mechanical.v_SupportDetail md WITH (NOLOCK) 
    WHERE md.SupportId = @supportId
      AND md.[Enabled] = 1
      AND md.Deleted IS NULL
    
END