USE [Acontplus];
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE Ventas.CreditoGarante_Report 
     @userRoleId INT,
     @json VARCHAR(MAX),
     @tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    -- Global
    DECLARE @tipo INT, @idEntidad INT, @usuario VARCHAR(150), @idUsuario INT;

    -- Sql
    DECLARE @sql NVARCHAR(MAX), @params NVARCHAR(MAX);

    -- Filters
    DECLARE @idCuentaPorCobrar INT, @codEstab VARCHAR(100);

    -- Variables
    SELECT TOP 1 @idEntidad = idEntidad, @usuario = nombreUsuario 
    FROM v_usuario WITH (NOLOCK) 
    WHERE idUsuarioRol = @userRoleId;

    SELECT @tipo = tipo, @idCuentaPorCobrar = idCuentaPorCobrar, @codEstab = codEstab 
    FROM OPENJSON(@json) 
    WITH (
        tipo INT, 
        idCuentaPorCobrar INT, 
        codEstab VARCHAR(100)
    );

    IF @tipo = 1
    BEGIN
        SET @tableNames = 'headerDs,cuentaPorCobrarDs,creditoGaranteDs';

        -- Header Dataset
        SELECT 
            en.razonSocial,
            es.nombreComercial,
            en.ruc,
            es.telefono,
            es.dirEstablecimiento,
            @usuario AS usuario,
            'SOLICITUD CREDITO' AS nombreReporte,
            telEstab = es.telefono
        FROM Sri.Establecimiento es WITH (NOLOCK)
        INNER JOIN dbo.Entidad en WITH (NOLOCK) ON en.idEntidad = es.idEntidad
        WHERE es.codEstab = @codEstab;

        -- Cuenta por Cobrar Dataset
        SELECT
            vcc.razonSocialComprador
            ,vcc.identificacionComprador
            ,dirComprador = c.direccion
            ,telComprador = c.telefono
            ,correoComprador = c.correo
            ,ciudadComprador = c.ciudadNom
            ,c.conyugeNombre
            ,c.conyugeTel
            ,c.refFamNombre
            ,c.dirVivienda
            ,c.refDomicilio
            ,c.refFamTel
            ,c.estadoCivilNom
            ,c.tipoViviendaNom
            ,empresaNom = c.empresa
            ,identificacionEmpresa = cc.IDCard
            ,dirEmpresa = ae.direccion
            ,correoEmpresa = ae.correo
            ,telEmpresa = ae.telefono
        FROM dbo.v_CuentaPorCobrar vcc  
        INNER JOIN dbo.v_Cliente c WITH(NOLOCK)   ON c.idCliente = vcc.idCliente
        LEFT JOIN Administrador.Empresa ae WITH(NOLOCK) ON ae.idEmpresa = c.idEmpresa
        LEFT JOIN Customer.Customer cc WITH(NOLOCK) ON cc.Id = ae.CustomerId
        WHERE vcc.idCuentaPorCobrar = @idCuentaPorCobrar;

        SELECT 
             razonSocialGarante = c.BusinessName
            ,identificacionGarante = c.IDCard
            ,dirGarante = c.direccion
            ,telGarante = c.telefono
            ,correoGarante = c.correo
            ,ciudadGarante = c.ciudadNom
            ,c.conyugeNombre
            ,c.conyugeTel
            ,c.refFamNombre
            ,c.dirVivienda
            ,c.refDomicilio
            ,c.refFamTel
            ,c.estadoCivilNom
            ,c.tipoViviendaNom
            ,empresaNom = cc.BusinessName
            ,identificacionEmpresa = cc.IDCard
            ,dirEmpresa = ae.direccion
            ,correoEmpresa = ae.correo
            ,telEmpresa = ae.telefono
        FROM Ventas.CreditoGarante vcg
        INNER JOIN dbo.v_Cliente c WITH(NOLOCK)   ON c.idCliente = vcg.idCliente
        LEFT JOIN Administrador.Empresa ae WITH(NOLOCK) ON ae.idEmpresa = c.idEmpresa
        LEFT JOIN Customer.Customer cc WITH(NOLOCK) ON cc.Id = ae.CustomerId
        WHERE vcg.idCuentaPorCobrar = @idCuentaPorCobrar;
    END
END;
GO
