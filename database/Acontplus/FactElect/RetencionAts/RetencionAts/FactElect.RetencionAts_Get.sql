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
        SELECT TOP 1 @idEntidad = idEntidad, @userId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        IF (@tipo = 1)
            BEGIN
                
                SET @tableNames = 'retenciones'
                -- Declare parameters
                DECLARE @textSearch VARCHAR(500) = '' -- Example value
                DECLARE @checkTextSearch BIT = 0 -- Example value
                DECLARE @pageIndex INT;-- Example value
                DECLARE @pageSize INT;-- Example value
                DECLARE @params NVARCHAR(500) = N'@idEntidad INT, @textSearch VARCHAR(500), @pageIndex INT, @pageSize INT'
                DECLARE @sql NVARCHAR(MAX);

                SELECT @pageSize    = pageSize
                  ,@pageIndex       = pageIndex 
                  ,@checkTextSearch = checkTextSearch 
                  ,@textSearch      = (REPLACE(textSearch,SPACE(1),'%'))
                FROM OPENJSON(@json) WITH 
                (
                     pageIndex       INT 
                    ,pageSize        INT 
                    ,checkTextSearch BIT  
                    ,textSearch      VARCHAR(255)
                )

                -- Construct the WHERE clause
                DECLARE @whereClause NVARCHAR(MAX) = ' WHERE de.idEntidad = @idEntidad '

                IF @checkTextSearch = 1
                    SET @whereClause = @whereClause + 'AND de.rucReceptor + '' '' + de.razonSocial + '' '' + de.claveAcceso LIKE ''%''+@textSearch+''%'' '

                -- Get total count with a separate query
                DECLARE @countSql NVARCHAR(MAX) = 'SELECT @totalRecords = COUNT(*) 
                                                   FROM FactElect.RetencionAts r WITH (NOLOCK)
                                                   INNER JOIN FactElect.v_DocElectronico de WITH (NOLOCK) 
                                                   ON r.idDocumentoElectronico = de.idDocumentoElectronico ' + @whereClause
                DECLARE @totalRecords INT

                EXEC sp_executesql @countSql
                                  ,N'@idEntidad INT, @textSearch VARCHAR(500), @totalRecords INT OUTPUT'
                                  ,@idEntidad = @idEntidad
                                  ,@textSearch = @textSearch
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
                                  ,@idEntidad  = @idEntidad
                                  ,@textSearch = @textSearch
                                  ,@pageIndex  = @pageIndex
                                  ,@pageSize   = @pageSize
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

			    SELECT idImpuesto, idTarifaImpuesto, Codigo, Descripcion FROM Sri.TarifaImpuesto WITH (NOLOCK) WHERE estado = 1

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
              AND MONTH(fc.fechaEmision) = MONTH(GETDATE())
              AND YEAR(fc.fechaEmision) = YEAR(GETDATE())
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
                AND MONTH(CAST(dr.fechaEmision AS DATE)) = MONTH(GETDATE())
                AND YEAR(CAST(dr.fechaEmision AS DATE)) = YEAR(GETDATE())
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
        VALUES('RetencionAts/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
        THROW;
    END CATCH
END
GO
