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
-- Mechanical.SupportDetail_Get 157, '{"tipo": 1,"id": 3}', ''
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

    SELECT TOP 1 @CompanyId = idEntidad FROM dbo.v_usuario WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    -- GET FOT EDIT 
    IF @tipo = 1
        BEGIN
            SELECT @Id = id FROM OPENJSON(@json) WITH (id INT)

            SET @tableNames = 'support,supportDetail,bodega,tipoIva,decimal'

            SELECT v_s.Id
                  ,v_s.PuntoEmisionId
                  ,v_s.EstablecimientoId
                  ,v_s.VehicleCompanyId
                  ,v_s.CustomerId                  
                  ,v_s.[Date]
                  ,v_s.[Sequence]
                  ,v_s.Obs
                  ,v_s.UserAssignedId                  
                  ,v_s.BusinessName
                  ,v_s.idCard
                  ,v_s.Address
                  ,v_s.Telephone
                  ,v_s.Email
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
                  ,md.[Enabled]         AS estado
                  ,md.Deleted
                  ,ISNULL
                   ((
                        SELECT af.idMedida
                              ,IIF(af.gestionVenta = 1,1,3) as orden
                              ,af.conversion
                              ,af.precioCostoFraccionado
                              ,ar.precioCosto
			                  ,me.descripcion               as descripcion
			                  ,(
                                    SELECT pv.idTarifa
                                          ,pv.precioVenta
                                          ,pv.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor
					                FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
					                INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
					                WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
					                ORDER BY ta.predeterminada DESC 
                                    FOR JSON PATH

                              ) as tarifas
			            FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			            INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
                        INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
			            WHERE af.idArticulo = md.ArticuloId  
                        FOR JSON PATH
                
                    ),'[]') as fraccionado

                   ,ISNULL
                    ((
                        SELECT sc.idMedida
                              ,2              as orden
                              ,1              as conversion
			                  ,sc.precioCosto as precioCostoFraccionado
                              ,sc.precioCosto
                              ,me.descripcion
			                  ,(
                                    SELECT ap.idTarifa
                                          ,ap.precioVenta
                                          ,ap.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor 
					                FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
					                INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
					                WHERE ap.idArticulo = sc.idArticulo
					                ORDER BY ta.predeterminada DESC 
                                    FOR JSON PATH

                               ) as tarifas
			            FROM dbo.Articulo     sc WITH (NOLOCK)
			            INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
			            WHERE sc.idArticulo = md.ArticuloId 
                        FOR JSON PATH

                    ),'[]') as principal

                   ,(
                    SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock st WITH (NOLOCK) WHERE st.idArticulo = md.ArticuloId AND st.idBodega = md.BodegaId FOR JSON PATH
                    ) as consolidacion
            FROM Mechanical.SupportDetail    md WITH (NOLOCK)
            INNER JOIN dbo.Bodega            bo WITH (NOLOCK) ON bo.idBodega   = md.BodegaId
            INNER JOIN Inventario.v_Articulo ar WITH (NOLOCK) ON ar.idArticulo = md.ArticuloId
            WHERE SupportId = @Id
            
            SELECT idBodega
                  ,idEstablecimiento
                  ,bodega
                  ,codEstab
                  ,nombreComercial
                  ,defaultBodega
            FROM v_Bodega_Asign WITH (NOLOCK)
            WHERE idUsuarioRol = @userRoleId 
            ORDER BY defaultBodega DESC

            SELECT idTipoIva,descripcion,codigo,codigoPorcentaje,porcentaje FROM TipoIva WITH (NOLOCK) WHERE estado = 1
            
            SELECT nroPrecio
	              ,nroCantidad
	              ,nroIva
	              ,nroDescuentoDetalle
	              ,nroTotalDetalle
	              ,nroTotalSubTotal
	              ,nroDescuento
	              ,nroIce
	              ,importeTotal
	        FROM Config.v_Sistema_Decimal WITH (NOLOCK)
            WHERE codTrasaccion = 'V' 
              AND idEntidad = @CompanyId

            RETURN
        END
END

   
