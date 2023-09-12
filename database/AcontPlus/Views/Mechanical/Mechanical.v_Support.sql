USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_Support WITH SCHEMABINDING AS (
	SELECT st.Id
          ,st.PuntoEmisionId
          ,st.VehicleCompanyId
          ,st.CustomerId
          ,st.[Date]
          ,st.[Status]
          ,st.CompanyId
          ,st.UserId
          ,st.[Enabled]
          ,st.[Sequence]
          ,ct.idCard
          ,ve.LicensePlate
          ,ve.Brand
          ,ct.TradeName
          ,ct.BusinessName
          ,pt.ptoEmi
          ,es.estab
          ,es.idEstablecimiento as EstablecimientoId
    FROM Mechanical.Support              st WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision          pt WITH (NOLOCK) ON pt.idPuntoEmision = st.PuntoEmisionId
    INNER JOIN Sri.Establecimiento       es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
    INNER JOIN Mechanical.VehicleCompany vc WITH (NOLOCK) ON vc.Id             = st.VehicleCompanyId
    INNER JOIN Mechanical.Vehicle        ve WITH (NOLOCK) ON ve.Id             = vc.VehicleId
    INNER JOIN dbo.Cliente               cl WITH (NOLOCK) ON cl.idCliente      = st.CustomerId
     LEFT JOIN Customer.Customer         ct WITH (NOLOCK) ON ct.Id             = cl.CustomerId 
 )