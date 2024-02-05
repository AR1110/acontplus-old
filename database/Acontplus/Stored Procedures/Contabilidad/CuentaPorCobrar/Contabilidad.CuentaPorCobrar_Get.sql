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
    DECLARE @idCliente INT ,@codEstab VARCHAR(50) ,@idCuentaPorCobrar INT ,@ckFecha BIT ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2 ,@codDoc VARCHAR(10) ,@codEstado VARCHAR(5)
	       ,@numeroIdentificacion VARCHAR(15) ,@identificacionReceptor VARCHAR(50)

	-- ==== PARAMETER CONFIG ==========
	DECLARE @configInteres AS BIT
	DECLARE @tipoConfig AS VARCHAR(5)
	DECLARE @interes AS NUMERIC(18,5)
		
	DECLARE @tbCuotasInteres AS TABLE
	(
		 idCuotaPorCobrar INT UNIQUE NOT NULL
		,nroCuota INT NOT NULL
		,cuota NUMERIC(15,5) NOT NULL
		,abono NUMERIC(15,5) NOT NULL
		,interes NUMERIC(15,5) NOT NULL
		,mora NUMERIC(15,5) NOT NULL
		,fechaVencimiento DATE NOT NULL
		,diasMora INT NOT NULL
		,estado VARCHAR(150) NOT NULL
		,codEstado VARCHAR(5) NOT NULL
	)

	DECLARE @cobroDocuments AS TABLE
	(
		 idComprobante INT 
		,codDoc VARCHAR(5)
		,codMov VARCHAR(5)
	)

	DECLARE @documents AS TABLE
	(
		idDocumento BIGINT
		,idTipoDocumento BIGINT
		,serieComprobante VARCHAR(25)
		,saldo DECIMAL(15,5)
		,codDoc VARCHAR(100)
		,nroDoc VARCHAR(20)
		,fechaEmision DATETIME 
	)

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )
	
    --> Get 
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'cuentasPorCobrar'

            SELECT @idCliente   = idCliente  
                  ,@ckFecha     = ckFecha
                  ,@fechaInicio = fechaInicio
                  ,@fechaFin    = fechaFin
                  ,@codEstab    = codEstab
                  ,@codEstado   = codEstado
                  ,@codDoc      = codDoc
                  ,@pageSize    = pageSize
				  ,@pageIndex   = pageIndex
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
            )

            SET @params = '@idCliente   INT
                          ,@idEntidad   INT
                          ,@codEstab    VARCHAR(25)
                          ,@fechaInicio DATETIME
                          ,@fechaFin    DATETIME
                          ,@codEstado   VARCHAR(15)
                          ,@codDoc      VARCHAR(10)
                          ,@pageIndex   INT
                          ,@pageSize    INT'

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

            SET @sql = @sql + 'ORDER BY cc.idCuentaPorCobrar DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
						      ,@params 
                              ,@codEstab    = @codEstab
                              ,@idCliente   = @idCliente
                              ,@idEntidad   = @idEntidad
                              ,@fechaInicio = @fechaInicio
                              ,@fechaFin    = @fechaFin
                              ,@codEstado   = @codEstado
                              ,@codDoc      = @codDoc
                              ,@pageIndex   = @pageIndex
                              ,@pageSize    = @pageSize

            RETURN 
        END 

	--> Cuotas
	IF @tipo = 2
		BEGIN
			
            SET @tableNames = 'cuentaPorCobrar,tiempoCredito,cuotas'

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT)

		    SELECT TOP 1 cl.numeroIdentificacion
						,cl.nombreFiscal
						,fechaEmision     = FORMAT(cc.fechaEmision,'dd/MM/yyyy')
						,serieComprobante = cc.serieComprobante 
						,importeTotal     = cc.importeTotal
						,cc.idTiempoCredito
						,codEstado        = ep.codigo 
						,config           = ISNULL(@configInteres,0)
						,tipoConfig       = ISNULL(@tipoConfig,'NA')
						,interes          = ISNULL(@interes,0)
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
			WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar AND cx.estado = 1
			ORDER BY cx.nroCuota ASC
            RETURN 
		END 
	
	--> Datos para cobros por Documento
	IF @tipo = 3
		BEGIN
            
            SET @tableNames = 'entidadFinanciera,subEntidadFinanciera,banco,provincia,documentos,cuentaPorCobrar'

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT)

            SELECT TOP 1 @identificacionReceptor = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

            SELECT TOP 1 @idCliente = idCliente, @numeroIdentificacion = identificacionComprador FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar
			
			INSERT INTO @cobroDocuments (idComprobante,codDoc,codMov)
			SELECT co.idComprobante,td.codigoSri,td.codigo 
			FROM dbo.Cobro                    co WITH (NOLOCK)
			INNER JOIN dbo.TipoDocumento      td WITH (NOLOCK) ON td.idTipoDocumento      = co.idTipoDocumento
			INNER JOIN dbo.EntidadFinanciera  ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
			INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
			WHERE ef.codigo = 'DOC' 
			  AND ci.estado = 1
			  AND ci.idEntidad = @idEntidad

			INSERT INTO @documents (idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc, fechaEmision)
			SELECT 
			     d.idDocRelacionado
				,(SELECT TOP 1 td.idTipoDocumento FROM dbo.TipoDocumento td WITH (NOLOCK) WHERE td.codigoSri = '07') as idTipoDocumento
				,dr.serieComprobante
				,ISNULL
                ((
                    SELECT SUM(di.TaxValue) FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) WHERE di.DocumentoRecibidoId = dr.idDocumento
                ),0) as saldo 
				,'Retención Version:' + dr.versionComp as codDoc
				,''
				,GETDATE()
			FROM factelect.DocRelacionado           d WITH (NOLOCK)
			INNER JOIN Recepcion.DocumentoRecibido dr WITH (NOLOCK) ON dr.idDocumento = d.idDocumentoRecibido
			WHERE dr.codDoc = '07' 
				AND dr.identificacionReceptor = @identificacionReceptor 
				AND dr.rucEmisor = @numeroIdentificacion 
				AND d.estado = 'PE'
				AND d.idDocRelacionado NOT IN (SELECT c.idComprobante FROM @cobroDocuments c WHERE c.codDoc = '07')

			INSERT INTO @documents (idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc, fechaEmision)
			SELECT 
			     de.idDocumentoElectronico
				,idTipoDocumento  = (SELECT TOP 1 td.idTipoDocumento FROM dbo.TipoDocumento td WITH (NOLOCK) WHERE td.codigoSri = '04')
				,serieComprobante = de.numEstab+'-'+de.ptoEmision+'-'+Helper.F_Auto_Sequential(de.nroDocumento)
				,saldo            = (SELECT TOP 1 nc.total FROM dbo.NotaCredito nc WITH (NOLOCK) WHERE nc.idNotaCredito = de.idDocumento)
				,codDoc           = 'Nota de Crédito Version: '+de.versionComp
				,nroDoc           = ''
				,de.fechaEmision
			FROM dbo.DocumentoElectronico de WITH (NOLOCK)
			WHERE de.codDoc = '04'
				AND de.codEstado = 4
				AND de.idEntidad = @idEntidad
				AND de.idContribuyente = @idCliente
				AND de.idDocumentoElectronico NOT IN (SELECT c.idComprobante FROM @cobroDocuments c WHERE c.codDoc = '04')

			INSERT INTO @documents (idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc, fechaEmision)
			SELECT 
				 a.idAnticipo as idComprobante
				,a.idTipoDocumento as idTipoDocumento
				,td.codigo+'-'+es.estab+'-'+dbo.AFTAutoComplete(a.nroDoc) as nroDocumento
				,a.valor
				,td.codigo as tipoDocumento
				,''
				,a.fechaEmision
			FROM dbo.Anticipo               a WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab        = a.codEstab
			INNER JOIN TipoDocumento       td WITH (NOLOCK) ON td.idTipoDocumento = a.idTipoDocumento
			WHERE a.idCliente =  @idCliente 
				AND a.estado = 1 
				AND a.idAnticipo NOT IN (SELECT t.idComprobante FROM @cobroDocuments t WHERE t.codMov = 'A')

			SELECT idEntidadFinanciera,descripcion,detalle,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

			SELECT idEntidadFinanciera,idSubEntidadFinanciera,descripcion,codigo,interes,controlCaja FROM dbo.SubEntidadFinanciera WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1 

			SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1

			SELECT cd.idCiudad,provincia = pr.descripcion ,cd.descripcion,pr.codigo FROM dbo.Provincia pr WITH (NOLOCK) INNER JOIN dbo.Ciudad cd WITH (NOLOCK) ON cd.idProvincia = pr.idProvincia WHERE cd.estado = 1

			SELECT idDocumento,idTipoDocumento,serieComprobante,saldo,codDoc,nroDoc, fechaEmision = FORMAT(fechaEmision,'dd/MM/yyyy HH:mm') FROM @documents
            
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

            SELECT @idCliente = idCliente FROM OPENJSON(@json) WITH (idCliente INT '$.idCliente')

            SELECT CAST(count(*) AS varchar) + '  '  + IIF(codDoc = '01','Facturas','Notas de Entrega') as documento 
                  ,SUM(importeTotal) as importeTotal
                  ,SUM(abono) as abono
                  ,SUM(saldo) as saldo
            FROM v_CuentaPorCobrar WITH (NOLOCK) 
            WHERE idCliente = @idCliente
              AND codEstado IN ('PP','PE')
            GROUP BY codDoc
            RETURN 
        END 

    --> Filter 
    IF @tipo = 6
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

            SELECT cx.idCuotaPorCobrar
				  ,cx.idCuentaPorCobrar
				  ,cx.nroCuota
				  ,cx.cuota
				  ,cx.mora
				  ,cx.interes
				  ,cx.diasMora
				  ,cx.abono
				  ,cx.cuota - cx.abono as saldoCta
				  ,cx.saldo
				  ,ep.descripcion as estado
			FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
			INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
			WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar
			  AND cx.estado = 1 
			  AND ep.codigo IN ('PE','PP')
			ORDER BY cx.nroCuota ASC

            RETURN 
        END 

END
GO
