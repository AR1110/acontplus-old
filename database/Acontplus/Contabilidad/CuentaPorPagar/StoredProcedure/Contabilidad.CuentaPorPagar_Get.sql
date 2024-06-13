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

	-->Filters
	DECLARE @idProveedor INT
	       ,@idCuentaPorPagar INT 
           ,@CustomerId INT
           ,@checkboxFecha BIT 
		   ,@codEstab VARCHAR(100)
		   ,@codDoc VARCHAR(10)
		   ,@codEstado VARCHAR(5)
		   ,@dateStart DATETIME2 
		   ,@dateEnd DATETIME2
           ,@secuencial INT
    
    --> Variables
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

    --> Get
	IF @tipo = 1
		BEGIN
			SET @sql  = 'SELECT pp.idCuentaPorPagar
							   ,ISNULL(pp.idTiempoCredito,0)                as idTiempoCredito
							   ,pp.idProveedor                              as idProveedor
                               ,pp.codEstab
							   ,pp.identificacionProveedor                  as identificacion
							   ,pp.razonSocialProveedor                     as nombreFiscal
                               ,CASE pp.codDoc WHEN ''01'' THEN ''Factura''
											   WHEN ''03'' THEN ''Liquidacion'' 
											   WHEN ''FC'' THEN ''F.Fisica'' 
					                           WHEN ''DH'' THEN ''C.N.Habitual''
								END                                         as codDoc
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

			SET @params  = '@idEntidad   INT
						   ,@codEstab    VARCHAR(100)
						   ,@codDoc      VARCHAR(5)
						   ,@codEstado   VARCHAR(10)
						   ,@idProveedor INT
						   ,@dateStart   DATETIME2
						   ,@dateEnd     DATETIME2
                           ,@pageIndex   INT
                           ,@pageSize    INT
                           ,@secuencial  INT'

			SELECT @checkboxFecha = checkboxFecha
				  ,@codEstab      = codEstab
				  ,@codDoc        = codDoc
				  ,@codEstado     = codEstado
				  ,@idProveedor   = idProveedor
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

            IF @secuencial IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND  TRY_CAST(REVERSE(SUBSTRING(REVERSE(pp.serieComprobante),1, CHARINDEX(''-'', REVERSE(pp.serieComprobante))-1)) AS INT) = @secuencial '
                END

			SET @sql = @sql + 'ORDER BY pp.fechaEmision ASC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '
			
			EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad    = @idEntidad
				              ,@codEstab     = @codEstab
				              ,@codDoc       = @codDoc
				              ,@codEstado    = @codEstado
				              ,@idProveedor  = @idProveedor
				              ,@dateStart    = @dateStart
				              ,@dateEnd      = @dateEnd
                              ,@secuencial   = @secuencial
                              ,@pageIndex    = @pageIndex
                              ,@pageSize     = @pageSize
            RETURN 
		END 

    --> Cuotas del documento
	IF @tipo = 2
		BEGIN	
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
					AND c.estado = 1 AND ep.codigo !='PA'
				END 
              
            RETURN 
		END

	--> Forma Pago
	IF @tipo = 3
		BEGIN
			
            DECLARE @rucEmisor  VARCHAR(15)
			       ,@identificacionReceptor VARCHAR(13)
			       ,@cedula VARCHAR(10)

			DECLARE @pagoDocuments AS TABLE 
			(
				 idComprobante INT
				,codDoc VARCHAR(5)
			)

            SELECT @idProveedor = idProveedor FROM OPENJSON(@json)WITH(idProveedor INT)

			SELECT TOP 1 @rucEmisor = numeroIdentificacion, @CustomerId = CustomerId FROM Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor

			SELECT TOP 1 @identificacionReceptor = ruc , @cedula = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
				
			INSERT INTO @pagoDocuments(idComprobante,codDoc)
			SELECT p.idComprobante,td.codigoSri FROM Pago p WITH (NOLOCK) 
												INNER JOIN dbo.TipoDocumento     td WITH (NOLOCK) ON p.idTipoDocumento      = td.idTipoDocumento 
												INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = p.idEntidadFinanciera
												INNER JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK) ON ce.idComprobanteEgreso = p.idComprobanteEgreso
												WHERE ef.codigo = 'DOC' AND ce.estado = 1  AND ce.idEntidad = @idEntidad

				
            SELECT * FROM EntidadFinanciera WHERE estado = 1
				
            SELECT * FROM SubEntidadFinanciera WHERE idEntidad = @idEntidad AND estado = 1
				
            SELECT * FROM Banco WHERE estado = 1
				
            SELECT * FROM Ciudad WHERE estado = 1

            SELECT * FROM 
            (
			    SELECT de.idDocumentoElectronico                                                                                as idComprobante
				      ,(SELECT idTipoDocumento FROM dbo.TipoDocumento td (NOLOCK) WHERE td.codigo = 'RC')                       as idTipoDocumento
				      ,de.serieComprobante                                                                                      as nroDocumento
				      ,'Retención versión: 1.0.0'                                                                               as tipoDocumento
                      ,(SELECT rc.total FROM dbo.RetencionCompra rc  WITH (NOLOCK) WHERE rc.idRetencionCompra = de.idDocumento) as saldo
                      ,'' as numAutDocSustento
			    FROM FactElect.v_DocElectronico  de WITH (NOLOCK) 
			    WHERE de.codDoc      = '07' 
				  AND de.versionComp = '1.0.0' 
				  AND de.idEntidad   = @idEntidad
				  AND de.codEstado   = 4
				  AND de.CustomerId  = @CustomerId
				  AND de.idDocumentoElectronico NOT IN (SELECT idComprobante FROM @pagoDocuments t WHERE t.codDoc = '07')

                UNION ALL

			    SELECT de.idDocumentoElectronico                                                                                                      as idComprobante
				      ,(SELECT idTipoDocumento FROM dbo.TipoDocumento td WHERE td.codigo = 'RC')                                                      as idTipoDocumento
				      ,de.serieComprobante                                                                                                            as nroDocumento
				      ,'Retención versión: 2.0.0'                                                                                                     as tipoDocumento
                      ,(SELECT SUM(ats.valorRetenido) FROM FactElect.RetencionAtsRet ats WHERE ats.idRetencionAts = de.idDocumento)                   as saldo
                      ,(SELECT TOP 1 rs.numAutDocSustento FROM FactElect.RetAtsDocSustento rs WITH (NOLOCK) WHERE rs.idRetencionAts = de.idDocumento) as numAutDocSustento
			    FROM FactElect.v_DocElectronico  de 
			    WHERE de.codDoc = '07'
				  AND de.versionComp = '2.0.0'
				  AND de.codEstado = 4
				  AND de.idEntidad = @idEntidad
				  AND de.CustomerId = @CustomerId
				  AND de.idDocumentoElectronico NOT IN (SELECT idComprobante FROM @pagoDocuments t WHERE t.codDoc = '07')

                UNION ALL

			    SELECT d.idDocRelacionado                                                                      as idComprobante                          
				      ,(SELECT TOP 1 idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NC') as idTipoDocumento
				      ,dr.serieComprobante                                                                     as nroDocumento
				      ,'Nota Crédito Version:' + dr.versionComp                                                as tipoDocumento
                      ,ISNULL
                      ((
                        SELECT SUM(di.TaxValue + di.TaxBase) FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) WHERE di.DocumentoRecibidoId = dr.idDocumento

                      ),0) 
                      ,dr.claveAcceso                                                                          as numAutDocSustento
			    FROM factelect.DocRelacionado d
			    INNER JOIN Recepcion.DocumentoRecibido dr ON dr.idDocumento = d.idDocumentoRecibido
			    WHERE dr.codDoc = '04' 
				  AND dr.identificacionReceptor IN(@identificacionReceptor,@cedula)
				  AND dr.rucEmisor = @rucEmisor 
				  AND d.idDocRelacionado NOT IN (SELECT idComprobante FROM @pagoDocuments t WHERE t.codDoc = '04')

            ) as dt 
            WHERE dt.saldo > 0

            RETURN 
				
		END 

	IF @tipo = 4
		BEGIN 				
			SELECT
				ce.nroIdentificacion
				,ce.nombreFiscal
				,ce.total
				,tipoDocumento = 'CE-' + es.estab + '-' + Helper.F_Auto_Sequential(ce.nroDocumento) 
				,usuario = us.nombreUsuario
				,estado = IIF(ce.estado=1, 'ACTIVO', 'ANULADA')
				,fechaRegistro = FORMAT(ce.fechaRegistro, 'yyyy-MM-dd hh:mm')

			FROM Contabilidad.Historial_Pago hp WITH(NOLOCK)
			INNER JOIN ComprobanteEgreso     ce WITH(NOLOCK) ON ce.idComprobanteEgreso = hp.idComprobanteEgreso
			INNER JOIN Sri.Establecimiento   es WITH(NOLOCK) ON es.codEstab            = ce.codEstab 
			INNER JOIN Usuario               us WITH(NOLOCK) ON us.idUsuario           = ce.idUsuario
			WHERE hp.idCuentaPorPagar = @idCuentaPorPagar
			ORDER BY fechaRegistro 

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
