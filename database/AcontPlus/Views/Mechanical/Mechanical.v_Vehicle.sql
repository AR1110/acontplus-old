USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_Vehicle WITH SCHEMABINDING AS (
	SELECT vc.Id
		  ,vc.VehicleId
		  ,vc.CompanyId 
		  ,vc.UserId
		  ,vc.CustomerId
		  ,vt.[Description] as VehicleType
		  ,vt.Code
		  ,ve.VehicleTypeId
          ,ve.LicensePlate
		  ,ve.Brand
		  ,ve.Model
		  ,ve.Color
		  ,ve.[Year]
		  ,cs.TradeName
		  ,cs.IDCard
		  ,vc.[Enabled]
		  ,vc.Deleted
	FROM Mechanical.Vehicle              ve  WITH (NOLOCK)
	INNER JOIN Mechanical.VehicleCompany vc WITH (NOLOCK) ON ve.Id        = vc.VehicleId
	INNER JOIN Mechanical.VehicleType    vt WITH (NOLOCK) ON vt.Id        = ve.VehicleTypeId
	INNER JOIN dbo.Cliente               cl WITH (NOLOCK) ON cl.idCliente = vc.CustomerId
	 LEFT JOIN Customer.Customer         cs WITH (NOLOCK) ON cs.Id        = cl.CustomerId 
 )

