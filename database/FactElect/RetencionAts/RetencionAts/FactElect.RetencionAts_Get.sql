USE AcontPlus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-11-24
-- Description:	SP FOR GET DATA OVER RETENCIONES ATS
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT;

    --> Filters
	DECLARE @idEntidad INT,
        @userId INT;

    BEGIN TRY
        --> Data Json
	    SELECT @tipo =  tipo FROM OPENJSON(@json) WITH(tipo INT )

        --> Variables Globales 
        SELECT TOP 1 @idEntidad = idEntidad, @userId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        IF (@tipo = 1)
            BEGIN
                
                SET @tableNames = 'retenciones'
                -- Declare parameters
                DECLARE @pageIndex INT;
                DECLARE @pageSize INT;
                DECLARE @idEstablecimiento INT = 0;
                DECLARE @checkBoxFecha BIT = 0;
                DECLARE @fechaInicio DATE;
                DECLARE @fechaFin DATE;
                DECLARE @customerId INT = 0;
                DECLARE @idCliente INT = 0;
                DECLARE @idProveedor INT = 0;
                DECLARE @idPuntoEmision INT = 0;
                DECLARE @idTipoDocumento INT = 0;
                DECLARE @nroSecuencial VARCHAR(255) = '';
                DECLARE @infoAdicional VARCHAR(255) = '';
                DECLARE @idEstadoServicio INT = 0;
                DECLARE @idUsuario INT = 0;
                DECLARE @claveAcceso VARCHAR(255) = '';
                
                DECLARE @params NVARCHAR(1000) = N'@idEntidad INT, @pageIndex INT, @pageSize INT, @idEstablecimiento INT, @checkBoxFecha BIT, @fechaInicio DATE, @fechaFin DATE, @customerId INT, @idPuntoEmision INT, @idTipoDocumento INT, @nroSecuencial VARCHAR(255), @infoAdicional VARCHAR(255), @idEstadoServicio INT, @idUsuario INT, @claveAcceso VARCHAR(255)'
                DECLARE @countParams NVARCHAR(1000) = N'@idEntidad INT, @idEstablecimiento INT, @checkBoxFecha BIT, @fechaInicio DATE, @fechaFin DATE, @customerId INT, @idPuntoEmision INT, @idTipoDocumento INT, @nroSecuencial VARCHAR(255), @infoAdicional VARCHAR(255), @idEstadoServicio INT, @idUsuario INT, @claveAcceso VARCHAR(255), @totalRecords INT OUTPUT'
                DECLARE @sql NVARCHAR(MAX);

                SELECT @pageSize = pageSize
                  ,@pageIndex = pageIndex 
                  ,@idEstablecimiento = idEstablecimiento
                  ,@checkBoxFecha = checkBoxFecha
                  ,@fechaInicio = fechaInicio
                  ,@fechaFin = fechaFin
                  ,@idCliente = idCliente
                  ,@idProveedor = idProveedor
                  ,@idPuntoEmision = idPuntoEmision
                  ,@idTipoDocumento = idTipoDocumento
                  ,@nroSecuencial = nroSecuencial
                  ,@infoAdicional = infoAdicional
                  ,@idEstadoServicio = idEstadoServicio
                  ,@idUsuario = idUsuario
                  ,@claveAcceso = claveAcceso
                FROM OPENJSON(@json) WITH 
                (
                     pageIndex INT 
                    ,pageSize INT 
                    ,idEstablecimiento INT
                    ,checkBoxFecha BIT
                    ,fechaInicio DATETIME2
                    ,fechaFin DATETIME2
                    ,idCliente INT
                    ,idProveedor INT
                    ,idPuntoEmision INT
                    ,idTipoDocumento INT
                    ,nroSecuencial VARCHAR(255)
                    ,infoAdicional VARCHAR(255)
                    ,idEstadoServicio INT
                    ,idUsuario INT
                    ,claveAcceso VARCHAR(255)
                )

                IF (@idCliente > 0)
                    BEGIN
                        SET @customerId = (SELECT customerId FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente)
                    END
                
                 IF (@idProveedor > 0)
                    BEGIN
                        SET @customerId = (SELECT customerId FROM dbo.Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor)
                    END
                

                -- Construct the WHERE clause
                DECLARE @whereClause NVARCHAR(MAX) = ' WHERE de.idEntidad = @idEntidad '

                -- Add filters conditionally
                IF @idEstablecimiento > 0
                    SET @whereClause = @whereClause + 'AND de.idEstablecimiento = @idEstablecimiento '

                IF @checkBoxFecha = 1
                    SET @whereClause = @whereClause + 'AND de.fechaEmision BETWEEN @fechaInicio AND @fechaFin '

                IF @customerId > 0
                    SET @whereClause = @whereClause + 'AND de.customerId = @customerId '

                IF @idPuntoEmision > 0
                    SET @whereClause = @whereClause + 'AND de.idPuntoEmision = @idPuntoEmision '

                --IF @idTipoDocumento > 0
                --    SET @whereClause = @whereClause + 'AND de.idTipoDocumento = @idTipoDocumento '

                IF @nroSecuencial != ''
                    SET @whereClause = @whereClause + 'AND de.secuencial LIKE ''%'' + @nroSecuencial + ''%'' '

                --IF @infoAdicional != ''
                --    SET @whereClause = @whereClause + 'AND de.infoAdicional LIKE ''%'' + @infoAdicional + ''%'' '

                IF @idEstadoServicio > 0
                    SET @whereClause = @whereClause + 'AND de.idEstadoServicio = @idEstadoServicio '

                IF @idUsuario > 0
                    SET @whereClause = @whereClause + 'AND de.idUsuario = @idUsuario '

                IF @claveAcceso != ''
                    SET @whereClause = @whereClause + 'AND de.claveAcceso LIKE ''%'' + @claveAcceso + ''%'' '

                -- Get total count with a separate query
                DECLARE @countSql NVARCHAR(MAX) = 'SELECT @totalRecords = COUNT(*) 
                                                   FROM FactElect.RetencionAts r WITH (NOLOCK)
                                                   INNER JOIN FactElect.v_DocElectronico de WITH (NOLOCK) 
                                                   ON r.idDocumentoElectronico = de.idDocumentoElectronico ' + @whereClause
                DECLARE @totalRecords INT

                EXEC sp_executesql @countSql
                                  ,@countParams
                                  ,@idEntidad = @idEntidad
                                  ,@idEstablecimiento = @idEstablecimiento
                                  ,@checkBoxFecha = @checkBoxFecha
                                  ,@fechaInicio = @fechaInicio
                                  ,@fechaFin = @fechaFin
                                  ,@customerId = @customerId
                                  ,@idPuntoEmision = @idPuntoEmision
                                  ,@idTipoDocumento = @idTipoDocumento
                                  ,@nroSecuencial = @nroSecuencial
                                  ,@infoAdicional = @infoAdicional
                                  ,@idEstadoServicio = @idEstadoServicio
                                  ,@idUsuario = @idUsuario
                                  ,@claveAcceso = @claveAcceso
                                  ,@totalRecords = @totalRecords OUTPUT

                -- Main query for the data
                SET @sql = 'SELECT r.idRetencionAts
                                  ,r.idDocumentoElectronico
                                  ,de.isAutomatic
                                  ,de.codEstado
                                  ,de.codEstab
                                  ,de.estado
                                  ,CONVERT(VARCHAR, FORMAT(de.fechaEmision, ''dd/MM/yyyy''), 106) AS fechaEmision
                                  ,de.serieComprobante
                                  ,de.rucReceptor
                                  ,de.razonSocial
                                  ,de.claveAcceso
                                  ,CONVERT(VARCHAR, FORMAT(de.fechaAutorizacion, ''dd/MM/yyyy HH:mm:ss'')) AS fechaAutorizacion
                                  ,de.usuario
                                  ,de.emailReceptor
                                  ,(SELECT SUM(valorRetenido) FROM FactElect.RetencionAtsRet ret WHERE r.idRetencionAts = ret.idRetencionAts) as importeTotal
                                  ,de.versionComp
                                  ,' + CAST(@totalRecords AS NVARCHAR(20)) + ' as totalRecords
                                  
                            FROM FactElect.RetencionAts r WITH (NOLOCK)
                            INNER JOIN FactElect.v_DocElectronico de WITH (NOLOCK) 
                            ON r.idDocumentoElectronico = de.idDocumentoElectronico ' + @whereClause + '
                            ORDER BY r.idRetencionAts DESC 
                            OFFSET @pageSize*(@pageIndex-1) ROWS 
                            FETCH NEXT @pageSize ROWS ONLY'

                EXEC sp_executesql @sql
                                  ,@params 
                                  ,@idEntidad = @idEntidad
                                  ,@pageIndex = @pageIndex
                                  ,@pageSize = @pageSize
                                  ,@idEstablecimiento = @idEstablecimiento
                                  ,@checkBoxFecha = @checkBoxFecha
                                  ,@fechaInicio = @fechaInicio
                                  ,@fechaFin = @fechaFin
                                  ,@customerId = @customerId
                                  ,@idPuntoEmision = @idPuntoEmision
                                  ,@idTipoDocumento = @idTipoDocumento
                                  ,@nroSecuencial = @nroSecuencial
                                  ,@infoAdicional = @infoAdicional
                                  ,@idEstadoServicio = @idEstadoServicio
                                  ,@idUsuario = @idUsuario
                                  ,@claveAcceso = @claveAcceso
            END

	    --> DataForm
	    IF @tipo = 2
		    BEGIN
                SET @tableNames = 'tiposIdentificacion,tiposIdentificacionProveedor,tiposComprobante,sustentosTributarios,tiposPago,tiposRegimen,countries,paraisosFiscales,taxes,tarifaImpuestos,impuestosRetencion,porcentajesRetIva,conceptosRetencionAir,formasPago,estabs,infoAdicional';
			    
                SELECT idTipoIdentificacion, codigo, codigoSri, descripcion FROM TipoIdentificacion WITH (NOLOCK) WHERE estado = 1 

			    SELECT Id, Codigo, Descripcion FROM Sri.TipoIdentificacionProveedor WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion FROM Sri.TipoComprobante WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT dst.Id, dst.TipoComprobanteId, st.Codigo, st.Descripcion, dst.Id DocumentoSustentoTributarioId
                FROM Sri.SustentoTributario st  WITH (NOLOCK)
			    INNER JOIN Sri.DocumentoSustentoTributario dst  WITH (NOLOCK) ON st.Id = dst.SustentoTributarioId
			    WHERE st.[Enabled] = CAST(1 AS BIT)

                SELECT Id, Codigo, Descripcion FROM Sri.TipoPago WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion FROM Sri.TipoRegimenFiscalExterior WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion FROM Sri.Pais WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT)   

			    SELECT Id, Codigo, Descripcion FROM Sri.ParaisoFiscal WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT idImpuesto, codigo, Descripcion FROM Sri.Impuesto WITH (NOLOCK) WHERE estado = 1 

			    SELECT idImpuesto, idTarifaImpuesto, Codigo AS CodigoPorcentaje, Descripcion, Porcentaje AS Tarifa FROM Sri.TarifaImpuesto WITH (NOLOCK) WHERE estado = 1

			    SELECT Id, Codigo, Descripcion FROM Sri.ImpuestoRetencion  WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion, Porcentaje FROM Sri.PorcentajeRetencionIva  WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion, Porcentaje
                FROM Sri.ConceptoRetencionAir  WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT)
			
                SELECT Id, Codigo, Descripcion FROM Sri.FormaPago WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT idEstablecimiento
                      ,nombreComercial
                      ,codEstab
                      ,idPuntoEmision
                      ,estab + '-' + ptoEmi as ptoEmi
                      ,defaultEstab
                      ,defaultPtoEmi 
                      ,estab
                      ,dirEstablecimiento
                      ,contribuyente
                      ,obligadoContabilidad
                FROM v_PtoEmi_Asign WITH(NOLOCK) 
                WHERE idUsuarioRol = @userRoleId 
                ORDER BY defaultEstab DESC

                SELECT cd.idPuntoEmision
                      ,cd.infoAdicional 
                FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
                INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
                INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento 
                INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                WHERE es.idEntidad = @idEntidad
                  AND td.codigoSri = '07'
                  AND cd.infoAdicional IS NOT NULL
		    END

        --> FOR EMIT RETENCION ATS
	IF @tipo = 4
		BEGIN
			DECLARE @idCard VARCHAR(25);

            SET @tableNames = 'documents';

            SELECT @idCard = idCard FROM OPENJSON(@json) WITH (idCard VARCHAR(25));

            DECLARE @docsFounded AS TABLE(
				idDocumento INT NOT NULL,
                tipoComprobanteId INT NOT NULL,
                documentName VARCHAR(100),
                numDocSustento VARCHAR(50) NOT NULL,
				fechaEmisionDocSustento VARCHAR(25),
                numAutDocSustento VARCHAR(50) NOT NULL,
                importeTotal NUMERIC(18,2),
				isAutomatic BIT
			);

			INSERT INTO @docsFounded(idDocumento, tipoComprobanteId, documentName, numDocSustento,
            fechaEmisionDocSustento, numAutDocSustento, importeTotal, isAutomatic)
			SELECT fc.idFacturaCompra, (SELECT Id FROM Sri.TipoComprobante WHERE codigo = '01'),'Factura Física',(fc.puntoEmision + '-' +RIGHT('000000000'+convert(varchar(9), fc.nroDocumento),9))
            ,CONVERT(VARCHAR, fc.fechaEmision, 23),fc.nroAutorizacion,fc.total,CAST(0 AS BIT)
			FROM dbo.FacturaCompra       fc WITH (NOLOCK)
			INNER JOIN dbo.Proveedor     pr WITH (NOLOCK) ON pr.idProveedor = fc.idProveedor
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id          = pr.CustomerId
			WHERE fc.idEntidad = @idEntidad
			  AND fc.estado = 1
              AND cu.IDCard = @idCard 
			  AND fc.retencion = 0
             AND MONTH(CAST(fc.fechaEmision AS DATE)) IN (
                MONTH(GETDATE()), 
                MONTH(DATEADD(MONTH, -1, GETDATE()))
            )
            AND YEAR(CAST(fc.fechaEmision AS DATE)) IN (
                YEAR(GETDATE()), 
                YEAR(DATEADD(MONTH, -1, GETDATE()))
            )

			  AND REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) 
			    NOT IN 
                (
                        SELECT rd.numDocSustento
					    FROM FactElect.RetencionAts            ra WITH (NOLOCK)
                        INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = ra.idDocumentoElectronico
					    INNER JOIN FactElect.RetAtsDocSustento rd WITH (NOLOCK) ON ra.idRetencionAts         = rd.idRetencionAts
					    INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                        INNER JOIN sri.Establecimiento         es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
					    WHERE es.idEntidad   = @idEntidad 
                          AND ra.idProveedor = pr.idProveedor
                          AND ra.anuladaSri  = 0
			    ) 
            

			INSERT INTO @docsFounded(idDocumento, tipoComprobanteId, documentName, numDocSustento, fechaEmisionDocSustento, numAutDocSustento, importeTotal, isAutomatic)
			SELECT 
            dr.idDocumento,
            tc.Id,
            tc.Descripcion,
            dr.serieComprobante,
            FORMAT(CAST(dr.fechaEmision AS DATE), 'yyyy-MM-dd'),
            dr.claveAcceso,
            COALESCE(dr.importeTotal, 0),
            CAST(1 AS BIT)
            FROM 
                Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                INNER JOIN Sri.Establecimiento e WITH (NOLOCK)
                    ON e.idEstablecimiento = dr.idEstablecimiento
                INNER JOIN Sri.TipoComprobante tc WITH (NOLOCK) 
                    ON dr.codDoc = tc.Codigo
            WHERE 
                e.idEntidad = @idEntidad
                AND dr.estado = CAST(1 AS BIT)
                AND dr.rucEmisor = @idCard
                AND MONTH(CAST(dr.fechaEmision AS DATE)) IN (
                    MONTH(GETDATE()), 
                    MONTH(DATEADD(MONTH, -1, GETDATE()))
                )
                AND YEAR(CAST(dr.fechaEmision AS DATE)) IN (
                    YEAR(GETDATE()), 
                    YEAR(DATEADD(MONTH, -1, GETDATE()))
                )

                AND NOT EXISTS (
                    SELECT 1
                    FROM FactElect.RetencionAts ra WITH (NOLOCK)
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK)
                        ON de.idDocumentoElectronico = ra.idDocumentoElectronico
                    INNER JOIN dbo.Proveedor pr WITH (NOLOCK)
                        ON pr.idProveedor = ra.idProveedor
                    INNER JOIN FactElect.RetAtsDocSustento rd WITH (NOLOCK)
                        ON rd.idRetencionAts = ra.idRetencionAts
                    INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK)
                        ON pe.idPuntoEmision = de.idPuntoEmision
                    INNER JOIN sri.Establecimiento es WITH (NOLOCK)
                        ON es.idEstablecimiento = pe.idEstablecimiento
                    INNER JOIN Customer.Customer cu WITH (NOLOCK)
                        ON cu.Id = pr.CustomerId
                    WHERE 
                        es.idEntidad = @idEntidad
                        AND cu.IDCard = dr.rucEmisor
                        AND ra.anuladaSri = 0
                        AND rd.numDocSustento = REPLACE(dr.serieComprobante, '-', '')
                );
			SELECT * FROM @docsFounded ORDER BY fechaEmisionDocSustento DESC
            return
		END
 
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES('RetencionAts/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), 'FactElect.RetencionAts_Get', ERROR_LINE(), ERROR_MESSAGE(), @userId);
        THROW;
    END CATCH
END
GO
