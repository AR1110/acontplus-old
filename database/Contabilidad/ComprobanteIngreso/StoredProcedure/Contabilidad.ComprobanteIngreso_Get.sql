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
                          ,@pageIndex         INT
                          ,@pageSize          INT
                          ,@isSearchDate      BIT'

			SET @sql = 'SELECT   ci.idComprobanteIngreso
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
                                     ,telefonoEstab = es.telefono
                                     ,correoEstab   = es.correo
                                     ,nombreEstab   = es.nombreComercial
                                     ,COUNT(*)                                                         OVER() as totalRecords
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
                  ,@pageIndex         = pageIndex
                  ,@pageSize          = pageSize
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
                ,pageIndex INT
                ,pageSize  INT
			)

            IF EXISTS (SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @userRoleId AND viewOthersDocs = 0)
				BEGIN
                    SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
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

			SET @sql = @sql + 'ORDER BY ci.nroDocumento DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '


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
			                   ,@pageIndex     = @pageIndex
                               ,@pageSize      = @pageSize
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
			      ,u.nombreUsuario
			FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
            INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.id                = ci.CustomerId
            INNER JOIN dbo.Usuario          u WITH (NOLOCK) ON u.idUsuario          = ci.idUsuario
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

			SELECT cu.IDCard                                  as numeroIdentificacion
				  ,cu.BusinessName                            as nombreFiscal
				  ,cc.serieComprobante                        as serieComprobante
				  ,FORMAT(cc.fechaEmision,'dd/MM/yyyy hh:mm') as fechaEmision
				  ,cc.importeTotal
				  ,cc.abono
				  ,cc.saldo
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
			INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente         = cc.idCliente
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision    = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento
            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
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
			      ,u.nombreUsuario
			FROM dbo.ComprobanteIngreso     ci WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
            INNER JOIN dbo.Usuario          u WITH (NOLOCK) ON u.idUsuario          = ci.idUsuario
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

              SET @tableNames = 'ptoEmision,tipoDocumento,subEntidadFinanciera,banco,users'

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

			SELECT idUsuario, nombreUsuario FROM v_usuario WHERE idEntidad = @idEntidad
            RETURN
        END

    --> DataForm
    IF @tipo = 5
        BEGIN
            DECLARE @idCliente INT ,@serieComprobante VARCHAR(15)

            SET @tableNames = 'entidadFinanciera,subEntidadFinanciera,banco,provincia,documentos,estadoPago,cuentaPorCobrar,config'

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar ,@idCliente = idCliente FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT ,idCliente INT)

            SELECT TOP 1 @serieComprobante = REPLACE(serieComprobante,'-','') FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar

            IF @idCliente IS NULL
                BEGIN
                    SELECT TOP 1 @idCliente = idCliente FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE idCuentaPorCobrar = @idCuentaPorCobrar
                END

			SELECT idEntidadFinanciera,descripcion,detalle,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

			SELECT idEntidadFinanciera,idSubEntidadFinanciera,descripcion,codigo,interes,controlCaja FROM dbo.SubEntidadFinanciera WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

			SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1

			SELECT cd.idCiudad,provincia = pr.descripcion ,cd.descripcion,pr.codigo FROM dbo.Provincia pr WITH (NOLOCK) INNER JOIN dbo.Ciudad cd WITH (NOLOCK) ON cd.idProvincia = pr.idProvincia WHERE cd.estado = 1;

            WITH DocumentosBase AS 
            (
                -- Filtrar documentos pendientes desde el inicio
                SELECT cc.idCuentaPorCobrar
                      ,cc.serieComprobante
                      ,cc.importeTotal
                      ,cc.codDoc
                      ,cc.fechaEmision
                      ,cc.idDocumento
                FROM Contabilidad.CuentaPorCobrar cc
                INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = cc.idEstadoPago
                WHERE cc.codDoc IN ('A', '04', '07')
                  AND cc.idCliente = @idCliente
                  AND ep.codigo = 'PE'
            ),
            DocumentosRelacionados AS 
            (
                SELECT db.idCuentaPorCobrar
                      ,db.codDoc
                      ,rd.numDocSustento
                      ,de.serieComprobante AS serieFacturaRelacionada
                FROM DocumentosBase					  db
                LEFT JOIN Recepcion.DocumentoRecibido dr ON dr.idDocumento = db.idDocumento AND db.codDoc = '07'
                LEFT JOIN FactElect.DocRelacionado    rd ON rd.idDocumentoRecibido = dr.idDocumento
                LEFT JOIN dbo.NotaCredito             nc ON nc.idNotaCredito = db.idDocumento AND db.codDoc = '04'
                LEFT JOIN dbo.Factura                 fa ON fa.idFactura = nc.idFactura
                LEFT JOIN dbo.DocumentoElectronico    de ON de.idDocumentoElectronico = fa.idDocumentoElectronico
            )
            SELECT db.idCuentaPorCobrar AS idDocumento
                  ,0					AS idTipoDocumento
                  ,db.serieComprobante
                  ,db.importeTotal		AS saldo
                  ,CASE db.codDoc WHEN '04' THEN 'Nota de Crédito'
					              WHEN '07' THEN 'Comprobante de Retención'
				                  WHEN 'A'  THEN 'Anticipo'
                   END AS nomDoc
	              ,FORMAT(db.fechaEmision, 'MM/dd/yyyy') AS fechaEmision
                  ,db.codDoc
            FROM DocumentosBase				 db
            LEFT JOIN DocumentosRelacionados dr ON dr.idCuentaPorCobrar = db.idCuentaPorCobrar
            WHERE @serieComprobante IS NULL
               OR (db.codDoc = 'A' AND dr.numDocSustento IS NULL AND dr.serieFacturaRelacionada IS NULL)
               OR dr.numDocSustento = @serieComprobante
               OR REPLACE(dr.serieFacturaRelacionada, '-', '') = @serieComprobante;

            SELECT idEstadoPago ,descripcion ,codigo FROM dbo.EstadoPago WHERE estado = 1 AND codigo IN ('PE','PP','CBR')

            SELECT cc.idCuentaPorCobrar
				  ,cc.idCliente
                  ,es.codEstab
                  ,cu.TradeName            as razonSocialComprador
                  ,cu.IDCard               as identificacionComprador
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
								    ,cx.fechaVencimiento
                                    ,cx.nroCuota
								    ,cx.cuota
								    ,cx.interes
								    ,cx.mora
								    ,cx.diasMora
								    ,cx.abono
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
            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar
              AND ep.codigo IN ('PP','PE')

            SELECT cast (0 as bit) as tipoConfig
                  ,cast (0 as bit) as interes
                  ,cast (0 as bit) as configDeuda 

			RETURN
        END

    --> Cuotas para realizar los cobros por lotes
    IF @tipo = 6
        BEGIN
            DECLARE @tipoConfig VARCHAR(20) ,@interes NUMERIC(18,5) ,@configDeuda BIT

            SET @tableNames = 'cuotas'

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar  FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT )

            SELECT cx.idCuotaPorCobrar
				  ,cx.idCuentaPorCobrar
				  ,cx.fechaVencimiento
                  ,cx.nroCuota
				  ,cx.cuota
				  ,cx.interes
				  ,cx.mora
				  ,cx.diasMora
				  ,cx.abono
				  ,cx.saldo
				  ,ep.descripcion      as estado
			FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
			INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
			WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar
				AND cx.estado = 1
				AND ep.codigo IN ('PE','PP')
			ORDER BY cx.nroCuota ASC

            RETURN
        END

    --> Get For Update
    IF @tipo = 7
        BEGIN

            SET @tableNames = 'cuentas,cuotas,estadoPago'

            SELECT @idComprobanteIngreso = id FROM OPENJSON(@json) WITH (id INT)

            SELECT hc.idCuentaPorCobrar ,cc.importeTotal + cc.mora as saldo,cc.abono as abonoDoc ,hc.abono ,hc.mora, hc.diasMora ,co.cobro
            FROM Contabilidad.Historial_Cobro       hc WITH (NOLOCK)
            INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro           = hc.idCobro
            INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar = hc.idCuentaPorCobrar
            WHERE hc.idComprobanteIngreso = @idComprobanteIngreso

            SELECT cd.idCuotaPorCobrar ,cc.cuota + cc.mora as saldo ,cc.abono as abonoCuota ,cd.abono ,cd.mora ,cd.diasMora ,cd.interes ,co.cobro
            FROM CobroDetalle                      cd WITH (NOLOCK)
            INNER JOIN Cobro                       co WITH (NOLOCK) ON co.idCobro = cd.idCobro
            INNER JOIN Contabilidad.CuotaPorCobrar cc WITH (NOLOCK) ON cc.idCuotaPorCobrar = cd.idCuotaPorCobrar
            WHERE co.idComprobanteIngreso = @idComprobanteIngreso

            SELECT idEstadoPago ,descripcion ,codigo FROM dbo.EstadoPago WHERE estado = 1 AND codigo IN ('PE','PP')

            RETURN
        END

    --> Get para las notificacions de cheques posfechados
    IF @tipo = 8
        BEGIN

            SET @tableNames = 'cheques'

            SELECT co.idCobro                                                                              as id
		          ,co.idComprobanteIngreso                                                                 as idComprobante
		          ,'CI' + '-' + es.estab + '-' + RIGHT('000000000' + CONVERT(VARCHAR, ci.nroDocumento), 9) as nroDocumento
		          ,cu.BusinessName                                                                         as persona
		          ,cu.IDCard                                                                               as nroIdentificacion
		          ,co.valor
		          ,JSON_VALUE(dbo.f_sanitize_json(co.infoCobro),'$.nro')                                   as nro
		          ,FORMAT(co.fechaEmision, 'dd/MM/yyyy HH:mm')                                             as fechaEmision
	        FROM dbo.Cobro                    co WITH (NOLOCK)
	        INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
	        INNER JOIN dbo.EntidadFinanciera  ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                   = ci.CustomerId
            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento    = ci.idEstablecimiento
	        WHERE ef.codigo = 'CHE'
              AND ci.estado = 1
              AND ci.idEntidad = @idEntidad
              AND co.posfechado = 1

            RETURN
        END
END
GO
