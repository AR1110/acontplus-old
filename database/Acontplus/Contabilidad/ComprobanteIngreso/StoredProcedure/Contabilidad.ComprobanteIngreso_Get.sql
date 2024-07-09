USE [AcontPlus]
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteIngreso_Get 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT
	
    -->Filters
	DECLARE @codEstab VARCHAR(50)
	       ,@fechaInicio DATETIME2 
	       ,@fechaFin DATETIME2
	       ,@nroIdentificacion NVARCHAR(100)
	       ,@byEstado INT 
	       ,@nroSecuencialDoc VARCHAR(13)
	       ,@idUsuario INT
	       ,@idComprobanteIngreso INT 
	       ,@idCuentaPorCobrar INT
	       ,@codDoc VARCHAR(5)
           ,@isSearchDate BIT

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

	SELECT TOP 1 @idUsuario = idUsuario , @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	--> Get 
	IF @tipo = 1
		BEGIN
            
            SET @tableNames = 'comprobanteIngreso'

			SET @params = '@idEntidad         INT
						  ,@fechaI            DATETIME2
						  ,@fechaF            DATETIME2
						  ,@nroIdentificacion NVARCHAR(100)
						  ,@estado            INT
						  ,@idUsuario         INT
						  ,@codEstab          VARCHAR(50)
						  ,@nroSecuencialDoc  VARCHAR(13)
                          ,@isSearchDate      BIT'

			SET @sql = 'SELECT TOP 50 ci.idComprobanteIngreso
							         ,ci.idComprobanteIngreso												       as idDocumento
							         ,es.codEstab
							         ,ci.total
							         ,FORMAT(ci.fechaRegistro,''dd/MM/yyyy'')								       as fechaRegistro
							         ,ci.abono
							         ,ci.cambio
							         ,''CI'' + ''-'' + es.estab + ''-'' +Helper.F_Auto_Sequential(ci.nroDocumento) as nroDoc
							         ,cu.IDCard															           as nroIdentificacion
							         ,cu.BusinessName													           as cliente
							         ,''Ninguna''															       as caja
							         ,CASE WHEN ci.estado = 0 THEN ''table-danger'' ELSE '''' END				   as style
							         ,CASE WHEN ci.estado = 0 THEN ''Anulado''      ELSE ''Activo'' END			   as estado
							         ,us.nombreUsuario														       as usuario
					FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK) 
					INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
					INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = ci.idUsuario
					INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.id                = ci.CustomerId
                    WHERE ci.idEntidad = @idEntidad '

			SELECT @idUsuario         = byUsuario
				  ,@nroIdentificacion = nroIdentificacion
				  ,@codEstab          = codEstab
				  ,@byEstado          = byEstado
				  ,@fechaInicio       = fechaInicio
				  ,@fechaFin          = fechaFin
				  ,@nroSecuencialDoc  = LTRIM(TRIM(nroSecuencialDoc))
                  ,@isSearchDate      = isSearchDate
			FROM OPENJSON(@json)WITH
            (
                
                 fechaInicio       DATETIME2
                ,fechaFin          DATETIME2
                ,nroIdentificacion NVARCHAR(100)
                ,codEstab          VARCHAR(100)
                ,byUsuario         INT
                ,byEstado          INT
                ,nroSecuencialDoc  VARCHAR(13)
                ,isSearchDate BIT
			)

            IF EXISTS (SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @userRoleId AND viewOthersDocs = 0) 
				BEGIN
                    SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
				END

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND es.codEstab = @codEstab '
                END 

	        IF @byEstado IN (1,0)
			    BEGIN
				    SET @sql = @sql + 'AND ci.estado = @estado '
			    END 		 
			
			IF @nroIdentificacion IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND cu.IDCard = @nroIdentificacion '
				END 

			IF @nroSecuencialDoc > 0
				BEGIN
					SET @sql = @sql + ' AND ci.nroDocumento = @nroSecuencialDoc '
				END 
			
			IF @isSearchDate = 1
				BEGIN
					SET @sql = @sql + 'AND CAST(ci.fechaRegistro as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '
				END

			IF @idUsuario > 0 
				BEGIN
					SET @sql = @sql + 'AND ci.idUsuario = @idUsuario '
				END 		

			SET @sql = @sql + 'ORDER BY ci.nroDocumento DESC '
		 
			EXEC sp_executesql  @sql
					           ,@params
					           ,@idEntidad            = @idEntidad
					           ,@codEstab             = @codEstab
					           ,@fechaI               = @fechaInicio
					           ,@fechaF               = @fechaFin
					           ,@nroIdentificacion    = @nroIdentificacion
					           ,@idUsuario            = @idUsuario
					           ,@estado               = @byEstado
							   ,@nroSecuencialDoc     = @nroSecuencialDoc
                               ,@isSearchDate         = @isSearchDate
			RETURN 
		END 

	--> Historial para mostrar los detalles del comprobante de ingreso 
	IF @tipo = 2
		BEGIN
            SET @tableNames = 'comprobanteIngreso,cobro,cobroDetalle'

			SELECT @idComprobanteIngreso = idComprobanteIngreso FROM OPENJSON(@json) WITH (idComprobanteIngreso INT)

			SELECT ci.idComprobanteIngreso
				  ,'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) as serieComprobante
				  ,FORMAT(ci.fechaRegistro,'dd/MM/yyyy')                                   as fechaEmision
				  ,ci.total
				  ,ci.abono
				  ,ci.cambio
                  ,cu.IDCard                                                               as numeroIdentificacion
				  ,cu.BusinessName                                                         as nombreFiscal
			FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
            INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.id                = ci.CustomerId
			WHERE ci.idComprobanteIngreso = @idComprobanteIngreso

			SELECT co.idCobro
				  ,co.valor
				  ,co.abono
				  ,fechaEmision         = FORMAT(co.fechaEmision, 'dd/MM/yyyy')
				  ,codPago              = ef.codigo
				  ,subEntidadFinanciera = ISNULL(sf.descripcion, ef.descripcion)
				  ,co.infoCobro
				  ,posfechado           = CASE WHEN co.posfechado = 1 THEN  'SI' ELSE 'NO' END 
			      ,estado               = CASE WHEN co.cobro = 1 THEN 'COBRADO' ELSE 'POR COBRAR' END
			FROM dbo.Cobro                   co WITH (NOLOCK) 
			INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
			 LEFT JOIN SubEntidadFinanciera  sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
			 LEFT JOIN Banco                 bc WITH (NOLOCK) ON bc.idBanco                = co.idBanco
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso
            ORDER BY co.secuencial ASC

			SELECT cd.idCobroDetalle
			      ,cd.idCobro 
				  ,codDoc           = CASE cx.codDoc WHEN '01' THEN 'Factura' ELSE 'Nota Entrega' END 
				  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'dd/MM/yyyy')
				  ,cc.nroCuota
				  ,cc.cuota
				  ,cd.interes
				  ,cd.diasMora
				  ,cd.mora
				  ,cd.abono
				  ,saldo            = (cc.cuota + cd.mora) - cd.abono
				  ,serieComprobante = cx.serieComprobante
			FROM dbo.CobroDetalle                   cd WITH (NOLOCK)
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro           = cd.idCobro
			INNER JOIN Contabilidad.CuotaPorCobrar  cc WITH (NOLOCK) ON cc.idCuotaPorCobrar  = cd.idCuotaPorCobrar
			INNER JOIN Contabilidad.CuentaPorCobrar cx WITH (NOLOCK) ON cx.idCuentaPorCobrar = cc.idCuentaPorCobrar
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso
            ORDER BY co.secuencial,cc.nroCuota ASC

			RETURN 
		END

	--> Historial para mostrar los comprobantes de ingreso por Documento
	IF @tipo = 3
		BEGIN
            
            SET @tableNames = 'cuentaPorCobrar,comprobanteIngreso,cobro,cobroDetalle'

			SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT)

			SELECT cl.numeroIdentificacion
				  ,cl.nombreFiscal
				  ,cc.serieComprobante                        as serieComprobante
				  ,FORMAT(cc.fechaEmision,'dd/MM/yyyy hh:mm') as fechaEmision
				  ,cc.importeTotal
				  ,cc.abono
				  ,cc.saldo
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
			INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente         = cc.idCliente
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision    = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar

			SELECT ci.idComprobanteIngreso 
				  ,FORMAT(ci.fechaRegistro,'dd/MM/yyyy hh:mm')                             as fechaEmision
				  ,'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) as serieComprobante
				  ,ci.total
				  ,ci.abono
				  ,ci.cambio
				  ,CASE ci.estado WHEN 1 THEN 'ACTIVO' ELSE 'ANULADO' END                  as estado
                  ,ci.estado                                                               as [status]
                  ,(
                        SELECT COUNT(DISTINCT cc.idCuentaPorCobrar) 
                        FROM Contabilidad.Historial_Cobro cc WITH (NOLOCK) 
                        WHERE cc.idComprobanteIngreso = ci.idComprobanteIngreso

                   )                                                                       as cantDocs
                  ,es.codEstab
			FROM dbo.ComprobanteIngreso     ci WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
			WHERE ci.idComprobanteIngreso IN (SELECT hc.idComprobanteIngreso FROM Contabilidad.Historial_Cobro hc WITH (NOLOCK) WHERE hc.idCuentaPorCobrar = @idCuentaPorCobrar)
              AND ci.estado = 1

			SELECT co.idComprobanteIngreso
			      ,co.idCobro
				  ,CASE co.posfechado WHEN 1 THEN 'SI' ELSE 'NO' END         as posfechado
				  ,FORMAT(co.fechaEmision,'dd/MM/yyyy hh:mm')                as fechaEmision
				  ,ISNULL(sf.descripcion,ef.descripcion)                     as formaCobro
				  ,ISNULL(bc.descripcion,'-------------')                    as banco
				  ,ISNULL(dbo.f_sanitize_json(co.infoCobro),'[]')            as infoCobro
				  ,co.valor
				  ,co.abono
				  ,co.vuelto
				  ,CASE co.cobro WHEN 1 THEN 'COBRADO' ELSE 'POR COBRAR' END as estado
				  ,ef.codigo                                                 as codPago
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON ci.idComprobanteIngreso   = hc.idComprobanteIngreso
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro                = hc.idCobro
			INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
			 LEFT JOIN dbo.SubEntidadFinanciera     sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
			 LEFT JOIN dbo.Banco                    bc WITH (NOLOCK) ON bc.idBanco                = co.idBanco
			WHERE hc.idCuentaPorCobrar = @idCuentaPorCobrar
              AND ci.estado = 1
            ORDER BY co.secuencial ASC

			SELECT co.idCobro
				  ,cx.nroCuota
				  ,FORMAT(cx.fechaVencimiento,'dd/MM/yyyy') as fechaVencimiento
				  ,cx.cuota
				  ,cc.abono
                  ,cc.saldo - cc.abono                      as saldo
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idComprobanteIngreso   = ci.idComprobanteIngreso
			INNER JOIN dbo.CobroDetalle             cc WITH (NOLOCK) ON cc.idCobro                = co.idCobro
			INNER JOIN Contabilidad.CuotaPorCobrar  cx WITH (NOLOCK) ON cx.idCuotaPorCobrar       = cc.idCuotaPorCobrar
			WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar
              AND ci.estado = 1
            ORDER BY co.secuencial,cx.nroCuota ASC

			RETURN 
		END 

    --> Filtros
    IF @tipo = 4
        BEGIN
            
            SET @tableNames = 'ptoEmision,tipoDocumento,subEntidadFinanciera,banco'

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK)
            WHERE idUsuarioRol = @userRoleId 
            ORDER BY defaultEstab DESC
            
            SELECT idTipoDocumento
                , descripcion
                , codigoSri
                , codigo AS codDoc
            FROM dbo.TipoDocumento
            WITH (NOLOCK) 
            WHERE codigo IN ('FV','NE')

            SELECT idSubEntidadFinanciera
                    , idEntidadFinanciera
                    , descripcion
                    , codigo
                    , interes
                    , estado
                    , idEntidad
                    , predeterminado
                    , controlCaja
            FROM SubEntidadFinanciera
            WHERE idEntidad = @idEntidad
            
            SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1
            RETURN
        END

    --> DataForm
    IF @tipo = 5
        BEGIN
            
            DECLARE @idCliente INT

            SET @tableNames = 'entidadFinanciera,subEntidadFinanciera,banco,provincia,documentos,estadoPago,cuentaPorCobrar'

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
            
            SELECT idEstadoPago ,descripcion ,codigo FROM dbo.EstadoPago WHERE estado = 1 AND codigo IN ('PE','PP','CBR','PFC')

            SELECT cc.idCuentaPorCobrar
				  ,cc.idCliente
                  ,es.codEstab
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
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision    = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento
			INNER JOIN dbo.EstadoPago         ep WITH (NOLOCK) ON ep.idEstadoPago      = cc.idEstadoPago
            INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente         = cc.idCliente
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar 
              AND ep.codigo IN ('PP','PE')

			RETURN
        END 

    --> Cuotas para realizar los cobros por lotes
    IF @tipo = 6
        BEGIN
            DECLARE @tipoConfig VARCHAR(20) ,@interes NUMERIC(18,5) ,@configDeuda BIT 

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

    --> Get For Update
    IF @tipo = 7
        BEGIN
            
            SET @tableNames = 'cuentas,cuotas,estadoPago'

            SELECT @idComprobanteIngreso = id FROM OPENJSON(@json) WITH (id INT)

            SELECT hc.idCuentaPorCobrar ,cc.importeTotal + cc.mora as saldo, cc.abono as abonoDoc ,hc.abono ,co.cobro
            FROM Contabilidad.Historial_Cobro       hc WITH (NOLOCK) 
            INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro           = hc.idCobro
            INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar = hc.idCuentaPorCobrar
            WHERE hc.idComprobanteIngreso = @idComprobanteIngreso

            SELECT cd.idCuotaPorCobrar ,cc.cuota + cc.mora as saldo ,cc.abono as abonoCuota ,cd.abono ,co.cobro
            FROM CobroDetalle                      cd WITH (NOLOCK)
            INNER JOIN Cobro                       co WITH (NOLOCK) ON co.idCobro = cd.idCobro
            INNER JOIN Contabilidad.CuotaPorCobrar cc WITH (NOLOCK) ON cc.idCuotaPorCobrar = cd.idCuotaPorCobrar
            WHERE co.idComprobanteIngreso = @idComprobanteIngreso

            SELECT idEstadoPago ,descripcion ,codigo FROM dbo.EstadoPago WHERE estado = 1 AND codigo IN ('PE','PP')

            RETURN 
        END 
END
GO