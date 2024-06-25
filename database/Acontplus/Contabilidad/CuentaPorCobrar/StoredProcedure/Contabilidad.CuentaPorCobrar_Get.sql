USE [Acontplus]
go 
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.CuentaPorCobrar_Get 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH 

    --> Global
    DECLARE @idEntidad INT ,@tipo INT 

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    -->Filters
    DECLARE @idCliente INT 
           ,@codEstab VARCHAR(50) 
           ,@idCuentaPorCobrar INT 
           ,@ckFecha BIT 
           ,@fechaInicio DATETIME2 
           ,@fechaFin DATETIME2 
           ,@codDoc VARCHAR(10) 
           ,@codEstado VARCHAR(5)
           ,@ckCxcVencida BIT 
           ,@convertToDoc BIT
           ,@tipoConfig VARCHAR(20)
           ,@interes NUMERIC(18,5) 
           ,@configDeuda BIT  

    --> Variables
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )
	
    --> Get 
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'cuentasPorCobrar'

            SELECT @idCliente    = idCliente  
                  ,@ckFecha      = ckFecha
                  ,@fechaInicio  = fechaInicio
                  ,@fechaFin     = fechaFin
                  ,@codEstab     = codEstab
                  ,@codEstado    = codEstado
                  ,@codDoc       = codDoc
                  ,@pageSize     = pageSize
				  ,@pageIndex    = pageIndex
                  ,@ckCxcVencida = ckCxcVencida
                  ,@convertToDoc = convertToDoc
                  ,@idCuentaPorCobrar = idCuentaPorCobrar 
            FROM OPENJSON(@json) WITH 
            (
                idCliente    INT         
               ,ckFecha      BIT         
               ,fechaInicio  DATETIME2   
               ,fechaFin     DATETIME2   
               ,codEstab     VARCHAR(25) 
               ,codEstado    VARCHAR(15) 
               ,codDoc       VARCHAR(10)
               ,pageSize     INT
               ,pageIndex    INT
               ,ckCxcVencida BIT
               ,convertToDoc BIT
               ,idCuentaPorCobrar INT 
            )

            SET @params = '@idCliente    INT
                          ,@idEntidad    INT
                          ,@codEstab     VARCHAR(25)
                          ,@fechaInicio  DATETIME2
                          ,@fechaFin     DATETIME2
                          ,@codEstado    VARCHAR(15)
                          ,@codDoc       VARCHAR(10)
                          ,@pageIndex    INT
                          ,@pageSize     INT
                          ,@convertToDoc BIT
                          ,@idCuentaPorCobrar INT '

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
                              ,CAST(abono as numeric(18,2))                                    as abono
                              ,CAST(saldo as numeric(18,2))                                    as saldo
                              ,cc.diasMora
                              ,cc.mora
                              ,tipoTiempoCredito                                               as tiempoCredito
                              ,estado
                              ,COUNT(*)                                                 OVER() as totalRecords
                              ,SUM(IIF(cc.codEstado IN (''A'',''TRA''),0,importeTotal)) OVER() as totalVenta
                              ,SUM(IIF(cc.codEstado IN (''A'',''TRA''),0,abono))        OVER() as totalAbono
                              ,SUM(IIF(cc.codEstado IN (''A'',''TRA''),0,saldo))        OVER() as totalSaldo
                              ,codEstado
                        FROM v_CuentaPorCobrar cc WITH (NOLOCK)
                        WHERE idEntidad = @idEntidad '

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND cc.codDoc = @codDoc '
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

            IF @idCuentaPorCobrar IS NOT NULL
                SET @sql = @sql + 'AND cc.idCuentaPorCobrar = @idCuentaPorCobrar '
            

            SET @sql = @sql + 'ORDER BY cc.fechaEmision ASC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
						      ,@params 
                              ,@codEstab     = @codEstab
                              ,@idCliente    = @idCliente
                              ,@idEntidad    = @idEntidad
                              ,@fechaInicio  = @fechaInicio
                              ,@fechaFin     = @fechaFin
                              ,@codEstado    = @codEstado
                              ,@codDoc       = @codDoc
                              ,@pageIndex    = @pageIndex
                              ,@pageSize     = @pageSize
                              ,@convertToDoc = @convertToDoc
                              ,@idCuentaPorCobrar = @idCuentaPorCobrar

            RETURN 
        END 

	--> Cuotas
	IF @tipo = 2
		BEGIN
			
            SET @tableNames = 'cuentaPorCobrar,tiempoCredito,cuotas'

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT)

		    SELECT TOP 1 cl.numeroIdentificacion
						,cl.nombreFiscal
						,fechaEmision
                        ,fechaVencimiento
						,serieComprobante = cc.serieComprobante 
						,importeTotal     = cc.importeTotal
						,cc.idTiempoCredito
						,codEstado        = ep.codigo 
						,config           = 0
						,tipoConfig       = 'NA'
						,interes          = 0
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
			INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente      = cc.idCliente 
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
			INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago   = cc.idEstadoPago
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar
			
			SELECT idTiempoCredito,descripcion,diasCredito,numeroCuota,tiempoCredito = tipo FROM dbo.TiempoCredito WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 AND gestion = 1

			SELECT cx.idCuotaPorCobrar
			      ,cx.nroCuota
				  ,cx.cuota
				  ,cx.interes
				  ,cx.diasMora
				  ,cx.mora
				  ,cx.abono
				  ,saldoCta = CASE WHEN (cx.cuota - cx.abono) > 0 THEN cx.cuota - cx.abono ELSE 0 END 
				  ,cx.saldo
				  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'MM/dd/yyyy')
				  ,estado = ep.descripcion
				  ,codEstado = ep.codigo
			FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
			INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
			WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar 
              AND cx.estado = 1
			ORDER BY cx.nroCuota ASC

            RETURN 
		END
	
	--> Datos para cobros por Documento
	IF @tipo = 3
		BEGIN
            
            SET @tableNames = 'entidadFinanciera,subEntidadFinanciera,banco,provincia,documentos,cuentaPorCobrar'

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT)

            SELECT TOP 1 @idCliente = idCliente FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar
			
			SELECT idEntidadFinanciera,descripcion,detalle,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

			SELECT idEntidadFinanciera,idSubEntidadFinanciera,descripcion,codigo,interes,controlCaja FROM dbo.SubEntidadFinanciera WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 

			SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1

			SELECT cd.idCiudad,provincia = pr.descripcion ,cd.descripcion,pr.codigo FROM dbo.Provincia pr WITH (NOLOCK) INNER JOIN dbo.Ciudad cd WITH (NOLOCK) ON cd.idProvincia = pr.idProvincia WHERE cd.estado = 1

			SELECT cc.idCuentaPorCobrar                 as idDocumento
                  ,0                                    as idTipoDocumento 
	              ,cc.serieComprobante
	              ,cc.importeTotal		                as saldo
	              ,CASE cc.codDoc WHEN '04' THEN 'Nota de Crédito'
                                  WHEN '07' THEN 'Comprobante de Retención'
                                  WHEN 'A'  THEN 'Anticipo'
	               END				                    as codDoc 
	              ,FORMAT(cc.fechaEmision,'MM/dd/yyyy') as fechaEmision
            FROM v_CuentaPorCobrar cc WITH (NOLOCK)
            WHERE cc.codDoc IN ('A','04','07')
              AND cc.idCliente = @idCliente
              AND cc.codEstado = 'PE'
            
            SELECT cc.idCuentaPorCobrar
				  ,cc.idCliente
                  ,pt.codEstab
                  ,cl.nombreFiscal         as razonSocialComprador
                  ,cl.numeroIdentificacion as identificacionComprador
                  ,cc.serieComprobante 
				  ,cc.codDoc
				  ,fechaEmision
				  ,fechaVencimiento
				  ,cc.importeTotal
				  ,cc.diasMora
				  ,cc.mora
				  ,cc.abono
				  ,cc.saldo
                  ,cc.importeTotal - cc.abono as saldoDoc
				  ,ep.descripcion
				  ,cuotas = (
						      SELECT cx.idCuotaPorCobrar
								    ,cx.idCuentaPorCobrar
								    ,cx.nroCuota
								    ,cx.cuota
								    ,cx.interes
								    ,cx.mora
								    ,cx.diasMora
								    ,cx.abono
								    ,cx.cuota - cx.abono as saldoCta
								    ,cx.saldo
								    ,estado = ep.descripcion
						       FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
							   INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
						       WHERE cx.idCuentaPorCobrar = cc.idCuentaPorCobrar 
							     AND cx.estado = 1 
							     AND ep.codigo IN ('PE','PP')
							   ORDER BY cx.nroCuota ASC
							   FOR JSON PATH
							)
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) 
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
			INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago   = cc.idEstadoPago
            INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente      = cc.idCliente
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar 
              AND ep.codigo IN ('PP','PE')

			RETURN 
		END
	
    --> Notificacion para deudas del cliente 
    IF @tipo = 5
        BEGIN
            
            SET @tableNames = 'deuda'

            SELECT @idCliente = idCliente FROM OPENJSON(@json) WITH (idCliente INT)

            SELECT CAST(count(*) AS varchar) + '  '  + IIF(codDoc = '01','Facturas','Notas de Entrega') as documento 
                  ,SUM(importeTotal)                                                                    as importeTotal
                  ,SUM(abono)                                                                           as abono
                  ,SUM(saldo)                                                                           as saldo
            FROM v_CuentaPorCobrar WITH (NOLOCK) 
            WHERE idCliente = @idCliente
              AND codEstado IN ('PP','PE')
            GROUP BY codDoc
            RETURN 
        END 

    --> Filter 
    IF @tipo = 6
        BEGIN
            SET @tableNames = 'establecimientos,estadoPago,tipoDocumento,empresas'

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idEstadoPago,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('A','NCBR','CBR')

            SELECT idTipoDocumento,descripcion,codigoSri,codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo IN ('FV','NE')

            SELECT * FROM Administrador.Empresa WHERE idEntidad = @idEntidad
            RETURN 
        END

    --> Reporte Filter 
    IF @tipo = 7
        BEGIN
            
            SET @tableNames = 'establecimientos,estadoPago,tipoDocumento'

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idEstadoPago,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('A','NCBR','CBR')

            SELECT idTipoDocumento,descripcion,codigoSri,codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo IN ('FV','NE')

            -- DAY
            SELECT td.descripcion as doc
                  ,(
			            SELECT COUNT(*)  
                        FROM v_CuentaPorCobrar cc WITH (NOLOCK) 
                        WHERE cc.idEntidad = @idEntidad
                          AND cc.codEstado NOT IN ('TRA','A') 
			              AND cc.codDoc = IIF(td.codigo = 'FV','01','NE')
                          AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE()) 
                          AND DATEPART(DAY,cc.fechaEmision) = DATEPART(DAY,GETDATE())
              
	               ) as totalDoc
                  ,ISNULL((
			            SELECT SUM(cc.importeTotal)  
                        FROM v_CuentaPorCobrar cc WITH (NOLOCK) 
                        WHERE cc.idEntidad = @idEntidad
                          AND cc.codEstado NOT IN ('TRA','A') 
			              AND cc.codDoc = IIF(td.codigo = 'FV','01','NE')
			              AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE()) 
                          AND DATEPART(DAY,cc.fechaEmision) = DATEPART(DAY,GETDATE()) 
              
	               ),0) as total
            FROM dbo.TipoDocumento td WITH (NOLOCK) WHERE td.codigo IN ('NE','FV')

            -- WEEK
            SELECT dd.descripcion as [day]
	              ,(
			            SELECT COUNT(*)  
                        FROM v_CuentaPorCobrar cc WITH (NOLOCK) 
                        WHERE cc.idEntidad = @idEntidad
                          AND cc.codEstado NOT IN ('TRA','A') 
                          AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE()) 
                          AND DATEPART(WEEK,fechaEmision) = DATEPART(WEEK,GETDATE()) 
			              AND DATEPART(WEEKDAY,cc.fechaEmision) = dd.diaSemana
              
	               ) as totalDoc
                  ,ISNULL((
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
	              ,(
			            SELECT COUNT(*)  
                        FROM v_CuentaPorCobrar cc WITH (NOLOCK) 
                        WHERE cc.idEntidad = @idEntidad
                           AND cc.codEstado NOT IN ('TRA','A') 
                           AND DATEPART(YEAR,fechaEmision) = DATEPART(YEAR,GETDATE()) 
                           AND DATEPART(MONTH,cc.fechaEmision) = cm.Code
              
	               ) as totalDoc
                  ,ISNULL((
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
    
    --> Cuotas para realizar los cobros por lotes
    IF @tipo = 8
        BEGIN
            SET @tableNames = 'cuotas'

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar  FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT )

            IF EXISTS (SELECT 1 FROM Config.v_Sistema_Ventas WITH (NOLOCK) WHERE idEntidad = @idEntidad AND configDeuda = 1)
                BEGIN
                    
                    IF EXISTS (SELECT 1 FROM contabilidad.CuentaPorCobrar cc WITH (NOLOCK) 
                                        INNER JOIN dbo.TiempoCredito      tc WITH (NOLOCK) ON tc.idTiempoCredito = cc.idTiempoCredito
                               WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar
                                 AND tc.gestion = 1 
                                 AND tc.tipo = 0 )
                        BEGIN
                            IF EXISTS (SELECT 1 FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
			                                    INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
			                                    WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar
			                                      AND cx.estado = 1 
			                                      AND DATEDIFF(DAY,cx.fechaVencimiento,GETDATE()) > 0
                                                  AND ep.codigo IN ('PE','PP') 
                                      )
                                BEGIN
                                     SELECT TOP 1 @tipoConfig = tipoConfig, @interes = interes ,@configDeuda = configDeuda FROM Config.v_Sistema_Ventas WITH (NOLOCK) WHERE idEntidad = @idEntidad 
                                END 
                        END
                END 

            --> Configuracion de mora Valor Fijo (PF) o Porcentaje de Interes (PI)
            IF @configDeuda = 1
                BEGIN
                    SELECT dt.idCuotaPorCobrar
                          ,dt.idCuentaPorCobrar
                          ,dt.fechaVencimiento
                          ,dt.nroCuota
                          ,dt.cuota
                          ,IIF(dt.diasMora > 0 ,dt.diasMora,0)                         as diasMora
                          ,IIF(dt.diasMora > 0 ,dt.interes,0)                          as interes
                          ,IIF(dt.diasMora > 0 ,dt.interes * dt.diasMora,0)            as mora
                          ,dt.abono
                          ,dt.cuota - dt.abono                                         as saldoCta
                          ,dt.saldo + IIF(dt.diasMora > 0 ,dt.interes * dt.diasMora,0) as saldo
                          ,dt.estado
                    FROM 
                    (
                    
                            SELECT cx.idCuotaPorCobrar
				                  ,cx.idCuentaPorCobrar
				                  ,cx.fechaVencimiento
                                  ,cx.nroCuota
				                  ,cx.cuota
				                  ,cx.mora
				                  ,CASE @tipoConfig WHEN 'PI' THEN CAST((cx.saldo * @interes) / 100 as numeric(18,5))
                                                              ELSE 0
                                   END                 as interes
                                  ,CASE @tipoConfig WHEN 'PI' THEN DATEDIFF(DAY,cx.fechaVencimiento,GETDATE())
                                                              ELSE 0
                                   END                 as diasMora
				                  ,cx.abono
				                  ,cx.cuota - cx.abono as saldoCta
				                  ,cx.saldo
				                  ,ep.descripcion      as estado
			                FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
			                INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
			                WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar
			                  AND cx.estado = 1 
			                  AND ep.codigo IN ('PE','PP')

                    ) as dt
                    ORDER BY dt.nroCuota ASC
                END 

            --> Cobros Comunes
            ELSE 
                BEGIN
                    SELECT cx.idCuotaPorCobrar
						  ,cx.idCuentaPorCobrar
						  ,cx.nroCuota
						  ,cx.cuota
						  ,cx.interes
						  ,cx.mora
						  ,cx.diasMora
						  ,cx.abono
						  ,cx.cuota - cx.abono as saldoCta
						  ,cx.saldo
						  ,ep.descripcion      as estado
					FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
					INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
					WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar 
					  AND cx.estado = 1 
					  AND ep.codigo IN ('PE','PP')
					ORDER BY cx.nroCuota ASC
                END 

            RETURN 
        END 

END
GO
