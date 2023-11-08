USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Get]    Script Date: 12/14/2022 8:56:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-25
-- Description:	SP Para leer los datos e la tabla articulo
-- Mechanical.SupportDetail_Get 157, '{"tipo": 1,"id":2}', ''
-- =============================================
-- DROP PROC Mechanical.SupportDetail_Get
CREATE OR ALTER PROCEDURE Mechanical.SupportDetail_Get
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    DECLARE @Id INT ,@tipo INT ,@CompanyId INT

    SELECT @CompanyId = idEntidad FROM dbo.v_usuario WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

    -- GET FOT EDIT 
    IF @tipo = 1
        BEGIN
            SELECT @Id = Id FROM OPENJSON(@json) WITH (Id INT '$.id')

            SET @tableNames = 'support,supportDetail,medidas,establecimiento,bodega,tipoIva,decimal,ptoEmision,tiempoCredito,tarifaImpuesto'

            SELECT v_s.Id
                  ,v_s.PuntoEmisionId
                  ,v_s.VehicleCompanyId
                  ,v_s.CustomerId                  
                  ,FORMAT(v_s.[Date], 'yyyy-MM-dd') AS [Date]
                  ,v_s.[Sequence]
                  ,v_s.Obs
                  ,v_s.UserAssignedId                  
                  ,v_s.BusinessName
                  ,v_s.idCard
                  ,v_s.codEstab
                  ,v_s.status
	        FROM Mechanical.v_Support v_s WITH (NOLOCK)
            WHERE Id = @Id
                        
            SELECT md.Id
                  ,md.ArticuloId        AS idArticulo
                  ,md.BodegaId          AS idBodega
                  ,md.TarifaId          AS idTarifa
                  ,md.MedidaId          AS idMedida
                  ,md.[Description]     AS descripcion                  
                  ,md.Quantity          AS cantidad
                  ,md.Price             AS precioUnitario
                  ,md.Price             AS precioVenta
                  ,md.Cost              AS precioCosto
                  ,md.CodePercentage    AS codigoPorcentaje
                  ,md.[Percentage]      AS tarifa
                  ,bo.codEstab
                  ,md.Total                  
                  ,ar.llevaInventario
                  ,ar.idTipoIva
                  ,ar.iva
                  ,ar.stockMinimo
                  ,ar.stock
                  ,ar.precioSinSubsidio
                  ,ar.codigo            AS codigoArticulo
                  ,ar.codigoAuxiliar    AS codigoAuxiliar
                  ,0                    AS valorDescuento
            FROM Mechanical.SupportDetail md WITH (NOLOCK)
            INNER JOIN dbo.Bodega             bo WITH (NOLOCK) ON bo.idBodega   = md.BodegaId
            INNER JOIN Inventario.v_Articulo             ar WITH (NOLOCK) ON ar.idArticulo = md.ArticuloId
            WHERE SupportId = @Id
            
            SELECT 
			    af.idArticulo
               ,af.idMedida
			   ,descripcion 
			   ,tarifas		 = (SELECT afs.idTarifa
                                      ,afs.precioVenta
                                      ,afs.precioConIva
                                      ,UPPER(ta.descripcion) as tarifa
                                      ,ta.ventaPorMayor
								FROM dbo.ArticuloFraccionadoPvP  afs WITH (NOLOCK)
								INNER JOIN dbo.Tarifa             ta WITH (NOLOCK) ON ta.idTarifa = afs.idTarifa
								WHERE afs.idArticuloFraccionado = af.idArticuloFraccionado
								ORDER BY ta.predeterminada DESC FOR JSON PATH
                                )
			   ,orden = IIF(af.gestionVenta = 1,1,3)
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida         m WITH (NOLOCK) ON m.idMedida = af.idMedida
			WHERE af.idArticulo IN (SELECT ArticuloId FROM Mechanical.SupportDetail md WITH (NOLOCK) WHERE md.SupportId = @Id)
		
			UNION ALL

			SELECT 
			    a.idArticulo
               ,m.idMedida
			   ,m.descripcion
			   ,tarifas		 = (SELECT ap.idTarifa
                                      ,ap.precioVenta
                                      ,ap.precioConIva
                                      ,UPPER(ta.descripcion) as tarifa
                                      ,ta.ventaPorMayor
								FROM v_ArticuloPvp ap WITH (NOLOCK)
								INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								WHERE ap.idArticulo = a.idArticulo
								ORDER BY ta.predeterminada DESC FOR JSON PATH)
			  ,orden = 2
			FROM dbo.Articulo     a WITH (NOLOCK)
			INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			WHERE a.idArticulo IN (SELECT ArticuloId FROM Mechanical.SupportDetail md WITH (NOLOCK) WHERE md.SupportId = @Id )
			ORDER BY orden ASC
            
            SELECT idEstablecimiento
                    , codEstab
                    , predeterminado
                    , nombreComercial
                    , estab
                    , tarifasImpuestos = (
					    SELECT
						    'IVA ' + descripcion AS descripcion,
						    'IVA' AS codigo,
						    codigo AS codigoPorcentaje,
						    porcentaje AS tarifa
					    FROM Sri.TarifaImpuesto ti WITH (NOLOCK)
					    WHERE ti.estado = 1 
                        AND ((e.actividad = '01' AND ti.codigo IN ('2', '8')) OR (e.actividad <> '01' AND codigo = '2') )
					    ORDER BY codigoPorcentaje DESC
					    FOR JSON PATH
				    )
            FROM v_Estab_Asign e
            WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId 
            ORDER BY predeterminado DESC

            SELECT idBodega
                    ,idEstablecimiento
                    ,bodega
                    ,codEstab
                    ,nombreComercial
                    , defaultBodega
            FROM v_Bodega_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultBodega DESC

            SELECT idTipoIva,descripcion, codigo,codigoPorcentaje,porcentaje FROM TipoIva WITH (NOLOCK) WHERE estado = 1
            
            SELECT * FROM Config.v_Sistema_Decimal WITH (NOLOCK) WHERE codTrasaccion = 'V' AND idEntidad = @CompanyId

            SELECT  idPuntoEmision          as puntoEmisionId
                    ,codEstab
                    ,ptoEmi + '-' + estab   as ptoEmi
                    ,defaultEstab
                    ,defaultPtoEmi
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId 
            ORDER BY defaultEstab DESC

            SELECT idTiempoCredito
                    ,descripcion
                    ,diasCredito
                    ,numeroCuota
                    ,CAST(tipo AS INT) AS tipo
            FROM TiempoCredito WITH (NOLOCK) 
            WHERE idEntidad = @CompanyId
            AND gestion = 1 
            AND estado = 1

            SELECT descripcion = 'IVA '+descripcion 
                    , codigo = 'IVA'
                    , codigoPorcentaje = codigo
                    , tarifa = porcentaje 
            FROM Sri.TarifaImpuesto WITH (NOLOCK) 
            WHERE codigo = '2' 
            AND estado = 1 
            ORDER BY codigoPorcentaje DESC

            RETURN
        END
END

   
