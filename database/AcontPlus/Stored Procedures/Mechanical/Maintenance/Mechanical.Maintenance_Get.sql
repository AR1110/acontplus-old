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
-- Mechanical.Maintenance_Get  70, '{"tipo": 3}', ''
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.Maintenance_Get 
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

    -- GET
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'maintenances'

            SELECT Id
                  ,FORMAT([Date], 'dd/MM/yyyy HH:mm') as [Date]
                  ,Obs
	        FROM Mechanical.v_Maintenance WITH (NOLOCK)
            WHERE CompanyId = @CompanyId
           
            RETURN
        END 

    -- GET FOT EDIT 
     IF @tipo = 2
        BEGIN
            
            SELECT @Id = Id FROM OPENJSON(@json) WITH (Id INT '$.id')

            SET @tableNames = 'maintenance,maintenanceDetail'

            SELECT Id
                  ,InspectionId
                  ,FORMAT([Date], 'yyyy-MM-dd') as [Date]
                  ,Obs
	        FROM Mechanical.v_Maintenance WITH (NOLOCK)
            WHERE Id = @Id
            
            SELECT md.Id
                  ,md.ArticuloId as idArticulo
                  ,md.BodegaId as idBodega
                  ,md.TarifaId as idTarifa
                  ,md.MedidaId as idMedida
                  ,md.[Description] as descripcion
                  ,ar.codigo
                  ,md.Quantity
                  ,md.Price
                  ,md.Cost
                  ,md.CodePercentage
                  ,md.[Percentage]
                  ,md.bodegaId
            FROM Mechanical.MaintenanceDetail md WITH (NOLOCK)
            INNER JOIN v_Bodega_Asign         b  WITH (NOLOCK) ON b.idBodega   = md.BodegaId
            INNER JOIN dbo.Articulo           ar WITH (NOLOCK) ON ar.idArticulo = md.ArticuloId
            WHERE MaintenanceId = @Id


            SELECT 
				af.idMedida    
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
			WHERE af.idArticulo IN (SELECT ArticuloId FROM Mechanical.MaintenanceDetail md WITH (NOLOCK) WHERE md.MaintenanceId = @Id)
		
			UNION ALL

			SELECT 
				m.idMedida
			   ,m.descripcion
			   ,tarifas		 = (SELECT ap.idTarifa
                                      ,ap.precioVenta
                                      ,ap.precioConIva
                                      ,UPPER(ta.descripcion) as tarifa
                                      ,ta.ventaPorMayor
								FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
								INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
								WHERE ap.idArticulo = a.idArticulo
								ORDER BY ta.predeterminada DESC FOR JSON PATH
                               )
			  ,orden = 2
			FROM dbo.Articulo     a WITH (NOLOCK)
			INNER JOIN dbo.Medida m WITH (NOLOCK) ON m.idMedida = a.idMedida
			WHERE a.idArticulo IN (SELECT ArticuloId FROM Mechanical.MaintenanceDetail md WITH (NOLOCK) WHERE md.MaintenanceId = @Id )
			ORDER BY orden ASC


            RETURN 
        END 

    -- DATA FORM
    IF @tipo = 3
        BEGIN
            SET @tableNames = 'establecimiento,bodega'
            
            SELECT idEstablecimiento, codEstab, predeterminado, nombreComercial
            FROM v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY predeterminado DESC

            SELECT idBodega ,idEstablecimiento, bodega, codEstab, nombreComercial , defaultBodega
            FROM v_Bodega_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultBodega DESC
        END 

END
