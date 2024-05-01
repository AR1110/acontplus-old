GO
USE Acontplus
GO
-- Mechanical.Inspection_Report 139, '{"inspectionId": 2}',''
CREATE OR ALTER PROC Mechanical.Inspection_Report 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
        
    DECLARE @inspectionId INT ,@codEstab VARCHAR(100) ,@SupportId INT ,@userName VARCHAR(300)

    --> DataJson
    SELECT @inspectionId =  inspectionId FROM OPENJSON(@json) WITH( inspectionId INT)
        
    --> Varibles
    SELECT TOP 1 @SupportId = SupportId FROM Mechanical.Inspection WITH (NOLOCK) WHERE Id = @inspectionId

    SELECT TOP 1 @userName = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SET @tableNames = 'headerDs,detalleDs,engineDs,cabinDs,bearingDs,transmissionDs,lightingDs,brakeDs,steeringDs,suspensionDs'

    SELECT en.ruc
          ,en.razonSocial     as companyName
          ,es.nombreComercial as estabName
          ,es.telefono        as estabPhoneNumber
          ,es.correo          as estabAddress
          ,@userName          as userName
    FROM Mechanical.Support        sp WITH (NOLOCK)
    INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = sp.PuntoEmisionId
    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
    INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.ruc            = es.ruc
    WHERE sp.Id = @SupportId
    
    SELECT mvi.Brand
          ,mvi.VehicleType
          ,mvi.Model
          ,FORMAT(mvi.[Date], 'MM/dd/yyyy') as [Date] 
          ,mvi.Mileage
          ,mvi.Fuellevel
          ,mvi.Obs
    FROM Mechanical.v_inspection mvi
    INNER JOIN Mechanical.v_Support mvsup ON mvsup.Id = mvi.SupportId   
    WHERE mvi.Id = @inspectionId

    ---- Motor ----
    SELECT PartEngine    = mve.Part
          ,GoodEngine    = mve.Good
          ,RegularEngine = mve.Regular
          ,BadEngine     = mve.Bad
          ,ObsEngine     = mve.Obs
    FROM Mechanical.v_Engine mve 
    WHERE mve.Id = @inspectionId
      AND mve.[Status] IS NOT NULL
    
    ---- Cabina ----
    SELECT PartCabin    = mvc.Part
          ,GoodCabin    = mvc.Good
          ,RegularCabin = mvc.Regular
          ,BadCabin     = mvc.Bad
          ,ObsCabin     = mvc.Obs 
    FROM Mechanical.v_Cabin mvc  
    WHERE mvc.Id = @inspectionId
      AND mvc.[Status] IS NOT NULL
    
    ---- 
    SELECT PartBearing    = mvb.Part
          ,GoodBearing    = mvb.Good
          ,RegularBearing = mvb.Regular
          ,BadBearing     = mvb.Bad
          ,ObsBearing     = mvb.Obs 
    FROM Mechanical.v_Bearing mvb 
    WHERE mvb.Id = @inspectionId
      AND mvb.[Status] IS NOT NULL
    
    ---- Transmisión ---
    SELECT PartTransmission    = mvt.Part
          ,GoodTransmission    = mvt.Good
          ,RegularTransmission = mvt.Regular
          ,BadTransmission     = mvt.Bad
          ,ObsTransmission     = mvt.Obs  
    FROM Mechanical.v_Transmission mvt 
    WHERE mvt.Id = @inspectionId
      AND mvt.[Status] IS NOT NULL
    
    --- Luces ---
    SELECT PartLighting    = mvl.Part
          ,GoodLighting    = mvl.Good
          ,RegularLighting = mvl.Regular
          ,BadLighting     = mvl.Bad
          ,ObsLighting     = mvl.Obs 
    FROM Mechanical.v_Lighting mvl 
    WHERE mvl.Id = @inspectionId
      AND mvl.[Status] IS NOT NULL
    
    --- 
    SELECT PartBrake    = mvbr.Part
          ,GoodBrake    = mvbr.Good
          ,RegularBrake = mvbr.Regular
          ,BadBrake     = mvbr.Bad
          ,ObsBrake     = mvbr.Obs 
    FROM Mechanical.v_Brake mvbr 
    WHERE mvbr.Id = @inspectionId
      AND mvbr.[Status] IS NOT NULL
    
    SELECT PartSteering    = mvs.Part
          ,GoodSteering    = mvs.Good
          ,RegularSteering = mvs.Regular
          ,BadSteering     = mvs.Bad
          ,ObsSteering     = mvs.Obs
    FROM  Mechanical.v_Steering mvs 
    WHERE mvs.Id = @inspectionId
      AND mvs.[Status] IS NOT NULL
    
    SELECT PartSuspension    = mvsu.Part
          ,GoodSuspension    = mvsu.Good
          ,RegularSuspension = mvsu.Regular
          ,BadSuspension     = mvsu.Bad
          ,ObsSuspension     = mvsu.Obs
    FROM  Mechanical.v_Suspension mvsu 
    WHERE mvsu.Id = @inspectionId
      AND mvsu.[Status] IS NOT NULL
END

