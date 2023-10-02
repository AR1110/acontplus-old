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
                  ,md.[Description] as descripcion
                  ,ar.codigo
                  ,md.Quantity
            FROM Mechanical.MaintenanceDetail md WITH (NOLOCK)
            INNER JOIN dbo.Articulo           ar WITH (NOLOCK) ON ar.idArticulo = md.ArticuloId
            WHERE MaintenanceId = @Id 

            RETURN 
        END 

END
