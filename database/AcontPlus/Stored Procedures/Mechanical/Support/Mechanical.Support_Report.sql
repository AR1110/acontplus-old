USE AcontPlus
GO
--- Mechanical.Support_Report 139, '{"supportId": 1 }'
CREATE OR ALTER PROC Mechanical.Support_Report
@idUsuarioRol INT
,@json      VARCHAR(300)
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    DECLARE @supportId   INT
    DECLARE @codEstab VARCHAR(100)

    SELECT @supportId =  supportId
    FROM OPENJSON(@json)
    WITH( supportId INT '$.supportId')
        
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
    
    SELECT licensePlate     = ms.LicensePlate
           ,brand           = ms.Brand
           ,tradeName       = ms.TradeName
           ,businessName    = ms.BusinessName
           ,VehiclePartType = ms.VehicleType
           ,[Sequence]      = ms.[Sequence]  
           ,Obs             = ms.Obs
           ,[Date]          = FORMAT(ms.[Date], 'MM/dd/yyyy')
    FROM Mechanical.v_Support ms
    WHERE ms.Id = @supportId
END