USE [Acontplus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 8/15/2023
-- Description:	for the management of all data related to the vehicle.
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.Support_Get  
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @tipo INT
           ,@CompanyId INT
           ,@Id INT
           ,@CustomerId INT
           ,@VehicleCompranyId INT
           ,@textSearch VARCHAR(100)
           ,@pageSize INT
	       ,@pageIndex INT 

    SELECT TOP 1 @CompanyId = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

    -- GET LIST -- 
	IF @tipo = 1
		BEGIN
			
            SELECT @pageIndex = pageIndex, @pageSize = pageSize  FROM OPENJSON(@json) WITH (pageIndex INT '$.pageIndex', pageSize INT '$.pageSize')

            SET @tableNames = 'supports'
			
            SELECT Id
                  ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence]
                  ,FORMAT([Date], 'dd/MM/yyyy HH:mm') as [Date]
                  ,idCard
                  ,TradeName
                  ,LicensePlate
                  ,CASE [Status] WHEN 0 THEN 'PENDIENTE' 
                                 WHEN 1 THEN 'REVISIÓN'
                                 WHEN 3 THEN 'PROCESADO'
                                 WHEN 5 THEN 'ANULADO'
                   END as [Status]
                  ,COUNT(*) OVER() AS [TotalRecords]
            FROM Mechanical.v_Support WITH (NOLOCK)
            WHERE CompanyId = @CompanyId
            ORDER BY Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
            
            RETURN
		END

    -- GET DATAFORM -- 
	IF @tipo = 2
		BEGIN
			SET @tableNames = 'establishments,emissionPoints,vehicleTypes,countrys,supportTypes,idTypes'
			
            SELECT idEstablecimiento as establecimientoId
                  ,nombreComercial
             FROM v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY predeterminado DESC

            SELECT ap.idEstablecimiento as establecimientoId
                  ,ap.idPuntoEmision as puntoEmisionId
                  ,ap.estab + '-' + ap.ptoEmi as ptoEmi
                  ,(SELECT (REPLICATE('0',(9-LEN(COUNT(*)+1)))+CONVERT(NVARCHAR(10),COUNT(*)+1)) FROM Mechanical.Support ms WHERE ms.PuntoEmisionId = ap.idPuntoEmision) as sequence
            FROM v_PtoEmi_Asign ap WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultPtoEmi DESC

            SELECT Id as vehicleTypeId, [Description] FROM Mechanical.VehicleType WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1

            SELECT Id as countryId, [Description] FROM Common.Country WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1 

            SELECT Id as supportTypeId ,[Description] FROM Mechanical.SupportType WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1

            SELECT codigoSri as idType
                  ,descripcion as [description] 
                  ,idTipoIdentificacion as tipoIdentificacionId
            FROM dbo.TipoIdentificacion WITH (NOLOCK) 
            WHERE estado = 1
              AND codigoSri IN ('05','04','06')

            RETURN 
		END 

    ---- GET DATAFORM UPDATE O GET ID -- 
    IF @tipo = 3
        BEGIN
            SET @tableNames = 'support,vehicle,customer,paramaters'

            SELECT @Id = Id FROM OPENJSON(@json) WITH (Id INT '$.id')

            SELECT TOP 1 @CustomerId = CustomerId, @VehicleCompranyId = VehicleCompanyId FROM Mechanical.v_Support WITH (NOLOCK) WHERE Id = @Id

            SELECT Id
                  ,PuntoEmisionId
                  ,VehicleCompanyId
                  ,CustomerId
                  ,FORMAT([Date], 'yyyy-MM-dd') as [Date]
            FROM Mechanical.v_Support WITH (NOLOCK)
            WHERE Id = @Id

            SELECT Id
                  ,CountryId
                  ,VehicleTypeId
                  ,VehicleId 
                  ,CustomerId
                  ,LicensePlate
                  ,Brand
                  ,Model
                  ,[Year]
                  ,Color
                  ,Engine
                  ,Chassis
                  ,Cylindraje
            FROM Mechanical.v_Vehicle WITH (NOLOCK) 
            WHERE Id = @VehicleCompranyId

            SELECT IDType
                  ,IDCard
                  ,BusinessName
                  ,TradeName
                  ,Email
                  ,Telephone
                  ,[Address]
            FROM v_Cliente WITH (NOLOCK)
            WHERE idCliente = @CustomerId

             SELECT EstablecimientoId
                   ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence]
            FROM Mechanical.v_Support WITH (NOLOCK)
            WHERE Id = @Id

            RETURN 
        END 

    -- GET SEARCH THE VEHICLE OR CUSTOMER 
    IF @tipo = 4
        BEGIN
            SELECT @textSearch =  REPLACE(textSearch,SPACE(1),'%') FROM OPENJSON(@json) WITH (textSearch VARCHAR(100) '$.textSearch')

            SET @tableNames = 'dataSeach'

            SELECT TOP 20 
                   Id
                  ,LicensePlate
                  ,Brand
                  ,TradeName
            FROM Mechanical.v_Vehicle WITH (NOLOCK) 
            WHERE CompanyId = @CompanyId
              AND (LicensePlate LIKE '%' + @textSearch + '%' 
               OR  IDCard       LIKE '%' + @textSearch + '%'
                  )   

            RETURN 

        END
END
GO
