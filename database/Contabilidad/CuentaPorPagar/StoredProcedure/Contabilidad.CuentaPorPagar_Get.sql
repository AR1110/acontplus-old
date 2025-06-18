USE [Acontplus]
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
-- Author:		Alexis Ramirez
-- Create date: 03/14/2023
-- Description:	SP para lisatar las cuentas por pagar.
-- =============================================

--  Contabilidad.CuentaPorPagar_Get 44, '{"tipo":1}'
CREATE OR ALTER PROCEDURE Contabilidad.CuentaPorPagar_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH 

	 --> Global
    DECLARE @idEntidad INT ,@tipo INT 
	
    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

	--> Variables generales
	DECLARE @idCuentaPorPagar INT
    
    --> Variables
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

    --> Get
	IF @tipo = 1
		BEGIN
            -->Filters
	        DECLARE @idProveedor INT
                   ,@subcategoryId INT
                   ,@checkboxFecha BIT 
		           ,@codEstab VARCHAR(100)
		           ,@codDoc VARCHAR(10)
		           ,@codEstado VARCHAR(5)
		           ,@dateStart DATETIME2 
		           ,@dateEnd DATETIME2
                   ,@secuencial INT

			SET @sql  = 'SELECT pp.idCuentaPorPagar
                               ,pp.idDocumento
							   ,ISNULL(pp.idTiempoCredito,0)                as idTiempoCredito
							   ,pp.idProveedor                              as idProveedor
                               ,pp.codEstab
							   ,pp.identificacionProveedor                  as identificacion
							   ,pp.razonSocialProveedor                     as nombreFiscal
                               ,CASE pp.codDoc WHEN ''01'' THEN ''Factura''
											   WHEN ''03'' THEN ''Liquidacion'' 
											   WHEN ''FC'' THEN ''F.Fisica'' 
					                           WHEN ''DH'' THEN ''C.N.Habitual''
								END                                         as nombreDoc
							   ,pp.codDoc
                               ,pp.serieComprobante
							   ,Format(pp.fechaEmision, ''yyyy-MM-dd'')     as fechaEmision
							   ,Format(pp.fechaVencimiento, ''yyyy-MM-dd'') as fechaVencimiento 
							   ,pp.importeTotal 
							   ,ISNULL(pp.abono,0)                          as abono
							   ,ISNULL(pp.saldo,0)                          as saldo
							   ,ISNULL(pp.diasCredito,0)                    as diasCredito
							   ,pp.estado
							   ,pp.codEstado                                as codPago
                               ,pp.numAutDocSustento
                               ,COUNT(*) OVER()                             as totalRecords
					    FROM v_CuentaPorPagar pp WITH (NOLOCK)
					    WHERE pp.idEntidad = @idEntidad '

			SET @params  = '@idEntidad     INT
						   ,@codEstab      VARCHAR(100)
						   ,@codDoc        VARCHAR(5)
						   ,@codEstado     VARCHAR(10)
						   ,@idProveedor   INT
                           ,@subcategoryId INT
						   ,@dateStart     DATETIME2
						   ,@dateEnd       DATETIME2
                           ,@pageIndex     INT
                           ,@pageSize      INT
                           ,@secuencial    INT'

			SELECT @checkboxFecha = checkboxFecha
				  ,@codEstab      = codEstab
				  ,@codDoc        = codDoc
				  ,@codEstado     = codEstado
				  ,@idProveedor   = idProveedor
                  ,@subcategoryId = subcategoryId
				  ,@dateStart     = dateStart
				  ,@dateEnd       = dateEnd
                  ,@secuencial    = secuencial
                  ,@pageSize      = pageSize
				  ,@pageIndex     = pageIndex
			FROM OPENJSON(@json) WITH 
            (
				 checkboxFecha BIT 
				,codEstab      VARCHAR(100) 
				,codDoc        VARCHAR(10)
				,codEstado     VARCHAR(5)
				,idProveedor   INT
                ,subcategoryId INT
				,dateStart     DATETIME2 
				,dateEnd       DATETIME2
                ,secuencial    INT
                ,pageSize      INT
                ,pageIndex     INT
			)

			IF @checkboxFecha = 1
				BEGIN
					SET @sql = @sql + 'AND CAST(pp.fechaEmision AS DATE) BETWEEN CAST(@dateStart AS DATE) AND CAST(@dateEnd AS DATE) '
				END 

			IF @codEstab IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND pp.codEstab = @codEstab '
				END 

			IF @codDoc IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND pp.codDoc= @codDoc '
				END 
            ELSE
                BEGIN
                    SET @sql = @sql + 'AND pp.codDoc NOT IN (''04'',''07'') ' 
                END 

			IF @codEstado IS NOT NULL
				BEGIN
                    IF @codEstado = 'NPA'  
						BEGIN
							SET @sql = @sql + 'AND pp.codEstado IN (''PE'',''PP'') '
						END
					ELSE 
						BEGIN
							SET @sql = @sql + 'AND pp.codEstado = @codEstado '
						END
				END 

			IF @idProveedor > 0
				BEGIN
					SET @sql = @sql + 'AND pp.idProveedor= @idProveedor '
				END 

            IF @subcategoryId > 0
                BEGIN
                    SET @sql = @sql + 'AND pp.subcategoryId = @subcategoryId '
                END 

            IF @secuencial IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND  TRY_CAST(REVERSE(SUBSTRING(REVERSE(pp.serieComprobante),1, CHARINDEX(''-'', REVERSE(pp.serieComprobante))-1)) AS INT) = @secuencial '
                END

			SET @sql = @sql + 'ORDER BY pp.fechaEmision ASC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '
			
			EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad     = @idEntidad
				              ,@codEstab      = @codEstab
				              ,@codDoc        = @codDoc
				              ,@codEstado     = @codEstado
				              ,@idProveedor   = @idProveedor
                              ,@subcategoryId = @subcategoryId
				              ,@dateStart     = @dateStart
				              ,@dateEnd       = @dateEnd
                              ,@secuencial    = @secuencial
                              ,@pageIndex     = @pageIndex
                              ,@pageSize      = @pageSize
            RETURN 
		END 

    --> Cuotas del documento
	IF @tipo = 2
		BEGIN	
            
            SELECT @idCuentaPorPagar = idCuentaPorPagar FROM OPENJSON(@json) WITH (idCuentaPorPagar INT)

			IF EXISTS (SELECT 1 FROM OPENJSON(@json) WITH (codPago VARCHAR(5)) WHERE codPago IS NULL)
				BEGIN 
					SELECT c.idCuotaPorPagar
                          ,c.idCuentaPorPagar
						  ,Format(c.fechaVencimiento, 'yyyy-MM-dd') as fechaVencimiento
						  ,c.nroCuota
						  ,c.cuota
						  ,c.abono
						  ,c.saldo
						  ,ep.descripcion
						  ,ep.codigo
					FROM Contabilidad.CuotaPorPagar c WITH (NOLOCK) 
					INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago = c.idEstadoPago
					WHERE c.idCuentaPorPagar = @idCuentaPorPagar	
					  AND c.estado = 1
				END 
			ELSE 
				BEGIN 
					SELECT c.idCuotaPorPagar
                          ,c.idCuentaPorPagar
						  ,Format(c.fechaVencimiento, 'yyyy-MM-dd') as fechaVencimiento
						  ,c.nroCuota
						  ,c.cuota
						  ,c.abono
						  ,c.saldo
						  ,ep.descripcion
						  ,ep.codigo
					FROM Contabilidad.CuotaPorPagar c WITH (NOLOCK) 
					INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago = c.idEstadoPago
					WHERE c.idCuentaPorPagar = @idCuentaPorPagar	
					  AND c.estado = 1
                      AND ep.codigo !='PA'
				END 
              
            RETURN 
		END

	IF @tipo = 4
		BEGIN 	
        
             SELECT @idCuentaPorPagar = idCuentaPorPagar FROM OPENJSON(@json) WITH (idCuentaPorPagar INT)

			--SELECT cu.IdCard                                                           as nroIdentificacion
			--	  ,cu.businessName                                                     as nombreFiscal
			--	  ,ce.total
			--	  ,'CE-' + es.estab + '-' + Helper.F_Auto_Sequential(ce.nroDocumento)  as tipoDocumento
			--	  ,us.nombreUsuario                                                    as usuario
			--	  ,IIF(ce.estado = 1, 'ACTIVO', 'ANULADA')                             as estado
			--	  ,FORMAT(ce.fechaRegistro, 'yyyy-MM-dd hh:mm')                        as fechaRegistro
			--FROM Contabilidad.Historial_Pago hp WITH (NOLOCK)
			--INNER JOIN ComprobanteEgreso     ce WITH (NOLOCK) ON ce.idComprobanteEgreso = hp.idComprobanteEgreso
			--INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento   = ce.idEstablecimiento 
			--INNER JOIN Usuario               us WITH (NOLOCK) ON us.idUsuario           = ce.idUsuario
   --         INNER JOIN Customer.Customer     cu WITH (NOLOCK) ON cu.Id                  = ce.CustomerId
			--WHERE hp.idCuentaPorPagar = @idCuentaPorPagar
			--ORDER BY fechaRegistro 

            SELECT 
                serieComprobante
                ,fechaEmision
                ,identificacionProveedor
                ,razonSocialProveedor
                ,importeTotal
                ,abono
                ,saldo
            FROM v_CuentaPorPagar   WITH(NOLOCK)
            WHERE idCuentaPorPagar = @idCuentaPorPagar

         
            SELECT 
                ce.idComprobanteEgreso
                ,fechaEmision = FORMAT(ce.fechaRegistro, 'dd/MM/yyyy hh:mm')  
                ,serieComprobante = 'CE' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ce.nroDocumento)  
                ,ce.total 
                ,nombreEstado = CASE ce.estado WHEN 1 THEN 'ACTIVO' ELSE 'ANULADO' END  
                ,ce.estado   
                ,es.codEstab
            FROM dbo.ComprobanteEgreso ce WITH (NOLOCK)
            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) 
                ON es.idEstablecimiento = ce.idEstablecimiento
            WHERE EXISTS (
                SELECT 1
                FROM Contabilidad.Historial_Pago hp
                WHERE hp.idComprobanteEgreso = ce.idComprobanteEgreso
                AND hp.idCuentaPorPagar = @idCuentaPorPagar
            ) 
                AND ce.estado = 1;


            SELECT 
                ce.idComprobanteEgreso,
                p.idPago,
                nombrePosfechado = CASE p.posfechado WHEN 1 THEN 'SI' ELSE 'NO' END,     
                fechaEmision = FORMAT(p.fechaEmision, 'dd/MM/yyyy hh:mm'),     
                nombreFormaPago = ISNULL(sf.descripcion, ef.descripcion),              
                nombreBanco = ISNULL(bc.descripcion, '-------------'),     
                p.valor,
                p.abono,
                p.vuelto,
                codigoFormaPago = ef.codigo,
                p.nro,
                p.lote,
                p.aprobacion,
                p.referencia
                
            FROM
                Contabilidad.Historial_Pago hp WITH (NOLOCK) 
            INNER JOIN 
                dbo.ComprobanteEgreso ce WITH (NOLOCK) ON ce.idComprobanteEgreso = hp.idComprobanteEgreso 
            INNER JOIN 
                dbo.Pago p WITH (NOLOCK) ON p.idPago = hp.idPago
            INNER JOIN 
                dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = p.idEntidadFinanciera
            LEFT JOIN 
                dbo.SubEntidadFinanciera sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = p.idSubEntidadFinanciera
            LEFT JOIN 
                dbo.Banco bc WITH (NOLOCK) ON bc.idBanco = p.idBanco
            WHERE 
                hp.idCuentaPorPagar = @idCuentaPorPagar
                AND ce.estado = 1
            ORDER BY 
                p.secuencial ASC;


            SELECT 
                p.idPago
                ,cxp.nroCuota
                ,fechaVencimiento = FORMAT(cxp.fechaVencimiento, 'dd/MM/yyyy') 
                ,cxp.cuota
                ,pd.abono
                ,saldo = pd.saldo - pd.abono
            FROM dbo.PagoDetalle pd WITH (NOLOCK)
            INNER JOIN dbo.Pago p WITH (NOLOCK) 
                ON p.idPago = pd.idPago
            INNER JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK) 
                ON ce.idComprobanteEgreso = p.idComprobanteEgreso
            INNER JOIN Contabilidad.CuotaPorPagar cxp WITH (NOLOCK) 
                ON cxp.idCuotaPorPagar = pd.idCuotaPorPagar
            WHERE 
                cxp.idCuentaPorPagar = @idCuentaPorPagar
                AND ce.estado = 1
            ORDER BY 
                p.secuencial ASC,   
                cxp.nroCuota ASC;    





		END 
	
    --> Data Form Cuotas 
    IF @tipo = 5 
        BEGIN
            SELECT idTiempoCredito
	                ,descripcion
	                ,diasCredito
	                ,numeroCuota 
	        FROM TiempoCredito WITH (NOLOCK) 
	        WHERE idEntidad = @idEntidad 
              AND gestion = 0
              AND estado = 1
            RETURN 
        END 

    --> Filters
    IF @tipo = 6
        BEGIN
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol ORDER BY defaultEstab DESC

            SELECT idEstadoPago,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('A','NPA','PA','PFC')

            SELECT idTipoDocumento
                  ,descripcion
                  ,CASE codigo WHEN 'FE' THEN '01' 
                               WHEN 'FF' THEN 'FC'
                               WHEN 'IV' THEN 'DH'
                               WHEN 'LC' THEN '03'
                               ELSE ''
                   END as codDoc 
            FROM Inventario.TipoDocumento WITH (NOLOCK) 
            WHERE codigo IN ('FF','FE','IV','LC')
            
            SELECT Id         as id 
                  ,CategoryId as categoryId
                  ,[Name]     as [name]
                  ,Code       as code
            FROM Contabilidad.subcategory  WITH (NOLOCK) WHERE companyId = @idEntidad AND Enabled = 1

            RETURN 
        END 
    
END
GO
