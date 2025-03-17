USE [AcontPlus]
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
CREATE OR ALTER PROCEDURE Contabilidad.ControlCaja_Report @json VARCHAR(MAX)
AS
BEGIN
	
    -- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Sql Server
    DECLARE @tipo INT ,@sql NVARCHAR(MAX) ,@params NVARCHAR(MAX) 

    --> Filters
    DECLARE @idEntidadFinanciera INT ,@horaInicio DATETIME2 , @horaFin DATETIME2 ,@ckHora BIT ,@codDoc VARCHAR(10)

	DECLARE @idControlCaja INT 
	DECLARE @color VARCHAR(200) = '#000000'
	DECLARE @efectivoSistema DECIMAL(15,5)
	DECLARE @totalSistema DECIMAL(15,5)
	DECLARE @totalArqueo DECIMAL(15,5)
	DECLARE @efectivoArqueo DECIMAL(15,5)
	DECLARE @otros DECIMAL(15,5)
	DECLARE @chequesPosf DECIMAL(15,5)
	DECLARE @direfencia DECIMAL(15,5)
    DECLARE @sortByDefault INT
    DECLARE @sortOrder VARCHAR(3)
	
	DECLARE @tbDetalleCaja AS TABLE (
		id INT IDENTITY(1,1) NOT NULL
	   ,idEntidadFinanciera INT NOT NULL
       ,secuencial INT NOT NULL DEFAULT 1 
	   ,nroComprobante VARCHAR(100) NOT NULL
	   ,tipDoc VARCHAR(10) NOT NULL
	   ,nroDoc VARCHAR(25) NOT NULL
	   ,fechaEmision DATETIME NOT NULL
	   ,persona VARCHAR(200) NOT NULL
	   ,total NUMERIC(18,5) NOT NULL
	   ,totalAnterior NUMERIC(18,5) NOT NULL DEFAULT 0
       ,abono NUMERIC(18,5) NOT NULL 
	   ,saldo NUMERIC(18,5) DEFAULT 0 NOT NULL
	   ,pay  VARCHAR(150) NOT NULL
	   ,cobro BIT NOT NULL DEFAULT 1 
	   ,observacion VARCHAR(300) NULL
	)

	DECLARE @tbDocuments AS TABLE(
		 serieComprobante VARCHAR(25) NOT NULL
		,tipDoc VARCHAR(5) NOT NULL
		,total NUMERIC(18,5) NOT NULL
        ,totalAnterior NUMERIC(18,5) NOT NULL DEFAULT 0
		,abono NUMERIC(18,5) NOT NULL
	)

	SELECT @idControlCaja = idControlCaja ,@tipo = tipo, @sortByDefault=sortByDefault, @sortOrder=sortOrder FROM OPENJSON(@json) WITH (idControlCaja INT '$.id' , tipo INT, sortByDefault INT, sortOrder VARCHAR(3)) AS jsonValues

    --> Reporte Control Caja
    IF @tipo = 1 
        BEGIN 
	        INSERT INTO @tbDetalleCaja (nroComprobante,tipDoc,nroDoc,fechaEmision,persona,total,totalAnterior,abono,saldo,pay,idEntidadFinanciera,cobro,secuencial,observacion)
	        SELECT 'CI' + '-' + es.estab + '-' + RIGHT('000000000' + CAST(ci.nroDocumento AS VARCHAR(9)), 9)
		          ,IIF(cc.codDoc = '01','FV',cc.codDoc)
		          ,cc.serieComprobante 
		          ,cc.fechaEmision
		          ,cu.BusinessName                                                           as nombreFiscal
		          ,cc.importeTotal
                  ,hc.saldo
				  ,IIF(co.cobro = 1,hc.abono,0)                                              as abono
				  ,hc.saldo - IIF(co.cobro = 1,hc.abono,0)                                   as saldo
				  ,ISNULL(sf.descripcion,'') + ' ' +  IIF(co.posfechado = 1,'POSFECHADO','') as pay
		          ,co.idEntidadFinanciera
		          ,co.cobro
                  ,co.secuencial
                  ,ci.observacion
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.idEstablecimiento      = ci.idEstablecimiento
	        INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON hc.idComprobanteIngreso   = ci.idComprobanteIngreso
			INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar      = hc.idCuentaPorCobrar
            INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente			  = cc.idCliente
            INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro                = hc.idCobro
			 LEFT JOIN dbo.SubEntidadFinanciera     sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
            INNER JOIN Customer.Customer            cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId
			WHERE ci.idControlCaja = @idControlCaja  
              AND ci.estado = 1
	        
            INSERT INTO @tbDetalleCaja (nroComprobante,tipDoc,nroDoc,fechaEmision,persona,total,abono,pay,idEntidadFinanciera,observacion)
            SELECT 'CI' + '-' + es.estab + '-' + RIGHT('000000000' + CAST(ci.nroDocumento AS VARCHAR(9)), 9) as nroComprobante
                  ,'A'                                                                                       as tipoDoc
                  ,'A' + '-' + es.estab + '-' + RIGHT('000000000' + CAST(an.nroDoc AS VARCHAR(9)),9)         as nroDoc
                  ,an.fechaEmision
                  ,cu.BusinessName                                                                           as persona
                  ,an.valor                                                                                  as total
                  ,an.valor                                                                                  as abono
                  ,sf.descripcion                                                                            as pay
                  ,sf.idEntidadFinanciera
                  ,ci.observacion
            FROM dbo.Anticipo                   an WITH (NOLOCK)
            INNER JOIN dbo.ComprobanteIngreso   ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = an.idComprobanteIngreso
            INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = an.idSubEntidadFinanciera
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = ci.idEstablecimiento
            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = ci.CustomerId
            WHERE ci.estado = 1
              AND ci.idControlCaja = @idControlCaja

            INSERT INTO @tbDetalleCaja (nroComprobante,tipDoc,nroDoc,fechaEmision,persona,total,abono,pay,idEntidadFinanciera,observacion)
            SELECT 'CI' + '-' + es.estab + '-' + RIGHT('000000000' + CAST(ci.nroDocumento AS VARCHAR(9)),9) as nroComprobante
                  ,'IC'                                                                                     as tipoDoc
                  ,'IC' + '-' + es.estab + '-' + RIGHT('000000000' + CAST(mc.nroDoc AS VARCHAR(9)),9)       as nroDoc
                  ,mc.fechaEmision
                  ,cu.BusinessName                                                                          as persona
                  ,mc.valor                                                                                 as total
                  ,mc.valor                                                                                 as abono
                  ,sf.descripcion                                                                           as pay
                  ,sf.idEntidadFinanciera
                  ,ci.observacion
            FROM dbo.MovimientoCaja             mc WITH (NOLOCK)
            INNER JOIN dbo.ComprobanteIngreso   ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = mc.idComprobanteIngreso
            INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = ci.idEstablecimiento
            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = ci.CustomerId
            WHERE ci.estado = 1
              AND ci.idControlCaja = @idControlCaja

            INSERT INTO @tbDetalleCaja (nroComprobante,tipDoc,nroDoc,fechaEmision,persona,total,abono,pay,idEntidadFinanciera,observacion)
            SELECT 'CE' + '-' + es.estab + '-' + RIGHT('000000000' + CAST(ce.nroDocumento AS VARCHAR(9)), 9) as nroComprobante
                  ,'EC'                                                                                      as tipoDoc
                  ,'EC' + '-' + es.estab + '-' + RIGHT('000000000' + CAST(mc.nroDoc AS VARCHAR(9)),9)        as nroDoc
                  ,mc.fechaEmision
                  ,cu.BusinessName                                                                           as persona
                  ,mc.valor * -1                                                                             as total
                  ,mc.valor * -1                                                                             as abono
                  ,sf.descripcion                                                                            as pay
                  ,sf.idEntidadFinanciera
                  ,mc.observaciones
            FROM dbo.MovimientoCaja             mc WITH (NOLOCK)
            INNER JOIN dbo.ComprobanteEgreso    ce WITH (NOLOCK) ON ce.idComprobanteEgreso    = mc.idComprobanteEgreso
            INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = ce.idEstablecimiento
            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = ce.CustomerId
            WHERE ce.estado = 1
              AND ce.idControlCaja = @idControlCaja


	        INSERT INTO @tbDocuments (serieComprobante,tipDoc,abono,totalAnterior,total)
	        SELECT nroDoc,tipDoc,SUM(abono),MAX(totalAnterior),total FROM @tbDetalleCaja WHERE cobro = 1 GROUP BY tipDoc,nroDoc,total

	        -- ================================ FORMAS DE PAGOS TOTALIZADAS ========================================
	        SELECT @chequesPosf     = SUM(td.total)    FROM @tbDetalleCaja td INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = td.idEntidadFinanciera WHERE cobro = 0 AND ef.codigo = 'CHE'
	
	        SELECT @efectivoSistema = SUM(td.abono)    FROM @tbDetalleCaja td INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = td.idEntidadFinanciera WHERE cobro = 1 AND ef.codigo = 'EFE'
	
	        SELECT @otros           = SUM(td.abono)    FROM @tbDetalleCaja td INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = td.idEntidadFinanciera WHERE cobro = 1 AND ef.codigo NOT IN ('EFE','DOC')


	        -- ============================== CUADRES DE CAJA  ========================================================
	        SELECT @efectivoArqueo = totalArqueo FROM  dbo.ControlCaja WITH (NOLOCK) WHERE idControlCaja = @idControlCaja 

	        SELECT @totalSistema = ISNULL(@efectivoSistema,0) + ISNULL(@otros,0)
	
	        SELECT @totalArqueo  = ISNULL(@efectivoArqueo,0)  + ISNULL(@otros,0)

	        SELECT @direfencia = @totalArqueo - @totalSistema 

	        IF @direfencia != 0
		        BEGIN
			        SET	@color = '#FB0909'
		        END 

	        -- ====== INFORMACION PRINCIPAL DEL CONTROL DE CAJA =================================
	         SELECT 
		         nroControl         = cc.idControlCaja
		        ,caja               = ca.descripcion
		        ,apertura           = FORMAT(cc.fechaApertura, 'dd/MM/yyyy HH:mm')
		        ,cierre             = FORMAT(cc.fechaCierre, 'dd/MM/yyyy HH:mm') 
		        ,usuario            = cu.BusinessName
		        ,estado             = CASE WHEN cc.estado = 1 THEN 'ABIERTA' ELSE 'CERRADA' END
		        ,entrada            = CAST(cc.entrada AS numeric(15,2))
		        ,efectivoSistema    = CAST(ISNULL(@efectivoSistema,0) AS numeric(15,2))
		        ,efectivoArqueo     = CAST(ISNULL(@efectivoArqueo,0) AS numeric(15,2))
		        ,otros              = CAST(ISNULL(@otros,0) AS numeric(15,2))
		        ,totalSistema       = CAST(ISNULL(@totalSistema,0) AS numeric(15,2))
		        ,totalArqueo        = CAST(ISNULL(@totalArqueo,0)  AS numeric(15,2))
		        ,diferencia         = CAST(ISNULL(@direfencia,0)   AS numeric(15,2))
		        ,color              = @color
	         FROM dbo.ControlCaja          cc WITH (NOLOCK)
	         INNER JOIN dbo.Caja           ca WITH (NOLOCK) ON ca.idCaja    = cc.idCaja
	         INNER JOIN dbo.AsignacionCaja ac WITH (NOLOCK) ON ac.idCaja    = ca.idCaja
	         INNER JOIN dbo.Usuario        us WITH (NOLOCK) ON us.idUsuario = ac.idUsuario
              LEFT JOIN Customer.Customer  cu WITH (NOLOCK) ON cu.Id        = us.CustomerId
	         WHERE cc.idControlCaja = @idControlCaja

	
	         -----------------------------------RESUMEN TOTALIZADO EN LAS FORMAS DE PAGO----------------------------------------
	         SELECT  
		         formaPago = ef.descripcion
	            ,ingreso   = CAST(ISNULL((SELECT sum(abono) FROM @tbDetalleCaja WHERE tipDoc != 'EC' AND idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1),0) AS numeric(15,2))
		        ,egreso    = CAST(ISNULL((SELECT sum(abono) FROM @tbDetalleCaja WHERE tipDoc  = 'EC' AND idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1),0) AS numeric(15,2))		
		        ,total     = CAST(ISNULL((SELECT sum(abono) FROM @tbDetalleCaja WHERE idEntidadFinanciera = ef.idEntidadFinanciera AND cobro = 1),0) AS numeric(15,2))		
	         FROM EntidadFinanciera ef WITH (NOLOCK)
	         WHERE ef.estado = 1 
               AND ef.codigo NOT IN ('DOC')
	         ORDER BY ef.fechaRegistro ASC
	         -------------------------------------------------END----------------------------------------------------------------


	         -----------------------------------RESUMEN TOTALIZADO DE DOCUMENTOS--------------------------------------------------

	         SELECT 
		        tipDoc   = td.descripcion
	           ,total    = CAST(ISNULL((SELECT SUM(IIF(tipDoc IN ('FV','NE'),totalAnterior,total)) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0) AS numeric(15,2))
	           ,abono    = CAST(ISNULL((SELECT SUM(ac.abono) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0) AS numeric(15,2))
	           ,saldo    = CAST(ISNULL((SELECT SUM(IIF(tipDoc IN ('FV','NE'),totalAnterior,total)) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0)  - ISNULL((SELECT SUM(ac.abono) FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0) AS numeric(18,5))
	           ,cantidad = (ISNULL((    SELECT COUNT(*)      FROM @tbDocuments ac WHERE ac.tipDoc = td.codigo),0))
             FROM dbo.TipoDocumento td WITH (NOLOCK)
	         WHERE td.codigo IN ('FV','NE','IC','EC')
	 
	         -------------------------------------------------END-----------------------------------------------------------------

	          -----------------------------HISTORIAL DE MOVIMIENTO POR DOCUMENTO DEL CONTROL DE CAJA-----------------------------
	          SELECT cc.codDoc                                             as tipoDoc
	                ,cc.serieComprobante                                   as nroDoc
		            ,FORMAT(cc.fechaEmision, 'dd/MM/yyyy HH:mm')           as fechaEmision
		            ,cu.BusinessName                                       as cliente
		            ,CAST(co.abono as numeric(18,2))                       as total
	         FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
	         INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
	         INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
             INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = co.idCuentaPorCobrar
             INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente            = cc.idCliente
             INNER JOIN Customer.Customer            cu WITH (NOLOCK) ON cu.Id                   = cl.CustomerId
	         WHERE ci.idControlCaja = @idControlCaja 
               AND ci.estado = 1 
               AND ef.codigo = 'DOC' 
	 

	         ------------------------------------------------END----------------------------------------------------------------
	         SELECT 
	               nroComprobante 
		          ,tipDoc = IIF(tipDoc='FV','FE',tipDoc)
		          ,nroDoc
		          ,fechaEmision = dbo.AFTConvertDate(fechaEmision)+dbo.AFTConvertHora(fechaEmision)
		          ,persona
		          ,total = CAST(total AS numeric(15,2))
                  ,CAST(IIF(tipDoc = 'FV' OR tipDoc = 'NE',totalAnterior,total) AS numeric(18,2)) as saldoAnterior
		          ,abono = CAST(abono AS numeric(15,2))
		          ,saldo = CAST(saldo AS numeric(15,2))
		          ,pay =   pay
                  ,observacion
	         FROM @tbDetalleCaja
	         WHERE cobro = 1
	         ORDER BY nroComprobante,secuencial,tipDoc,nroDoc ASC 

	         SELECT chequePosfechado = CAST(ISNULL(@chequesPosf,0)as numeric(18,2))
	               ,anticipos        = CAST(ISNULL((SELECT SUM(dc.total) FROM @tbDetalleCaja dc WHERE dc.tipDoc = 'A' ),0)as numeric(18,2))

            
             RETURN 
        END 

    --> Detalles de Control de Caja
    IF @tipo = 2
        BEGIN
            
            SELECT @idEntidadFinanciera = idEntidadFinanciera
                  ,@horaInicio          = horaInicio
                  ,@horaFin             = horaFin
                  ,@ckHora              = ckHora
                  ,@codDoc              = codDoc
            FROM OPENJSON(@json) WITH 
            (
                idEntidadFinanciera INT
               ,horaInicio          DATETIME2
               ,horaFin             DATETIME2
               ,ckHora              BIT
               ,codDoc              VARCHAR(10)
            )

            SET @params = '@idControlCaja       INT
                          ,@idEntidadFinanciera INT
                          ,@horaInicio          DATETIME2
                          ,@horaFin             DATETIME2
                          ,@codDoc              VARCHAR(10)'

            SET @sql = 'SELECT * FROM 
                        (
                            SELECT ''CI'' + ''-'' + es.estab + ''-'' + Helper.F_Auto_Sequential(ci.nroDocumento)     as nroComprobante
		                          ,IIF(cc.codDoc = ''01'',''FV'',cc.codDoc)                                          as doc
		                          ,cc.serieComprobante                                                               as nroDoc
		                          ,FORMAT(cc.fechaEmision, ''dd/MM/yyyy HH:mm'')                                     as fechaEmision
		                          ,cu.BusinessName                                                                   as agenteEconomico
		                          ,CAST(cc.importeTotal as numeric(18,2))                                            as total
                                  ,CAST(hc.saldo as numeric(18,2))                                                   as saldoAnterior
				                  ,CAST(IIF(co.cobro = 1,hc.abono,0) as numeric(18,2))                               as abono
				                  ,CAST(hc.saldo - IIF(co.cobro = 1,hc.abono,0) as numeric(18,2))                    as saldo
				                  ,ISNULL(sf.descripcion,'''') + '' '' +  IIF(co.posfechado = 1,''POSFECHADO'','''') as pay
		                          ,co.idEntidadFinanciera                                                            as idEntidadFinanciera
                                  ,FORMAT(ci.fechaRegistro, ''dd/MM/yyyy HH:mm'')                                    as fechaComprobante
			                FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			                INNER JOIN Sri.Establecimiento          es WITH (NOLOCK) ON es.idEstablecimiento      = ci.idEstablecimiento
	                        INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON hc.idComprobanteIngreso   = ci.idComprobanteIngreso
			                INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro                = hc.idCobro
			                INNER JOIN Contabilidad.CuentaPorCobrar cc WITH (NOLOCK) ON cc.idCuentaPorCobrar      = hc.idCuentaPorCobrar
			                INNER JOIN dbo.Cliente                  cl WITH (NOLOCK) ON cl.idCliente			  = cc.idCliente
			                 LEFT JOIN dbo.SubEntidadFinanciera     sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
                            INNER JOIN Customer.Customer            cu WITH (NOLOCK) ON cu.Id                     = cl.CustomerId
			                WHERE ci.idControlCaja = @idControlCaja  
                              AND ci.estado = 1

                            UNION ALL 

                            SELECT ''CI'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CAST(ci.nroDocumento AS VARCHAR(9)),9) as nroComprobante
                                  ,''A''                                                                                            as tipoDoc
                                  ,''A'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CAST(an.nroDoc AS VARCHAR(9)),9)        as nroDoc
                                  ,FORMAT(an.fechaEmision, ''dd/MM/yyyy HH:mm'')                                                    as fechaEmision
                                  ,cu.BusinessName                                                                                  as persona
                                  ,an.valor                                                                                         as total
                                  ,an.valor                                                                                         as saldoAnterior
                                  ,an.valor                                                                                         as abono
                                  ,0
                                  ,sf.descripcion                                                                                   as pay
                                  ,sf.idEntidadFinanciera
                                  ,FORMAT(ci.fechaRegistro, ''dd/MM/yyyy HH:mm'')                                                   as fechaComprobante
                            FROM dbo.Anticipo                   an WITH (NOLOCK)
                            INNER JOIN dbo.ComprobanteIngreso   ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = an.idComprobanteIngreso
                            INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = an.idSubEntidadFinanciera
                            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = ci.idEstablecimiento
                            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = ci.CustomerId
                            WHERE ci.estado = 1
                              AND ci.idControlCaja = @idControlCaja
                            
                            UNION ALL

                            SELECT ''CI'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CAST(ci.nroDocumento AS VARCHAR(9)),9) as nroComprobante
                                  ,''IC''                                                                                           as tipoDoc
                                  ,''IC'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CAST(mc.nroDoc AS VARCHAR(9)),9)       as nroDoc
                                  ,FORMAT(mc.fechaEmision, ''dd/MM/yyyy HH:mm'')                                                    as fechaEmision
                                  ,cu.BusinessName                                                                                  as persona
                                  ,mc.valor                                                                                         as total
                                  ,mc.valor                                                                                         as saldoAnterior
                                  ,mc.valor                                                                                         as abono
                                  ,0
                                  ,sf.descripcion                                                                                   as pay
                                  ,sf.idEntidadFinanciera
                                  ,FORMAT(ci.fechaRegistro, ''dd/MM/yyyy HH:mm'')                                                   as fechaComprobante
                            FROM dbo.MovimientoCaja             mc WITH (NOLOCK)
                            INNER JOIN dbo.ComprobanteIngreso   ci WITH (NOLOCK) ON ci.idComprobanteIngreso   = mc.idComprobanteIngreso
                            INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
                            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = ci.idEstablecimiento
                            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = ci.CustomerId
                            WHERE ci.estado = 1
                              AND ci.idControlCaja = @idControlCaja


                            UNION ALL 
                            
                            SELECT ''CE'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CAST(ce.nroDocumento AS VARCHAR(9)), 9) as nroComprobante
                                  ,''EC''                                                                                            as tipoDoc
                                  ,''EC'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CAST(mc.nroDoc AS VARCHAR(9)),9)        as nroDoc
                                  ,FORMAT(mc.fechaEmision, ''dd/MM/yyyy HH:mm'')                                                     as fechaEmision
                                  ,cu.BusinessName                                                                                   as persona
                                  ,mc.valor * -1                                                                                     as total
                                  ,mc.valor * -1                                                                                     as saldoAnterior
                                  ,mc.valor * -1                                                                                     as abono
                                  ,0
                                  ,sf.descripcion                                                                                    as pay
                                  ,sf.idEntidadFinanciera
                                  ,FORMAT(ce.fechaRegistro, ''dd/MM/yyyy HH:mm'')                                                    as fechaComprobante
                            FROM dbo.MovimientoCaja             mc WITH (NOLOCK)
                            INNER JOIN dbo.ComprobanteEgreso    ce WITH (NOLOCK) ON ce.idComprobanteEgreso    = mc.idComprobanteEgreso
                            INNER JOIN dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = mc.idSubEntidadFinanciera
                            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = ce.idEstablecimiento
                            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = ce.CustomerId
                            WHERE ce.estado = 1
                              AND ce.idControlCaja = @idControlCaja

                        )as cd WHERE cd.nroComprobante IS NOT NULL '

            IF @idEntidadFinanciera > 0
                BEGIN
                    SET @sql = @sql + 'AND cd.idEntidadFinanciera = @idEntidadFinanciera '
                END 

            IF @ckHora = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(cd.fechaComprobante as datetime) BETWEEN CAST(@horaInicio as datetime) AND CAST(@horaFin as datetime) '                  
                END 

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND cd.doc = @codDoc '
                END 

            SET @sql = @sql + 'ORDER BY cd.pay,cd.doc,cd.fechaEmision ASC '
                
            SELECT nroControl = cc.idControlCaja
		          ,caja       = ca.descripcion
		          ,apertura   = FORMAT(cc.fechaApertura, 'dd/MM/yyyy HH:mm')
		          ,cierre     = FORMAT(cc.fechaCierre, 'dd/MM/yyyy HH:mm') 
		          ,usuario    = cu.BusinessName
		          ,estado     = CASE WHEN cc.estado = 1 THEN 'ABIERTA' ELSE 'CERRADA' END
	         FROM dbo.ControlCaja          cc WITH (NOLOCK)
	         INNER JOIN dbo.Caja           ca WITH (NOLOCK) ON ca.idCaja    = cc.idCaja
	         INNER JOIN dbo.AsignacionCaja ac WITH (NOLOCK) ON ac.idCaja    = ca.idCaja
	         INNER JOIN dbo.Usuario        us WITH (NOLOCK) ON us.idUsuario = ac.idUsuario
              INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = us.CustomerId
	         WHERE cc.idControlCaja = @idControlCaja

            EXEC sp_executesql @sql
						      ,@params 
                              ,@idControlCaja       = @idControlCaja
                              ,@idEntidadFinanciera = @idEntidadFinanciera
                              ,@horaInicio          = @horaInicio
                              ,@horaFin             = @horaFin
                              ,@codDoc              = @codDoc

            RETURN 
        END 

END
GO
