USE AcontPlus
GO
--- Mechanical.Support_Report 139, '{"supportId": 4 }'
CREATE OR ALTER PROC Mechanical.Support_Report
@idUsuarioRol INT
,@json      VARCHAR(300)
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    DECLARE @supportId   INT
    DECLARE @codEstab VARCHAR(100)
    DECLARE @customerId INT
    DECLARE @VehicleCompranyId INT

    SELECT @supportId =  supportId
    FROM OPENJSON(@json)
    WITH( supportId INT '$.supportId')
        
    SELECT TOP 1 @codEstab = codEstab FROM v_Estab_Asign WHERE idUsuarioRol = @idUsuarioRol

     SELECT TOP 1 @CustomerId = CustomerId
                , @VehicleCompranyId = VehicleCompanyId 
     FROM Mechanical.v_Support WITH (NOLOCK) 
     WHERE Id = @supportId

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

    SELECT [date]           = FORMAT([Date], 'MM/dd/yyyy')
            ,userRecived    = us.nombreCompleto
            ,userAssigned   = s.NameAssigned
            ,sequence       = [Common].[ufnGetSerieDocument](s.estab,s.ptoEmi,[Sequence],0)
            ,obs            = s.Obs
    FROM Mechanical.v_Support s WITH (NOLOCK)
    INNER JOIN v_usuario us ON us.idUsuario = s.UserId
    WHERE Id = @supportId
    
    SELECT idCard           = IDCard 
            ,businessName   = BusinessName
            ,tradeName      = TradeName
            ,email          = Email
            ,telephone      = Telephone
            ,[address]      = [Address]
    FROM v_Cliente WITH (NOLOCK)
    WHERE idCliente = @CustomerId


    SELECT licensePlate = LicensePlate
            ,brand      = Brand
            ,model      = Model
            ,[year]     = [Year]
            ,color      = Color
            ,engine     = Engine
            ,chassis    = Chassis
            ,cylindraje = Cylindraje
    FROM Mechanical.v_Vehicle WITH (NOLOCK) 
    WHERE Id = @VehicleCompranyId
END
