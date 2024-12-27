USE AcontPlus
GO
CREATE OR ALTER VIEW Compra.v_Proveedor WITH SCHEMABINDING AS (

	SELECT pr.idProveedor
		  ,pr.idEntidad
          ,pr.idUsuario
          ,pr.CustomerId
          ,pr.idSubContribuyente
          ,pr.direccion
		  ,pr.telefono
		  ,pr.correo
		  ,pr.estado
		  ,cu.IDcard       as numeroIdentificacion
		  ,cu.tradeName    as nombreComercial     
		  ,cu.BusinessName as razonSocial     
          ,ti.codigoSri    as codTipoIdentificacion
		  ,ti.descripcion  as TipoIdentificacion 
		  ,sc.descripcion  as subContribuyente  
    FROM dbo.Proveedor                pr WITH (NOLOCK)
    INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.id                   = pr.CustomerId
    INNER JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = pr.idTipoIdentificacion
	 LEFT JOIN dbo.SubContribuyente   sc WITH (NOLOCK) ON sc.idSubContribuyente   = pr.idSubContribuyente
)