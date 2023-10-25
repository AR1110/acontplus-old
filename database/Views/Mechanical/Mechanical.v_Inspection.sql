USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_Inspection WITH SCHEMABINDING AS (
	SELECT it.Id
          ,it.SupportId
          ,it.[Date]
		  ,it.Mileage
		  ,it.Fuellevel
		  ,it.CompanyId
		  ,it.UserId
		  ,it.[Enabled]
		  ,it.Deleted
		  ,it.[Status]
          ,it.Engine
          ,it.Cabin
          ,it.Bearing
          ,it.Transmission
          ,it.Lighting
          ,it.Brake
          ,it.Steering
          ,it.Suspension
          ,it.Obs
		  ,cu.BusinessName
		  ,ve.LicensePlate
		  ,ve.Brand 
		  ,ve.Model
		  ,vt.[Description] as VehicleType
          ,pto.codEstab     as CodEstab
	FROM Mechanical.Inspection           it WITH (NOLOCK)
	INNER JOIN Mechanical.Support        sp WITH (NOLOCK) ON sp.Id        = it.SupportId
	INNER JOIN Mechanical.VehicleCompany vc WITH (NOLOCK) ON vc.Id        = sp.VehicleCompanyId
	INNER JOIN Mechanical.Vehicle        ve WITH (NOLOCK) ON ve.Id        = vc.VehicleId
	INNER JOIN Mechanical.VehicleType    vt WITH (NOLOCK) ON vt.Id        = ve.VehicleTypeId
	INNER JOIN dbo.Cliente               cl WITH (NOLOCK) ON cl.idCliente = sp.CustomerId
    INNER JOIN dbo.PuntoEmision   pto WITH (NOLOCK) ON pto.idPuntoEmision = sp.PuntoEmisionId --- Added by Ignacio
	LEFT JOIN Customer.Customer         cu WITH (NOLOCK) ON cu.Id         = cl.CustomerId 
    
)