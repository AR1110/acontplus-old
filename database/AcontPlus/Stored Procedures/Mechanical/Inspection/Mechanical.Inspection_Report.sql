GO
USE Acontplus
GO
-- Mechanical.Inspection_Report 139, '{"inspectionId": 4}'
CREATE OR ALTER PROC Mechanical.Inspection_Report
@idUsuarioRol INT
,@json      VARCHAR(300)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
        
    DECLARE @inspectionId   INT
    DECLARE @codEstab VARCHAR(100)

    SELECT @inspectionId =  inspectionId
    FROM OPENJSON(@json)
    WITH( inspectionId INT '$.inspectionId' )
        
    SELECT TOP 1 @codEstab = codEstab FROM v_Estab_Asign WHERE idUsuarioRol = @idUsuarioRol

    SELECT
        ruc               = v_ea.ruc
        ,companyName      = v_u.entidad
        ,estabName        = v_ea.nombreComercial
        ,estabPhoneNumber = v_ea.telefono
        ,estabAddress     = v_ea.correo
        ,userName         = v_ea.usuario
    FROM v_Estab_Asign v_ea WITH(NOLOCK)
    INNER JOIN v_usuario v_u WITH(NOLOCK) ON v_u.idUsuarioRol = v_ea.idUsuarioRol
    WHERE v_ea.codEstab = @codEstab
    
    SELECT 
    ----- PRINCIPAL -----
        Brand               = mvi.Brand
        ,VehicleType        = mvi.VehicleType
        ,Model              = mvi.Model
        ,Color              = mvsup.Color
        ,Motor              = mvsup.Engine
        ,[Date]             = FORMAT(mvi.[Date], 'MM/dd/yyyy')
        ,Mileage            = mvi.Mileage
        ,Fuellevel          = mvi.Fuellevel
        ,Obs                = mvi.Obs
    FROM Mechanical.v_inspection mvi
    INNER JOIN Mechanical.v_Support mvsup ON mvsup.Id = mvi.SupportId   
    WHERE mvi.Id = @inspectionId

    ---- Motor ----
    SELECT PartEngine   = mve.Part
        ,GoodEngine     = mve.Good
        ,RegularEngine  = mve.Regular
        ,BadEngine      = mve.Bad
        ,ObsEngine      = mve.Obs
    FROM  Mechanical.v_Engine mve 
    WHERE mve.Id = @inspectionId
    AND mve.[Status] IS NOT NULL
    
    ---- Cabina ----
    SELECT PartCabin   = mvc.Part
        ,GoodCabin     = mvc.Good
        ,RegularCabin  = mvc.Regular
        ,BadCabin      = mvc.Bad
        ,ObsCabin      = mvc.Obs 
    FROM  Mechanical.v_Cabin mvc  
    WHERE mvc.Id = @inspectionId
    AND mvc.[Status] IS NOT NULL
    
    ---- 
    SELECT PartBearing   = mvb.Part
        ,GoodBearing     = mvb.Good
        ,RegularBearing  = mvb.Regular
        ,BadBearing      = mvb.Bad
        ,ObsBearing      = mvb.Obs 
    FROM  Mechanical.v_Bearing mvb 
    WHERE mvb.Id = @inspectionId
    AND mvb.[Status] IS NOT NULL
    ---- Transmisión ---
    SELECT PartTransmission   = mvt.Part
        ,GoodTransmission     = mvt.Good
        ,RegularTransmission  = mvt.Regular
        ,BadTransmission      = mvt.Bad
        ,ObsTransmission      = mvt.Obs  
    FROM  Mechanical.v_Transmission mvt 
    WHERE mvt.Id = @inspectionId
    AND mvt.[Status] IS NOT NULL
    
    --- Luces ---
    SELECT PartLighting   = mvl.Part
        ,GoodLighting     = mvl.Good
        ,RegularLighting  = mvl.Regular
        ,BadLighting      = mvl.Bad
        ,ObsLighting      = mvl.Obs 
    FROM  Mechanical.v_Lighting mvl 
    WHERE mvl.Id = @inspectionId
    AND mvl.[Status] IS NOT NULL
    
    --- 
    SELECT PartBrake   = mvbr.Part
        ,GoodBrake     = mvbr.Good
        ,RegularBrake  = mvbr.Regular
        ,BadBrake      = mvbr.Bad
        ,ObsBrake      = mvbr.Obs 
    FROM  Mechanical.v_Brake mvbr 
    WHERE mvbr.Id = @inspectionId
    AND mvbr.[Status] IS NOT NULL
    
    SELECT PartSteering   = mvs.Part
        ,GoodSteering     = mvs.Good
        ,RegularSteering  = mvs.Regular
        ,BadSteering      = mvs.Bad
        ,ObsSteering      = mvs.Obs
    FROM  Mechanical.v_Steering mvs 
    WHERE mvs.Id = @inspectionId
    AND mvs.[Status] IS NOT NULL
    
    SELECT PartSuspension   = mvsu.Part
        ,GoodSuspension     = mvsu.Good
        ,RegularSuspension  = mvsu.Regular
        ,BadSuspension      = mvsu.Bad
        ,ObsSuspension      = mvsu.Obs
    FROM  Mechanical.v_Suspension mvsu 
    WHERE mvsu.Id = @inspectionId
    AND mvsu.[Status] IS NOT NULL
END