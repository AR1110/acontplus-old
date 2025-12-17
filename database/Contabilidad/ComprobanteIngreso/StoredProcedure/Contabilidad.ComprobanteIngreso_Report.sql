SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2024/05/15
-- Description:	REPORT FOR COBROS
-- =============================================
-- Contabilidad.ComprobanteIngreso_Report 343, '{"tipo":1,"format":"pdf","codEstab":"ESTAB-000000237","codDoc":"NE","idSubEntidadFinanciera":0,"idCustomer":null,"idPuntoEmision":246,"fechaInicio":"2023-09-01 00:00:00 AM","fechaFin":"2023-09-30 23:59:59 PM","dateChecked":true,"idBanco":0,"nroDocChecked":false,"nroDocument":"","referenceChecked":false,"reference":"","loteChecked":false,"lote":""}', ''
CREATE OR ALTER PROC Contabilidad.ComprobanteIngreso_Report
	 @userRoleId INT
	,@json	     VARCHAR(MAX)
  ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    --> Filters
    DECLARE @usuario                VARCHAR(150)
           ,@idUsuario              INT
           ,@codDoc                 VARCHAR(5)
           ,@idSubEntidadFinanciera INT
           ,@fechaInicio            DATETIME2
           ,@fechaFin               DATETIME2
           ,@codEstab               VARCHAR(20)
           ,@dateChecked            BIT
           ,@idCustomer             INT
           ,@idPuntoEmision         INT
           ,@idBanco                INT
           ,@nroDocChecked          BIT
           ,@nroDocument            VARCHAR(30)
           ,@referenceChecked       BIT
           ,@reference              VARCHAR(30)
           ,@loteChecked            BIT
           ,@lote                   VARCHAR(30)
           ,@id                     INT
		       ,@byIngreso              BIT
           ,@tipoDoc                VARCHAR(20)

	--> Variables
    SELECT TOP 1 @idEntidad = idEntidad ,@usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo, @codDoc = codDoc FROM OPENJSON(@json) WITH ( tipo INT, codDoc VARCHAR(5))

    IF @codDoc = 'NE'
        BEGIN
            SET @tipoDoc = 'NOTA DE ENTREGA'
        END

    IF @codDoc = 'FV'
        BEGIN
            SET @tipoDoc = 'FACTURA'
        END

    IF @codDoc IS NULL OR @codDoc = ''
        BEGIN
            SET @tipoDoc = 'TODOS'
        END

	--> Por Documentos.
	IF @tipo = 1
		BEGIN
            SET @tableNames = 'header,details'

             SELECT @codEstab               = codEstab
                , @codDoc                   = codDoc
                , @idSubEntidadFinanciera   = idSubEntidadFinanciera
                , @fechaInicio              = fechaInicio
                , @fechaFin                 = fechaFin
                , @dateChecked              = dateChecked
                , @idCustomer               = idCustomer
                , @idPuntoEmision           = idPuntoEmision
                , @idBanco                  = idBanco
                , @nroDocChecked            = nroDocChecked
                , @nroDocument              = nroDocument
                , @referenceChecked         = referenceChecked
                , @reference                = reference
                , @loteChecked              = loteChecked
                , @lote                     = lote
            FROM OPENJSON(@json) WITH (
                codEstab                    VARCHAR(20)
                , codDoc                    VARCHAR(5)
                , idSubEntidadFinanciera    INT
                , idCustomer                INT
                , fechaInicio               DATETIME2
                , fechaFin                  DATETIME2
                , dateChecked               BIT
                , idCustomer                INT
                , idPuntoEmision            INT
                , idBanco                   INT
                , nroDocChecked             BIT
                , nroDocument               VARCHAR(30)
                , referenceChecked          BIT
                , reference                 VARCHAR(30)
                , loteChecked               BIT
                , lote                      VARCHAR(30)
            )

            SET @params = '@idEntidad              INT 
                          ,@idSubEntidadFinanciera INT
                          ,@codEstab               VARCHAR(20)
                          ,@codDoc                 VARCHAR(5)
                          ,@idCustomer             INT
                          ,@idPuntoEmision         INT
                          ,@fechaInicio            DATETIME2
                          ,@fechaFin               DATETIME2
                          ,@idBanco                INT
                          ,@nroDocument            VARCHAR(30)
                          ,@reference              VARCHAR(30)
                          ,@lote                   VARCHAR(30)'

            SET @sql = 'SELECT * FROM (SELECT ci.idComprobanteIngreso
                                            , ci.idUsuario
                                            , ur.nombreUsuario
                                            , ci.CustomerId
                                            , se.nombreComercial
                                            , se.codEstab
                                            , ''CI'' +''-''+ se.estab +''-''+ Helper.F_Auto_Sequential(ci.nroDocumento)	                AS serie
                                            , FORMAT(ci.fechaRegistro, ''dd/MM/yyyy HH:mm'')         								                    AS fechaRegistro
                                            , CAST(ci.abono  AS NUMERIC(18,2))															                            AS abono
                                            , CAST(ci.total  AS NUMERIC(18,2))															                            AS total
                                            , ci.nroDocumento
                                            , cu.BusinessName                                                                           as nombreFiscal
			                                      , cu.IDCard                                                                                 as nroIdentificacion
                                            , cc.idPuntoEmision
                                            , cc.serieComprobante
                                            , (	CASE cc.codDoc WHEN ''01'' THEN ''FV'' ELSE cc.codDoc END )						                  AS codDoc
                                            , ef.codigo                                                                                 AS codFormaPago
                                            , ef.descripcion
                                            , cc.idCliente
                                            , CAST(cc.importeTotal  AS NUMERIC(18,2))												                            AS totalDoc
                                            , CAST(hc.abono AS NUMERIC(18,2))															                              AS abonoDoc
                                            , CAST(hc.saldo - hc.abono AS NUMERIC(18,2))    	            							                AS saldoDoc
                                            , ISNULL(bc.descripcion, '''')																                              AS banco
                                            , ISNULL(cd.descripcion, '''')																                              AS ciudad
                                            , co.idSubEntidadFinanciera         														                            AS idSubEntidadFinanciera
                                            , co.secuencial                                                                             AS secuencial
                                            , FORMAT(co.fechaEmision, ''dd/MM/yyyy'')                                                   AS fechaEmision
                                            , co.idBanco
                                            , ci.observacion
                                            , (
	                                            CASE ef.codigo WHEN ''EFE'' THEN  ''''
								                               ELSE  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.nro'')
	                                            END
	                                          )																						                                                AS nro
                                            , (
	                                            CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.referencia'') 
								                                            ELSE  ''''
	                                            END
	                                          )																						    AS referencia
                                            , (
	                                            CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.aprobacion'')
								                                            ELSE  ''''
	                                            END
	                                          )																						    AS aprobacion
                                            , (
	                                            CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.lote'')
								                                            ELSE  ''''
	                                            END
	                                          )																					        AS lote
                                            FROM dbo.ComprobanteIngreso                   ci	  WITH(NOLOCK)
                                            INNER JOIN dbo.Usuario					              ur		WITH(NOLOCK) ON ur.idUsuario	  = ci.idUsuario
                                            INNER JOIN Sri.Establecimiento				        se		WITH(NOLOCK) ON se.idEstablecimiento		= ci.idEstablecimiento
                                            INNER JOIN Customer.Customer                  cu    WITH(NOLOCK) ON cu.id                       = ci.CustomerId
                                            INNER JOIN Contabilidad.Historial_Cobro		    hc		WITH(NOLOCK) ON hc.idComprobanteIngreso		= ci.idComprobanteIngreso
                                            INNER JOIN Contabilidad.CuentaPorCobrar		    cc		WITH(NOLOCK) ON cc.idCuentaPorCobrar		= hc.idCuentaPorCobrar
                                            INNER JOIN dbo.Cobro						              co		WITH(NOLOCK) ON co.idCobro					= hc.idCobro
                                            INNER JOIN dbo.EntidadFinanciera			        ef		WITH(NOLOCK) ON ef.idEntidadFinanciera		= co.idEntidadFinanciera
                                            LEFT  JOIN dbo.Banco						              bc		WITH(NOLOCK) ON bc.idBanco					= co.idBanco
                                            LEFT  JOIN dbo.Ciudad						              cd		WITH(NOLOCK) ON cd.idCiudad					= co.idCiudad
                                            WHERE		ci.idEntidad    = @idEntidad
                                            AND			ci.estado       = 1
                                   ) AS dt WHERE dt.idComprobanteIngreso > 0 '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idPuntoEmision = @idPuntoEmision '
                END

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codDoc = @codDoc '
                END

            IF @idSubEntidadFinanciera > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idSubEntidadFinanciera = @idSubEntidadFinanciera '
                END

            IF @idCustomer > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idCliente = @idCustomer '
                END

            IF @idBanco > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idBanco = @idBanco '
                END

            IF @nroDocChecked       = 1
                BEGIN
                    SET @sql = @sql + 'AND dt.nroDocumento = @nroDocument '
                END

            IF @referenceChecked    = 1
                BEGIN 
                    SET @sql = @sql + 'AND dt.referencia = @reference '
                END

            IF @loteChecked         = 1
                BEGIN
                    SET @sql = @sql + 'AND dt.lote = @lote '
                END

            IF @dateChecked = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaRegistro AS DATE) BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE) '
                END
            
            SET @sql = @sql + 'ORDER BY dt.serieComprobante, dt.fechaEmision ASC '
            
            ---> Header
            SELECT TOP 1 
                ve.nombreComercial
                , ve.ruc
                , ve.telefono
                , ve.correo
                , @usuario                                AS usuario
                , FORMAT(@fechaInicio, 'dd/MM/yyyy')      AS fechaInicio
                , FORMAT(@fechaFin, 'dd/MM/yyyy')         AS fechaFin
                , @tipoDoc                                AS tipoDocumento
            FROM v_Estab_Asign ve WITH(NOLOCK)
            WHERE ve.codEstab = @codEstab

            ---> Details
            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad                   = @idEntidad
                              ,@idSubEntidadFinanciera      = @idSubEntidadFinanciera
                              ,@codEstab                    = @codEstab
                              ,@codDoc                      = @codDoc
                              ,@idCustomer                  = @idCustomer
                              ,@idPuntoEmision              = @idPuntoEmision
                              ,@fechaInicio                 = @fechaInicio
                              ,@fechaFin                    = @fechaFin
                              ,@idBanco                     = @idBanco
                              ,@nroDocument                 = @nroDocument
                              ,@reference                   = @reference
                              ,@lote                        = @lote
			RETURN
		END
	
    --> Por Cuotas
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'header,details'

            SELECT @codEstab                = codEstab
                , @codDoc                   = codDoc
                , @idSubEntidadFinanciera   = idSubEntidadFinanciera
                , @idCustomer               = idCustomer
                , @fechaInicio              = fechaInicio
                , @fechaFin                 = fechaFin
                , @dateChecked              = dateChecked
                , @idPuntoEmision           = idPuntoEmision
                , @idBanco                  = idBanco
                , @nroDocChecked            = nroDocChecked
                , @nroDocument              = nroDocument
                , @referenceChecked         = referenceChecked
                , @reference                = reference
                , @loteChecked              = loteChecked
                , @lote                     = lote
            FROM OPENJSON(@json) WITH (
                codEstab                    VARCHAR(20)
                , codDoc                    VARCHAR(5)
                , idSubEntidadFinanciera    INT
                , idCustomer                INT
                , fechaInicio               DATETIME2
                , fechaFin                  DATETIME2
                , dateChecked               BIT
                , idPuntoEmision            INT
                , idBanco                   INT
                , nroDocChecked             BIT
                , nroDocument               VARCHAR(30)
                , referenceChecked          BIT
                , reference                 VARCHAR(30)
                , loteChecked               BIT
                , lote                      VARCHAR(30)
            )
            

            SET @params = '@idEntidad               INT 
                           ,@idSubEntidadFinanciera INT
                           ,@codEstab               VARCHAR(20)
                           ,@codDoc                 VARCHAR(5)
                           ,@idCustomer             INT
                           ,@idPuntoEmision         INT
                           ,@fechaInicio            DATETIME2
                           ,@fechaFin               DATETIME2
                           ,@idBanco                INT
                           ,@nroDocument            VARCHAR(30)
                           ,@reference              VARCHAR(30)
                           ,@lote                   VARCHAR(30)'

            SET @sql = 'SELECT * FROM (SELECT ci.idComprobanteIngreso
                                        , ci.idUsuario
                                        , ur.nombreUsuario
                                        , se.nombreComercial
                                        , se.codEstab
                                        , ''CI'' +''-''+ se.estab +''-''+ Helper.F_Auto_Sequential(ci.nroDocumento)						        AS serie
                                        , FORMAT(ci.fechaRegistro, ''dd/MM/yyyy HH:mm'')                  								            AS fechaRegistro
                                        , CAST(ci.abono  AS NUMERIC(18,2))      															                        AS abono
                                        , CAST(ci.total  AS NUMERIC(18,2))															                              AS total
                                        , ci.nroDocumento
                                        , cu.BusinessName                                                                             as nombreFiscal
			                                  , cu.IDCard                                                                                   as nroIdentificacion
                                        , cc.idCliente
                                        , cc.idPuntoEmision
                                        , cc.serieComprobante
                                        , (CASE cc.codDoc WHEN ''01'' THEN ''FV'' ELSE cc.codDoc END)								                  AS codDoc
                                        , cx.nroCuota
                                        , ef.codigo                                                                                   AS codFormaPago
                                        , ef.descripcion
                                        , CAST(cc.importeTotal  AS NUMERIC(18,2))															                        AS totalDoc
                                        , CAST(cc.abono  AS NUMERIC(18,2))															                              AS abonoDoc
                                        , CAST(cc.saldo  AS NUMERIC(18,2))												                                    AS saldoDoc
                                        , ISNULL(bc.descripcion, '''')																                                AS banco
                                        , ISNULL(cd.descripcion, '''')																                                AS ciudad
                                        , ISNULL(co.idSubEntidadFinanciera, 0)														                            AS idSubEntidadFinanciera
                                        , co.secuencial                                                                               AS secuencial
                                        , FORMAT(co.fechaEmision, ''dd/MM/yyyy'')                                                     AS fechaEmision                                        
                                        , co.idBanco
                                        , ci.observacion
                                        , (
	                                        CASE ef.codigo WHEN ''EFE'' THEN  ''''
								                                        ELSE  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.nro'')
	                                        END
	                                      )																						            AS nro
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.referencia'') 
								                                        ELSE  ''''
	                                        END
	                                        )																						        AS referencia
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.aprobacion'')
								                                        ELSE  ''''
	                                        END
	                                      )																						            AS aprobacion
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.lote'')
								                                        ELSE  ''''
	                                        END
	                                      )																					                AS lote
                                        ,ci.estado
                                        FROM dbo.ComprobanteIngreso                 ci	    WITH(NOLOCK)
                                        INNER JOIN dbo.Usuario					            ur		WITH(NOLOCK) ON ur.idUsuario	  = ci.idUsuario
                                        INNER JOIN Customer.Customer                cu      WITH(NOLOCK) ON cu.id                       = ci.CustomerId
                                        INNER JOIN Sri.Establecimiento				se		WITH(NOLOCK) ON se.idEstablecimiento	    = ci.idEstablecimiento
                                        INNER JOIN dbo.Cobro						co		WITH(NOLOCK) ON co.idComprobanteIngreso		= ci.idComprobanteIngreso
                                        INNER JOIN dbo.EntidadFinanciera			ef		WITH(NOLOCK) ON ef.idEntidadFinanciera		= co.idEntidadFinanciera
                                        LEFT  JOIN dbo.Banco						bc		WITH(NOLOCK) ON bc.idBanco					= co.idBanco
                                        LEFT  JOIN dbo.Ciudad						cd		WITH(NOLOCK) ON cd.idCiudad					= co.idCiudad
                                        INNER JOIN dbo.CobroDetalle					hc		WITH(NOLOCK) ON hc.idCobro					= co.idCobro
                                        INNER JOIN Contabilidad.CuotaPorCobrar		cx		WITH(NOLOCK) ON cx.idCuotaPorCobrar			= hc.idCuotaPorCobrar
                                        INNER JOIN Contabilidad.CuentaPorCobrar		cc		WITH(NOLOCK) ON cc.idCuentaPorCobrar		= cx.idCuentaPorCobrar
                                        WHERE		ci.idEntidad    = @idEntidad
                                        AND			ci.estado       = 1
                                   ) AS dt WHERE dt.idComprobanteIngreso > 0 '
            
            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idPuntoEmision = @idPuntoEmision '
                END

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codDoc = @codDoc '
                END

            IF @idSubEntidadFinanciera > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idSubEntidadFinanciera = @idSubEntidadFinanciera '
                END

            IF @idCustomer > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idCliente = @idCustomer '
                END

            IF @idBanco > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idBanco = @idBanco '
                END

            IF @nroDocChecked       = 1
                BEGIN
                    SET @sql = @sql + 'AND dt.nroDocumento = @nroDocument '
                END

            IF @referenceChecked    = 1
                BEGIN 
                    SET @sql = @sql + 'AND dt.referencia = @reference '
                END

            IF @loteChecked         = 1
                BEGIN
                    SET @sql = @sql + 'AND dt.lote = @lote '
                END

            IF @dateChecked         = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaRegistro AS DATE) BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE) '
                END
                
            SET @sql = @sql + 'ORDER BY dt.serieComprobante, dt.fechaEmision ASC '

            ---> Header
            SELECT TOP 1 ve.nombreComercial
                , ve.ruc
                , ve.telefono
                , ve.correo
                , @usuario                                AS usuario
                , FORMAT(@fechaInicio, 'dd/MM/yyyy')      AS fechaInicio
                , FORMAT(@fechaFin, 'dd/MM/yyyy')         AS fechaFin
                , @tipoDoc                                AS tipoDocumento
            FROM v_Estab_Asign ve   WITH(NOLOCK)
            WHERE ve.codEstab = @codEstab

            ---> Details
            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad                   = @idEntidad
                              ,@idSubEntidadFinanciera      = @idSubEntidadFinanciera
                              ,@codEstab                    = @codEstab
                              ,@codDoc                      = @codDoc
                              ,@idCustomer                  = @idCustomer
                              ,@idPuntoEmision              = @idPuntoEmision
                              ,@fechaInicio                 = @fechaInicio
                              ,@fechaFin                    = @fechaFin
                              ,@idBanco                     = @idBanco
                              ,@nroDocument                 = @nroDocument
                              ,@reference                   = @reference
                              ,@lote                        = @lote
            RETURN
        END

    --> Reporte por Documento
    IF @tipo = 3
        BEGIN
            
            SET @tableNames = 'comprobanteIngresoDs,cobroDs,documentoDs,cuotaDs'

            SELECT @id = id FROM OPENJSON(@json) WITH(id INT )

            IF EXISTS(SELECT 1 FROM CobroDocumento cd WITH (NOLOCK) INNER JOIN TipoDocumento td WITH (NOLOCK)  ON td.idTipoDocumento = cd.idTipoDocumento WHERE cd.idComprobanteIngreso = @id AND td.codigo IN ('A','IC') )
		        BEGIN
			        SET @byIngreso = 1
		        END

            SELECT 'Nro.:' + 'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) as nroComprobante
			      ,@byIngreso                                                                        as byIngreso
			      ,cu.BusinessName                                                                   as cliente
			      ,cu.IDCard                                                                         as nroIdentificacion
			      ,FORMAT(ci.fechaRegistro, 'dd/MM/yyyy hh:mm')                                      as fechaEmision
			      ,CAST(ci.abono as numeric(18,2))                                                   as total
			      ,en.nombreComercial
			      ,en.ruc
			      ,en.telefono
			      ,en.direccion
                  ,ci.observacion
		    FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK) 
		    INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad         = ci.idEntidad
		    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
            INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.id                = ci.CustomerId
		    WHERE ci.idComprobanteIngreso = @id

		    SELECT ISNULL(sf.descripcion,ef.descripcion)                 as formaCobro
			      ,FORMAT(co.fechaEmision,'dd/MM/yyyy hh:mm')            as fechaEmision
			      ,ISNULL(ba.descripcion,'')                             as banco
			      ,JSON_VALUE(dbo.f_sanitize_json(co.infoCobro),'$.nro') as nro
			      ,CAST(co.valor AS NUMERIC(18,2))                       as total
			      ,CAST(co.abono AS NUMERIC(18,2))                       as abono
			      ,CAST(co.vuelto AS NUMERIC(18,2))                      as cambio
			      ,IIF(co.posfechado = 1,'SI','NO')                      as posfechado
                  ,JSON_VALUE(dbo.f_sanitize_json(co.infoCobro),'$.nomDoc') as nomDoc
		    FROM dbo.ComprobanteIngreso         ci WITH (NOLOCK)
		    INNER JOIN dbo.Cobro                co WITH (NOLOCK) ON co.idComprobanteIngreso   = ci.idComprobanteIngreso
		    INNER JOIN dbo.EntidadFinanciera    ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
		     LEFT JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
		     LEFT JOIN dbo.Banco                ba WITH (NOLOCK) ON ba.idBanco                = co.idBanco
		    WHERE ci.idComprobanteIngreso = @id

            IF EXISTS (SELECT 1 FROM dbo.Anticipo WITH (NOLOCK) WHERE idComprobanteIngreso = @id )
                BEGIN
                    SELECT 'A'                                                               as tipoDoc
                          ,'A' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(an.nroDoc)  as nroDoc
                          ,FORMAT(an.fechaEmision,'dd/MM/yyyy hh:mm')                        as fechaEmision 
                          ,CAST(an.valor as numeric(18,2))                                   as total
                          ,sf.descripcion                                                    as formaCobro
                    FROM dbo.Anticipo                   an WITH (NOLOCK)
                    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = an.idEstablecimiento
                    INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = an.idSubEntidadFinanciera
                    WHERE an.idComprobanteIngreso = @id
                END 
            ELSE
                BEGIN
                    SELECT IIF(cc.codDoc = '01','FV','NE')                                as tipoDoc
			              ,cc.serieComprobante
			              ,FORMAT(cc.fechaEmision, 'dd/MM/yyyy hh:mm')                    as fechaEmision 
			              ,CAST(cc.importeTotal as numeric(18,2))                         as total
			              ,hc.diasMora                                                    as diasMora
			              ,CAST(hc.mora as numeric(18,2))                                 as mora
			              ,CAST(hc.abono as numeric(18,2))                                as abono
			              ,CAST((cc.importeTotal + hc.mora ) - hc.abono as numeric(18,2)) as saldo
		            FROM Contabilidad.Historial_Cobro					 hc WITH(NOLOCK)
		            INNER JOIN dbo.ComprobanteIngreso                    ci WITH(NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
		            INNER JOIN Contabilidad.CuentaPorCobrar              cc WITH(NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar 
		            WHERE ci.idComprobanteIngreso = @id
                END

            SELECT 
	            cuota_pc.idCuentaPorCobrar
                ,co.idComprobanteIngreso
                ,cuota_pc.idCuotaPorCobrar
                ,cd.idCobroDetalle
                ,FORMAT(cuenta_pc.fechaEmision, 'dd/MM/yyyy hh:mm')                                                             as fechaEmisionDoc
                ,FORMAT(cuenta_pc.fechaVencimiento, 'dd/MM/yyyy')                                                               as fechaVcto
                ,IIF(cuenta_pc.codDoc = '01','FV','NE')                                                                         as tipoDoc
	            ,cuenta_pc.serieComprobante
	            ,cuota_pc.nroCuota
	            ,CAST(cuota_pc.cuota as numeric(18,2))                                                                          as cuota
	            ,CAST(cuenta_pc.importeTotal as numeric(18,2))                                                                  as importeTotal
	            ,CAST(hc.abono as numeric(18,2))                                                                                as abonoDoc
	            ,CAST(hc.saldo - hc.abono as numeric(18,2))                                                                     as saldoDoc
	            ,CAST(cd.interes as numeric(18,2))                                                                              as interes
	            ,cd.diasMora
	            ,CAST(cd.mora as numeric(18,2))                                                                                 as mora
	            ,CAST(cd.abono as numeric(18,2))                                                                                as abono
	            ,CAST(cd.saldo - cd.abono as numeric(18,2))																	    as saldo
	            ,ISNULL(sf.descripcion,ef.descripcion) + '-' + ISNULL(JSON_VALUE(dbo.f_sanitize_json(co.infoCobro),'$.nro'),'') as ingreso
            FROM Contabilidad.CuotaPorCobrar cuota_pc 
            INNER JOIN Contabilidad.CuentaPorCobrar cuenta_pc WITH (NOLOCK) ON cuenta_pc.idCuentaPorCobrar      = cuota_pc.idCuentaPorCobrar
            INNER JOIN dbo.CobroDetalle             cd WITH (NOLOCK) ON cd.idCuotaPorCobrar                     = cuota_pc.idCuotaPorCobrar
            INNER JOIN dbo.Cobro				    co WITH (NOLOCK) ON co.idCobro		                        = cd.idCobro
            INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON hc.idComprobanteIngreso   = co.idComprobanteIngreso AND hc.idCuentaPorCobrar =cuenta_pc.idCuentaPorCobrar
            INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera 
            LEFT JOIN dbo.SubEntidadFinanciera     sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera  = co.idSubEntidadFinanciera
            WHERE co.idComprobanteIngreso =  @id

            RETURN 
        END 
END
GO
