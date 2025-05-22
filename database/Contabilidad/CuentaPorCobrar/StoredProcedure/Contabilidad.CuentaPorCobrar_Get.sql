USE [Acontplus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.CuentaPorCobrar_Get
    @userRoleId INT
    ,
    @json VARCHAR(MAX)
    ,
    @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH

    --> Global
    DECLARE @idEntidad INT ,@tipo INT


    -->Filters
    DECLARE @idCliente INT ,@idCuentaPorCobrar INT

    --> Variables
    SELECT TOP 1
        @idEntidad = idEntidad
    FROM App.UsuarioRol WITH (NOLOCK)
    WHERE idUsuarioRol = @userRoleId

    --> Json
    SELECT @tipo = tipo
    FROM OPENJSON(@json) WITH (tipo INT )

    --> Get 
    IF @tipo = 1
        BEGIN
        --> Sql
        DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT


        --> Filter
        DECLARE @codEstab VARCHAR(50) 
                   ,@ckFecha BIT
                   ,@fechaInicio DATETIME2 
                   ,@fechaFin DATETIME2
                   ,@codDoc VARCHAR(10)
                   ,@codEstado VARCHAR(5)
                   ,@ckCxcVencida BIT
                   ,@convertToDoc BIT
                   ,@secuencial INT

        SET @tableNames = 'cuentasPorCobrar'

        SELECT @idCliente         = idCliente  
                  , @ckFecha           = ckFecha
                  , @fechaInicio       = fechaInicio
                  , @fechaFin          = fechaFin
                  , @codEstab          = codEstab
                  , @codEstado         = codEstado
                  , @codDoc            = codDoc
                  , @pageSize          = pageSize
				  , @pageIndex         = pageIndex
                  , @ckCxcVencida      = ckCxcVencida
                  , @convertToDoc      = convertToDoc
                  , @idCuentaPorCobrar = idCuentaPorCobrar 
                  , @secuencial        = secuencial
        FROM OPENJSON(@json) WITH 
            (
                idCliente         INT         
               ,ckFecha           BIT         
               ,fechaInicio       DATETIME2   
               ,fechaFin          DATETIME2   
               ,codEstab          VARCHAR(25) 
               ,codEstado         VARCHAR(15) 
               ,codDoc            VARCHAR(10)
               ,pageSize          INT
               ,pageIndex         INT
               ,ckCxcVencida      BIT
               ,convertToDoc      BIT
               ,idCuentaPorCobrar INT 
               ,secuencial        INT
            )

        SET @params = '@idCliente         INT
                          ,@idEntidad         INT
                          ,@codEstab          VARCHAR(25)
                          ,@fechaInicio       DATETIME2
                          ,@fechaFin          DATETIME2
                          ,@codEstado         VARCHAR(15)
                          ,@codDoc            VARCHAR(10)
                          ,@pageIndex         INT
                          ,@pageSize          INT
                          ,@convertToDoc      BIT
                          ,@idCuentaPorCobrar INT
                          ,@secuencial        INT '

        SET @sql = 'SELECT cc.idCuentaPorCobrar
                              ,cc.idCliente
                              ,cc.codEstab
                              ,IIF(cc.codDoc = ''01'',''FE'',cc.codDoc)                        as codDoc
                              ,cc.razonSocialComprador
                              ,cc.identificacionComprador
                              ,serieComprobante
                              ,FORMAT(cc.fechaEmision,''dd/MM/yyyy'')                          as fechaEmision
                              ,FORMAT(cc.fechaVencimiento,''dd/MM/yyyy'')                      as fechaVencimiento
                              ,CAST(importeTotal as numeric(18,2))                             as importeTotal
                              ,CAST(mora as numeric(18,2))                                     as mora
                              ,CAST(abono as numeric(18,2))                                    as abono
                              ,CAST(saldo as numeric(18,2))                                    as saldo
                              ,cc.diasMora
                              ,tipoTiempoCredito                                               as tiempoCredito
                              ,estado
                              ,COUNT(*)                                                 OVER() as totalRecords
                              ,SUM(IIF(cc.codEstado IN (''A'',''TRA''),0,importeTotal)) OVER() as totalVenta
                              ,SUM(IIF(cc.codEstado IN (''A'',''TRA''),0,mora))         OVER() as totalMora
                              ,SUM(IIF(cc.codEstado IN (''A'',''TRA''),0,abono))        OVER() as totalAbono
                              ,SUM(IIF(cc.codEstado IN (''A'',''TRA''),0,saldo))        OVER() as totalSaldo
                              ,codEstado
                              ,tiempoCredito                                                   as tipo
                        FROM v_CuentaPorCobrar cc WITH (NOLOCK)
                        WHERE idEntidad = @idEntidad '

        IF @codDoc IS NOT NULL
                BEGIN
            SET @sql = @sql + 'AND cc.codDoc = @codDoc '
        END
            ELSE 
                BEGIN
            SET @sql = @sql + 'AND cc.codDoc IN (''01'',''NE'')'
        END

        IF @codEstab IS NOT NULL 
                BEGIN
            SET @sql = @sql + 'AND cc.codEstab = @codEstab '
        END

        IF @ckFecha = 1
                BEGIN
            SET @sql = @sql + 'AND CAST(cc.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
        END

        IF @idCliente > 0 
                BEGIN
            SET @sql = @sql + 'AND cc.idCliente = @idCliente '
        END

        IF @codEstado IS NOT NULL
                BEGIN
            IF @codEstado = 'NCBR'
                        BEGIN
                SET @sql = @sql + 'AND cc.codEstado IN (''PE'',''PP'') '
            END 
                    ELSE
                        BEGIN
                SET @sql = @sql + 'AND cc.codEstado = @codEstado '
            END
        END

        IF @convertToDoc IN (1,0)
                BEGIN
            SET @sql = @sql + 'AND cc.convertToDoc = @convertToDoc '
        END

        IF @ckCxcVencida = 1
                BEGIN
            SET @sql = @sql + 'AND cc.idCuentaPorCobrar IN (
                                                                     SELECT cc.idCuentaPorCobrar 
                                                                     FROM Contabilidad.CuotaPorCobrar        cu WITH (NOLOCK)
                                                                     INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar = cu.idCuentaPorCobrar
                                                                     WHERE cc.idEntidad = @idEntidad 
                                                                       AND cu.estado = 1
                                                                       AND DATEDIFF(DAY,cu.fechaVencimiento,GETDATE()) > 0                             
                                                                   ) '
        END

        IF @idCuentaPorCobrar > 0 
                BEGIN
            SET @sql = @sql + 'AND cc.idCuentaPorCobrar = @idCuentaPorCobrar '
        END

        IF @secuencial > 0
                BEGIN
            SET @sql = @sql + 'AND cc.secuencial = @secuencial '
        END


        SET @sql = @sql + 'ORDER BY cc.fechaEmision ASC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

        EXEC sp_executesql @sql
						      ,@params 
                              ,@codEstab          = @codEstab
                              ,@idCliente         = @idCliente
                              ,@idEntidad         = @idEntidad
                              ,@fechaInicio       = @fechaInicio
                              ,@fechaFin          = @fechaFin
                              ,@codEstado         = @codEstado
                              ,@codDoc            = @codDoc
                              ,@pageIndex         = @pageIndex
                              ,@pageSize          = @pageSize
                              ,@convertToDoc      = @convertToDoc
                              ,@idCuentaPorCobrar = @idCuentaPorCobrar
                              ,@secuencial        = @secuencial

        RETURN
    END

    --> Cuotas
    IF @tipo = 2
		BEGIN

        SET @tableNames = 'cuentaPorCobrar,tiempoCredito,cuotas'

        SELECT @idCuentaPorCobrar = idCuentaPorCobrar
        FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT)

        SELECT TOP 1
            cu.IDCard       as numeroIdentificacion
						, cu.TradeName    as nombreFiscal
						, fechaEmision
                        , fechaVencimiento
						, serieComprobante = cc.serieComprobante 
						, importeTotal     = cc.importeTotal
						, cc.idTiempoCredito
						, codEstado        = ep.codigo 
						, config           = 0
						, tipoConfig       = 'NA'
						, interes          = 0
        FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
            INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente         = cc.idCliente
            INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision    = cc.idPuntoEmision
            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento
            INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago      = cc.idEstadoPago
            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
        WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar

        SELECT idTiempoCredito, descripcion, diasCredito, numeroCuota, tiempoCredito = tipo, entrada
        FROM dbo.TiempoCredito WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND estado = 1 AND gestion = 1

        SELECT cx.idCuotaPorCobrar
			      , cx.nroCuota
				  , cx.cuota
				  , cx.interes
				  , cx.diasMora
				  , cx.mora
				  , cx.abono
				  , saldoCta = CASE WHEN (cx.cuota - cx.abono) > 0 THEN cx.cuota - cx.abono ELSE 0 END 
				  , cx.saldo
				  , fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				  , estado = ep.descripcion
				  , codEstado = ep.codigo
        FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
            INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
        WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar
            AND cx.estado = 1
        ORDER BY cx.nroCuota ASC

        RETURN
    END

    --> Garantes 
    IF @tipo = 3
        BEGIN
        SELECT @idCuentaPorCobrar = idCuentaPorCobrar
        FROM OPENJSON(@json) WITH(idCuentaPorCobrar INT)

        SET @tableNames='guarantors'

        SELECT cg.idCreditoGarante
				  , cg.idCuentaPorCobrar
				  , cl.idCliente
				  , cu.BusinessName as razonSocialComprador
				  , cu.TradeName    as nombreComercial
				  , cu.IDCard       as identificacionComprador
				  , cl.direccion
				  , cl.correo
				  , cl.telefono
                  , tipoAccion = 'U'
        FROM Ventas.CreditoGarante   cg WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente  = cg.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id         = cl.CustomerId
        WHERE cg.estado = 1
            AND cg.idCuentaPorCobrar = @idCuentaPorCobrar

        RETURN
    END

    --> Notificacion para deudas del cliente 
    IF @tipo = 5
        BEGIN

        SET @tableNames = 'deuda'

        SELECT @idCliente = idCliente
        FROM OPENJSON(@json) WITH (idCliente INT)

        SELECT CAST(count(*) AS varchar) + '  '  + IIF(codDoc = '01','Facturas','Notas de Entrega') as documento 
                  , SUM(importeTotal)                                                                    as importeTotal
                  , SUM(abono)                                                                           as abono
                  , SUM(saldo)                                                                           as saldo
        FROM v_CuentaPorCobrar WITH (NOLOCK)
        WHERE idCliente = @idCliente
            AND codEstado IN ('PP','PE')
            AND codDoc IN ('01','NE')
            AND convertToDoc = 0
        GROUP BY codDoc

        RETURN
    END

    --> Filter 
    IF @tipo = 6
        BEGIN
        SET @tableNames = 'establecimientos,estadoPago,tipoDocumento,empresas,ciudades,users'

        SELECT idEstablecimiento
                  , nombreComercial
                  , codEstab
                  , idPuntoEmision
                  , ptoEmi + '-' + estab as ptoEmi
                  , defaultEstab
                  , defaultPtoEmi 
                  , correo
        FROM v_PtoEmi_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idEstadoPago, descripcion, codigo
        FROM dbo.EstadoPago WITH (NOLOCK)
        WHERE codigo IN ('A','NCBR','CBR')

        SELECT idTipoDocumento, descripcion, codigoSri, codigo
        FROM dbo.TipoDocumento WITH (NOLOCK)
        WHERE codigo IN ('FV','NE')

        SELECT en.idEmpresa
                  , cu.BusinessName as nombreComercial
        FROM Administrador.Empresa   en WITH (NOLOCK)
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id = en.CustomerId
        WHERE en.idEntidad = @idEntidad
            AND en.estado = 1

        SELECT ci.idCiudad
                  , ci.descripcion as ciudad
                  , ci.codigo
                  , ci.estado
                  , ci.idProvincia
                  , pr.descripcion as provincia
        FROM dbo.Ciudad          ci WITH (NOLOCK)
            INNER JOIN dbo.Provincia pr WITH (NOLOCK) ON pr.idProvincia = ci.idProvincia
        WHERE ci.estado = 1

        SELECT
            idUsuario
                , nombreCompleto
                , nombreUsuario
        FROM v_usuario
        WHERE idEntidad = @idEntidad AND estadoUsuario=1

        RETURN
    END

    --> Reporte Filter 
    IF @tipo = 7
        BEGIN

        SET @tableNames = 'establecimientos,estadoPago,tipoDocumento'

        SELECT idEstablecimiento
                  , nombreComercial
                  , codEstab
                  , idPuntoEmision
                  , ptoEmi + '-' + estab as ptoEmi
                  , defaultEstab
                  , defaultPtoEmi
        FROM v_PtoEmi_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idEstadoPago, descripcion, codigo
        FROM dbo.EstadoPago WITH (NOLOCK)
        WHERE codigo IN ('A','NCBR','CBR')

        SELECT idTipoDocumento, descripcion, codigoSri, codigo
        FROM dbo.TipoDocumento WITH (NOLOCK)
        WHERE codigo IN ('FV','NE')

        -- DAY
        SELECT td.descripcion as doc
                  , (
			            SELECT COUNT(*)
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.idEntidad = @idEntidad
                AND cc.codEstado NOT IN ('TRA','A')
                AND cc.codDoc = IIF(td.codigo = 'FV','01','NE')
                AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE())
                AND DATEPART(DAY,cc.fechaEmision) = DATEPART(DAY,GETDATE())
              
	               ) as totalDoc
                  , ISNULL((
			            SELECT SUM(cc.importeTotal)
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.idEntidad = @idEntidad
                AND cc.codEstado NOT IN ('TRA','A')
                AND cc.codDoc = IIF(td.codigo = 'FV','01','NE')
                AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE())
                AND DATEPART(DAY,cc.fechaEmision) = DATEPART(DAY,GETDATE()) 
              
	               ),0) as total
        FROM dbo.TipoDocumento td WITH (NOLOCK)
        WHERE td.codigo IN ('NE','FV')

        -- WEEK
        SELECT dd.descripcion as [day]
	              , (
			            SELECT COUNT(*)
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.idEntidad = @idEntidad
                AND cc.codEstado NOT IN ('TRA','A')
                AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE())
                AND DATEPART(WEEK,fechaEmision) = DATEPART(WEEK,GETDATE())
                AND DATEPART(WEEKDAY,cc.fechaEmision) = dd.diaSemana
              
	               ) as totalDoc
                  , ISNULL((
			            SELECT SUM(cc.importeTotal)
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.idEntidad = @idEntidad
                AND cc.codEstado NOT IN ('TRA','A')
                AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE())
                AND DATEPART(WEEK,fechaEmision) = DATEPART(WEEK,GETDATE())
                AND DATEPART(WEEKDAY,cc.fechaEmision) = dd.diaSemana
              
	               ),0) as total
        FROM dbo.Dia dd WITH (NOLOCK)
        ORDER BY dd.diaSemana ASC

        -- MONTH
        SELECT cm.[Description] as [Month]
	              , (
			            SELECT COUNT(*)
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.idEntidad = @idEntidad
                AND cc.codEstado NOT IN ('TRA','A')
                AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE())
                AND DATEPART(MONTH,cc.fechaEmision) = cm.Code
              
	               ) as totalDoc
                  , ISNULL((
			            SELECT SUM(cc.importeTotal)
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.idEntidad = @idEntidad
                AND cc.codEstado NOT IN ('TRA','A')
                AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE())
                AND DATEPART(MONTH,cc.fechaEmision) = cm.Code 
              
	              ),0) as total
        FROM Catalogo.[Month] cm WITH (NOLOCK)
        ORDER BY cm.Code ASC

        RETURN
    END
END
GO
