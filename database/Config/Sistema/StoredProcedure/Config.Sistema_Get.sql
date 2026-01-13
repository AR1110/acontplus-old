USE AcontPlus
go

-- =============================================
-- Author:		Ramirez Alexis.
-- Create date: 5/09/2023 11:57 AM
-- Description:	GET para traer la configuracion del sistema
-- =============================================

CREATE OR ALTER PROCEDURE Config.Sistema_Get @userRoleId INT ,@json VARCHAR(MAX) ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT, @codConfig VARCHAR(5) ,@tipo INT

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
	
	SELECT @codConfig = codConfig ,@tipo = tipo FROM OPENJSON(@json) WITH (codConfig VARCHAR(5) ,tipo INT)

    --> Config. Venta
	IF @codConfig = 'cv'
		BEGIN

            SET @tableNames = 'data,formasPagoSri'

            SELECT dt.idSistema
                  ,IIF(dt.idCliente  IS NULL,CAST(0 AS BIT),CAST(1 AS BIT)) as customerDefault
                  ,IIF(dt.idArticulo IS NULL,CAST(0 AS BIT),CAST(1 AS BIT)) as articleDefault
                  ,IIF(dt.cc         IS NULL,CAST(0 AS BIT),CAST(1 AS BIT)) as configCc
                  ,dt.cc
                  ,dt.printerAutomatic           
				  ,dt.payAutomatic
                  ,dt.searchCode
				  ,dt.multipleVendedor
                  ,dt.detailDuplicate
				  ,dt.configDeuda     
				  ,dt.tipoConfig 
				  ,dt.interes
                  ,dt.diasGracia
                  ,dt.idFormaPagoSri
                  ,dt.idArticulo
                  ,dt.idCliente 
				  ,cu.TradeName as nombreFiscal
                  ,cu.IDCard    as numeroIdentificacion
                  ,ar.descripcion
				  ,ar.codigo
            FROM Config.v_Sistema_Ventas dt WITH (NOLOCK)  
            LEFT JOIN dbo.Cliente        cl WITH (NOLOCK) ON cl.idCliente  = dt.idCliente
			LEFT JOIN dbo.Articulo       ar WITH (NOLOCK) ON ar.idArticulo = dt.idArticulo
            LEFT JOIN Customer.Customer  cu WITH (NOLOCK) ON cu.Id         = cl.CustomerId
            WHERE dt.idEntidad = @idEntidad

            SELECT idFormaPagoSri, descripcion, codigo FROM dbo.FormaPagoSri WHERE estado = 1

            RETURN 
		END 

    --> Config. Inventario
	IF @codConfig = 'CI'
		BEGIN

            SET @tableNames = 'data,metodosValoracion'

			SELECT dt.idMetodoValoracion
			      ,dt.idSistema                                             
				  ,dt.codMetodoValoracion                                 as codMetodoValoracion
			      ,IIF(dt.inventory = 'SI',CAST(1 AS BIT),CAST(0 AS BIT)) as llevaInventario
			FROM Config.v_Sistema_Inventario dt WITH (NOLOCK)
            WHERE dt.idEntidad = @idEntidad

			SELECT idMetodoValoracion , descripcion, codMetodoValoracion = codigo FROM Inventario.MetodoValoracion WITH (NOLOCK) WHERE estado = 1
			
            RETURN 
		END 
    
    --> Config. Decimales
	IF @codConfig = 'CD'
		BEGIN
            SET @tableNames = 'data'

			SELECT dt.*
			FROM Config.v_Sistema_Decimal dt
            WHERE dt.idEntidad = @idEntidad

            RETURN 
		END 
    
    --> Config. Notificaciones
	IF @codConfig = 'CS'
		BEGIN
            
            SET @tableNames = 'notificaciones'

            SELECT vs.estado
                  ,ns.descripcion as notificacion
                  ,vs.idSistema
                  ,ns.codigo 
                  ,vs.idNotificacionSistema
            FROM Config.v_Sistema_Notificacion    vs WITH (NOLOCK)
            INNER JOIN Config.NotificacionSistema ns WITH (NOLOCK) ON ns.idNotificacionSistema = vs.idNotificacionSistema
            WHERE idEntidad = @idEntidad

            RETURN 
		END

    --> Configuraciones de politicas
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'data'

            DECLARE @LicenseTypeId           INT
                   ,@message                 VARCHAR(500)
                   ,@PolicyType              INT
                   ,@startDate               DATETIME2
                   ,@endDate                 DATETIME2
                   ,@isActive                BIT
                   ,@codePolicy              VARCHAR(50)
                   ,@codeApp                 VARCHAR(50)
                   ,@PolicyValue             VARCHAR(100)
                   ,@countTransaccionCompany INT
                   ,@ruc                     VARCHAR(20)
                   ,@codeLicense             VARCHAR(20)

            SELECT @codePolicy = codePolicy ,@codeApp = codeApp FROM OPENJSON(@json) WITH (codePolicy VARCHAR(20) ,codeApp VARCHAR(20))


            --> Licencia por empreasa y sistema donde se consume su suscripcion
            SELECT @LicenseTypeId = t5.LicenseTypeId
                  ,@startDate     = t2.StartDate
                  ,@endDate       = t2.EndDate
                  ,@ruc           = t7.ruc
	        FROM AcontplusAdmin.Sales.SuscripcionDetalle     t1 WITH (NOLOCK)
	        INNER JOIN AcontplusAdmin.Sales.Suscripcion      t2 WITH (NOLOCK) ON t2.Id   = t1.SuscripcionId
	        INNER JOIN AcontplusAdmin.Config.LicenciaDetalle t3 WITH (NOLOCK) ON t3.Id   = t1.LicenciaDetalleId
	        INNER JOIN AcontplusAdmin.Config.Company	     t4 WITH (NOLOCK) ON t4.Id   = t2.CompanyId
	        INNER JOIN AcontplusAdmin.Config.Licencia        t5 WITH (NOLOCK) ON t5.Id   = t3.LicenciaId
            INNER JOIN AcontplusAdmin.Config.Aplicacion      t6 WITH (NOLOCK) ON t6.Id   = t3.AplicacionId
	        INNER JOIN Acontplus.dbo.Entidad                 t7 WITH (NOLOCK) ON t7.Uuid = t4.Uuid
	        WHERE t2.IsActive = 1
	          AND(t2.Paid IS NULL OR t2.Paid = 0)
	          AND t2.IsDeleted = CAST(0 AS BIT)
              AND t6.Code      = @codeApp
              AND t7.idEntidad = @idEntidad

            --> validaciones por licencia donde controlamos los valores 
            SELECT TOP 1 @message     = t2.Description
                        ,@PolicyValue = t1.PolicyValue
                        ,@codeLicense = t3.Code
            FROM AcontplusAdmin.Config.LicensePolicyConfiguration t1
            INNER JOIN AcontplusAdmin.Config.PolicyType           t2 ON t2.Id = t1.PolicyTypeId
            INNER JOIN AcontplusAdmin.Config.LicenseType          t3 ON t3.Id = t1.LicenseTypeId
            WHERE t1.LicenseTypeId = @LicenseTypeId
              AND t2.Code          = @codePolicy

            IF @codeLicense != 'D'
                BEGIN 
                    IF @ruc NOT IN ('1717631848001','2200123962001','2200123962001','1313319558001')
                        BEGIN
                            SET @PolicyValue = -1;
                        END
                END 

            --> restrinccion de registro de documento electronicos
            IF @codePolicy = 'MAX_DOCUMENTS'
                BEGIN
                    SELECT @countTransaccionCompany = COUNT(*)
                    FROM FactElect.v_DocElectronico
                    WHERE idEntidad = @idEntidad
                      AND fechaRegistro BETWEEN @startDate AND GETDATE()
                END

            --> control de registro de articulos
            IF @codePolicy = 'MAX_INVENTORY_ITEMS'
                BEGIN
                    SELECT @countTransaccionCompany = COUNT(*)
                    FROM dbo.Articulo
                    WHERE idEntidad = @idEntidad
                      AND fechaRegistro BETWEEN @startDate AND GETDATE()
                      AND estado = 1
                END 

            --> Para el control de registro de clientes
            IF @codePolicy = 'MAX_CUSTOMERS'
                BEGIN
                    SELECT @countTransaccionCompany = COUNT(*)
                    FROM dbo.Cliente
                    WHERE idEntidad = @idEntidad
                      AND fechaRegistro BETWEEN @startDate AND GETDATE()
                      AND estado = 1
                END 

            --> Control de registro de usuarios
            IF @codePolicy = 'MAX_USERS'
                BEGIN
                    SELECT @countTransaccionCompany = COUNT(*)
                    FROM dbo.Usuario          us
                    INNER JOIN App.UsuarioRol ur ON ur.idUsuario = us.idUsuario
                    WHERE ur.idEntidad = @idEntidad
                      AND ur.fechaRegistro BETWEEN @startDate AND GETDATE()
                      AND ur.estado = 1
                END

            --> Control de registro de bodegas
            IF @codePolicy = 'MAX_WAREHOUSES'
                BEGIN
                    SELECT @countTransaccionCompany = COUNT(*)
                    FROM dbo.Bodega                bo
                    INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = bo.idEstablecimiento
                    WHERE bo.estado = 1
                      AND bo.fechaRegistro BETWEEN @startDate AND GETDATE()
                      AND es.idEntidad = @idEntidad
                END

            --> Control de registro de establecimiento
            IF @codePolicy = 'MAX_ESTABLISHMENTS'
                BEGIN
                    SELECT @countTransaccionCompany = COUNT(*)
                    FROM Sri.Establecimiento
                    WHERE idEntidad = @idEntidad
                      AND estado = 1
                      AND fechaRegistro BETWEEN @startDate AND GETDATE()
                END 

            --> Validacion donde comprobamos si es menor a cero sera un premium caso contrario tiene restrincion
            --SELECT '0' as code, CAST(@countTransaccionCompany as varchar)  as 'message' WHERE @message IS NOT NULL
            --RETURN

            IF CAST(@PolicyValue AS INT) < 0
                BEGIN
                    SET @message = NULL
                END
            ELSE
                BEGIN
                    IF ISNULL(@countTransaccionCompany,0) < CAST(@PolicyValue AS INT)
                        SET @message = NULL
                END
             
            SELECT '0' as code, @message as 'message' WHERE @message IS NOT NULL
            RETURN 
        END
END
GO
