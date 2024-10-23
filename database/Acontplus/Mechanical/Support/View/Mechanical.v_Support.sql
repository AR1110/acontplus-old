USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_Support WITH SCHEMABINDING AS (
	SELECT st.Id
          ,st.PuntoEmisionId
          ,st.VehicleCompanyId
          ,st.CustomerId
          ,st.UserAssignedId
          ,st.[Date]
          ,st.SupportStatusId
          ,st.CompanyId
          ,st.UserId
          ,st.[Enabled]
          ,st.Deleted
          ,st.[Sequence]
          ,st.Obs
          ,ve.LicensePlate
          ,ve.Brand
          ,ve.[Model]
          ,ve.Color
          ,ve.Engine
          ,ct.idCard
          ,ct.TradeName
          ,ct.BusinessName
          ,ct.[Address]
          ,ct.Telephone
          ,ct.Email
          ,pt.ptoEmi
          ,es.codEstab
          ,es.estab
          ,es.nombreComercial
          ,es.idEstablecimiento as EstablecimientoId
          ,''                   as nameAssigned
          ,us.nombreUsuario     as UserAssigned
          ,vt.[Description]     as VehicleType
          ,ts.[Name]            as [Status]
          ,ts.Code              as CodeStatus
    FROM Mechanical.Support              st WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision          pt WITH (NOLOCK) ON pt.idPuntoEmision     = st.PuntoEmisionId
    INNER JOIN dbo.Cliente               cl WITH (NOLOCK) ON cl.idCliente          = st.CustomerId
    INNER JOIN dbo.Usuario               us WITH (NOLOCK) ON us.idUsuario          = st.UserAssignedId
    INNER JOIN Mechanical.VehicleCompany vc WITH (NOLOCK) ON vc.Id                 = st.VehicleCompanyId
    INNER JOIN Mechanical.SupportStatus  ts WITH (NOLOCK) ON ts.Id                 = st.SupportStatusId
    INNER JOIN Sri.Establecimiento       es WITH (NOLOCK) ON es.idEstablecimiento  = pt.idEstablecimiento
    INNER JOIN Mechanical.Vehicle        ve WITH (NOLOCK) ON ve.Id                 = vc.VehicleId
    INNER JOIN Mechanical.VehicleType    vt WITH (NOLOCK) ON vt.Id                 = ve.VehicleTypeId
    INNER JOIN Customer.Customer         ct WITH (NOLOCK) ON ct.Id                 = cl.CustomerId 
 )
