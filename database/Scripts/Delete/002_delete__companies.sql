DECLARE @uuid UNIQUEIDENTIFIER = '5D7DC0C5-E310-45D0-A6B1-C5BDACC9D3E6'

DELETE pea FROM Acontplus.Config.PtoEmi_Asig pea WITH (ROWLOCK)
INNER JOIN  Acontplus.dbo.PuntoEmision pe WITH (NOLOCK) ON pea.idPuntoEmision = pe.idPuntoEmision
INNER JOIN Acontplus.Sri.Establecimiento e  WITH (NOLOCK) ON pe.idEstablecimiento = e.idEstablecimiento
INNER JOIN Acontplus.dbo.Entidad en WITH (NOLOCK) ON e.idEntidad = en.idEntidad
WHERE en.Uuid = @uuid

DELETE ba FROM Acontplus.Config.Bodeg_Asig ba WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Bodega b WITH (NOLOCK) ON ba.idBodega = b.idBodega
INNER JOIN Acontplus.Sri.Establecimiento e  WITH (NOLOCK) ON b.codEstab = e.codEstab
INNER JOIN Acontplus.dbo.Entidad en WITH (NOLOCK) ON e.idEntidad = en.idEntidad
WHERE en.Uuid = @uuid

DELETE ea FROM Acontplus.Config.Estab_Asig ea WITH (ROWLOCK)
INNER JOIN Acontplus.Sri.Establecimiento e  WITH (NOLOCK) ON ea.codEstab = e.codEstab
INNER JOIN Acontplus.dbo.Entidad en WITH (NOLOCK) ON e.idEntidad = en.idEntidad
WHERE en.Uuid = @uuid


DELETE sd FROM Sales.SuscripcionDetalle sd WITH (ROWLOCK)
WHERE SuscripcionId in (
    SELECT s.Id FROM Sales.Suscripcion s WITH (NOLOCK)
    INNER JOIN Config.Company c WITH (NOLOCK) ON s.CompanyId = c.Id
    WHERE c.Uuid = @uuid
) 

DELETE s FROM Sales.Suscripcion s WITH (ROWLOCK)
    INNER JOIN Config.Company c WITH (NOLOCK) ON s.CompanyId = c.Id
    WHERE c.Uuid = @uuid

DELETE FROM Config.CompanyDemoStep WHERE Uuid = @uuid

DELETE FROM Config.Company WHERE Uuid  = @uuid

DELETE up FROM 
Acontplus.Config.UserPermission up WITH (ROWLOCK)
INNER JOIN Acontplus.App.UsuarioRol ur WITH (NOLOCK) ON up.idUsuarioRol = ur.idUsuarioRol 
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid
 
DELETE ur FROM Acontplus.App.UsuarioRol ur WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad 
WHERE e.Uuid = @uuid


 
DELETE s FROM Acontplus.Config.Sistema s WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON s.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid

DELETE s FROM Acontplus.dbo.ConfigVentaDetalle s WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON s.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid

DELETE s FROM Acontplus.dbo.Tarifa s WITH (ROWLOCK)
INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON s.idEntidad = e.idEntidad
WHERE e.Uuid = @uuid


DELETE cd FROM Acontplus.dbo.ConfiguracionDocumento cd WITH(ROWLOCK)
INNER JOIN Acontplus.dbo.PuntoEmision pe WITH (NOLOCK) ON cd.idPuntoEmision = pe.idPuntoEmision
INNER JOIN Acontplus.Sri.Establecimiento e  WITH (NOLOCK) ON pe.idEstablecimiento = e.idEstablecimiento
INNER JOIN Acontplus.dbo.Entidad en WITH (NOLOCK) ON e.idEntidad = en.idEntidad
WHERE en.Uuid = @uuid

DELETE pe FROM Acontplus.dbo.PuntoEmision pe WITH (ROWLOCK)
INNER JOIN Acontplus.Sri.Establecimiento e  WITH (NOLOCK) ON pe.idEstablecimiento = e.idEstablecimiento
INNER JOIN Acontplus.dbo.Entidad en WITH (NOLOCK) ON e.idEntidad = en.idEntidad
WHERE en.Uuid = @uuid

DELETE b FROM Acontplus.dbo.Bodega b WITH (ROWLOCK)
INNER JOIN Acontplus.Sri.Establecimiento e  WITH (NOLOCK) ON b.codEstab = e.codEstab
INNER JOIN Acontplus.dbo.Entidad en WITH (NOLOCK) ON e.idEntidad = en.idEntidad
WHERE en.Uuid = @uuid

DELETE e FROM Acontplus.Sri.Establecimiento e WITH (ROWLOCK)  
INNER JOIN Acontplus.dbo.Entidad en WITH (NOLOCK) ON e.idEntidad = en.idEntidad
WHERE en.Uuid = @uuid
 
 DELETE c FROM 
Acontplus.dbo.Medida c  
inner join Acontplus.dbo.Entidad e on c.idEntidad = e.identidad WHERE e.Uuid = @uuid
 

 DELETE ac FROM Acontplus.dbo.asignacioncaja ac inner join
Acontplus.dbo.caja c  on ac.idcaja = c.idCaja
inner join Acontplus.dbo.Entidad e on c.idEntidad = e.identidad WHERE e.Uuid = @uuid
 

DELETE c FROM 
Acontplus.dbo.caja c  
inner join Acontplus.dbo.Entidad e on c.idEntidad = e.identidad WHERE e.Uuid = @uuid
 

DELETE t FROM Acontplus.dbo.turno t inner join Acontplus.dbo.Entidad e on t.idEntidad = e.identidad WHERE e.Uuid = @uuid
 
 DELETE t FROM Acontplus.dbo.SubFamilia t inner join Acontplus.dbo.Entidad e on t.idEntidad = e.identidad WHERE e.Uuid = @uuid
 

DELETE FROM Acontplus.dbo.Entidad WHERE Uuid = @uuid

DELETE u FROM Acontplus.dbo.Usuario u WITH (ROWLOCK)
    INNER JOIN AcontplusDemo.Demo.UserCustomer uc WITH(NOLOCK) ON u.nombreUsuario = uc.Username
WHERE uc.Uuid = @uuid

DELETE FROM AcontplusDemo.Demo.UserCustomer WHERE uuid = @uuid

DELETE FROM AcontplusDemo.Demo.EmailValidationCode WHERE uuid = @uuid

DELETE FROM AcontplusDemo.Demo.UserCustomer WHERE uuid = @uuid

DELETE FROM AcontplusDemo.Demo.EmailValidationCode WHERE uuid = @uuid

DELETE FROM AcontplusDemo.Demo.UserCustomer WHERE uuid = @uuid

DELETE FROM AcontplusDemo.Demo.EmailValidationCode WHERE uuid = @uuid

DELETE FROM AcontplusDemo.Demo.UserCustomer WHERE uuid = @uuid

DELETE FROM AcontplusDemo.Demo.EmailValidationCode WHERE uuid = @uuid
