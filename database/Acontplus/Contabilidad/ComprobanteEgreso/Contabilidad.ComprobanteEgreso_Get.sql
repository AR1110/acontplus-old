USE [AcontPlus] 
-- =============================================
-- Author:		Emilio Senguana
-- Create date: 21-02-2024 
GO
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteEgreso_Get 
    @userRoleId INT
   ,@json NVARCHAR(MAX)
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
	DECLARE @checkBoxFecha   BIT 
		   ,@fechaInicio     DATETIME2 
		   ,@fechaFin        DATETIME2
		   ,@byPersona       VARCHAR(100)
		   ,@byUsuario       INT
		   ,@byTipoDocumento INT
		   ,@byComprobante   INT
		   ,@byEstado        INT 
           ,@nroSecuencial VARCHAR(13)

    --> Recuperacion de Informacion
	SELECT @tipo = tipo  FROM OPENJSON(@json) WITH (tipo INT)

	SELECT TOP 1 @idEntidad  = idEntidad FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> Get
    IF @tipo = 1
        BEGIN 
                
            SET @tableNames = 'comprobantesEgreso'

            SET @sql = 'SELECT ce.idComprobanteEgreso
							  ,ce.total
                              ,es.codEstab
                              ,FORMAT(ce.fechaRegistro, ''dd/MM/yyyy HH:mm'')                   as fechaRegistro
                              ,Common.ufnGetSerieDocument(''CE'',es.estab,ce.nroDocumento,0)    as nroDoc
							  ,UPPER(cu.BusinessName)                                           as nomPersona
							  ,cu.IDCard												        as nroIdentificacion
							  ,''Ninguna''                                                      as caja
							  ,CASE WHEN ce.estado = 0 THEN ''table-danger'' ELSE '''' END      as color
							  ,CASE WHEN ce.estado = 0 THEN ''Anulado'' ELSE ''Activo'' END     as nomEstado
							  ,us.nombreUsuario                                                 as nomUsuario
                              ,COUNT(*) OVER()                                                  as totalRecords
						FROM dbo.ComprobanteEgreso     ce WITH (NOLOCK) 
						INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ce.idEstablecimiento
						INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = ce.idUsuario
						INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id				= ce.CustomerId
						WHERE ce.idEntidad = @idEntidad '


            SET @params = '@idEntidad         INT
						  ,@fechaI            DATETIME2
						  ,@fechaF            DATETIME2
						  ,@nroIdentificacion VARCHAR(100)
						  ,@idTipoDocumento   INT
						  ,@idComprobante     INT
						  ,@estado            INT
						  ,@idUsuario         INT
                          ,@pageIndex         INT
                          ,@pageSize          INT'

			SELECT @checkBoxFecha   = checkBoxFecha 
				  ,@byComprobante   = byComprobante
				  ,@byUsuario       = byUsuario
				  ,@byPersona       = byPersona
				  ,@byTipoDocumento = byTipoDocumento
				  ,@byEstado        = byEstado
				  ,@fechaFin        = fechaFin
				  ,@fechaInicio     = fechaInicio
                  ,@pageSize        = pageSize
				  ,@pageIndex       = pageIndex
                  ,@nroSecuencial  = LTRIM(TRIM(nroSecuencial))
			FROM OPENJSON(@json) WITH 
            (
                 checkBoxFecha     BIT 
                ,checkBoxDocumento BIT 
                ,checkBoxUsuario   BIT 
                ,fechaInicio       DATETIME2 
                ,fechaFin          DATETIME2 
                ,byPersona         VARCHAR(100) 
                ,byTipoDocumento   INT 
                ,byComprobante     INT 
                ,byUsuario         INT 
                ,byEstado          INT
                ,pageSize          INT
                ,pageIndex         INT
                ,nroSecuencial  VARCHAR(13)
            )
 
		    IF @byTipoDocumento > 0 AND @byComprobante > 0
			    BEGIN
                    SET @sql = @sql + '
                    AND ce.idComprobanteEgreso IN (
                        SELECT pd.idComprobanteEgreso 
                        FROM PagoDocumento pd 
                        WHERE pd.idTipoDocumento = @idTipoDocumento 
                        AND pd.idComprobante = @idComprobante
                    ) '


			    END 

		    IF @byEstado IS NOT NULL
			    BEGIN
				    SET @sql = @sql + 'AND ce.estado = @estado '
			    END 

		    IF @checkBoxFecha = 1
			    BEGIN
				    SET @sql = @sql + 'AND CAST(ce.fechaRegistro as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '
			    END 
			
		    IF @byPersona IS NOT NULL
			    BEGIN
				    SET @sql = @sql + 'AND cu.IDCard = @nroIdentificacion '
			    END 

		    IF @byUsuario > 0
			    BEGIN
				    SET @sql = @sql + 'AND ce.idUsuario = @idUsuario '
			    END 

             IF @nroSecuencial IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND ce.nroDocumento BETWEEN ' + REPLACE(@nroSecuencial,'-',' AND ')
				END  

		    SET @sql = @sql + 'ORDER BY ce.idComprobanteEgreso DESC OFFSET @pageSize * (@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

		    EXEC sp_executesql @sql
			                  ,@params
				              ,@idEntidad         = @idEntidad
				              ,@fechaI            = @fechaInicio
				              ,@fechaF            = @fechaFin
				              ,@nroIdentificacion = @byPersona
				              ,@idTipoDocumento   = @byTipoDocumento
				              ,@idComprobante     = @byComprobante
				              ,@estado            = @byEstado
				              ,@idUsuario         = @byUsuario
                              ,@pageSize          = @pageSize
                              ,@pageIndex         = @pageIndex

            RETURN 

        END
        
    --> Filters
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'estabs,tipoDocumento,subEntidadFinanciera,banco,users'

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi  as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId 
            ORDER BY defaultEstab DESC

            --- Added by Ignacio Manchu ---
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

            SELECT nombreCompleto, idUsuario, nombreUsuario FROM v_usuario WHERE idEntidad = @idEntidad
            RETURN 
        END 
    
    --> DataForm
	IF @tipo = 3
		BEGIN
            DECLARE @idProveedor INT

            SET @tableNames = 'entidadFinanciera,subEntidadFinanciera,banco,ciudad,estadoPago,documentos'

            SELECT @idProveedor = idProveedor FROM OPENJSON(@json)WITH(idProveedor INT)
				
            SELECT * FROM EntidadFinanciera WHERE estado = 1
				
            SELECT * FROM SubEntidadFinanciera WHERE idEntidad = @idEntidad AND estado = 1
				
            SELECT * FROM Banco WHERE estado = 1
				
         --   SELECT * FROM Ciudad WHERE estado = 1
            SELECT cd.idCiudad,provincia = pr.descripcion ,cd.descripcion,pr.codigo FROM dbo.Provincia pr WITH (NOLOCK) INNER JOIN dbo.Ciudad cd WITH (NOLOCK) ON cd.idProvincia = pr.idProvincia WHERE cd.estado = 1

            SELECT idEstadoPago ,descripcion ,codigo FROM dbo.EstadoPago WHERE estado = 1 AND codigo IN ('PE','PP','PA')

            SELECT cp.idCuentaPorPagar as idComprobante
                  ,(SELECT TOP 1 idTipoDocumento FROM dbo.TipoDocumento td (NOLOCK) WHERE td.codigoSri = cp.codDoc) as idTipoDocumento
                  ,cp.serieComprobante                                                                              as nroDocumento
                  ,IIF(cp.codDoc = '04','Nota Credito','Comprobante Retención')                                     as tipoDocumento
                  ,importeTotal                                                                                     as saldo
                  ,CASE cp.codDoc WHEN '04' THEN (SELECT TOP 1 d.numDocSustento FROM factelect.DocRelacionado d WITH (NOLOCK) WHERE d.idDocumentoRecibido = cp.idDocumento )
                                  WHEN '07' THEN (SELECT TOP 1 rs.numAutDocSustento FROM FactElect.RetAtsDocSustento rs WITH (NOLOCK) WHERE rs.idRetencionAts = cp.idDocumento)
                   END                                                                                              as numAutDocSustento
                   ,Format(cp.fechaEmision, 'yyyy-MM-dd')     as fechaEmision
            FROM Contabilidad.CuentaPorPagar cp WITH (NOLOCK)
            INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cp.idEstadoPago
            WHERE cp.codDoc IN ('04','07')
              AND cp.importeTotal > 0
              AND cp.idProveedor = @idProveedor
              AND ep.codigo = 'PE'

            RETURN 
				
		END 
    
    --> Cuotas en pagos multiples
    IF @tipo = 4
        BEGIN
            DECLARE @idCuentaPorPagar INT

            SET @tableNames = 'cuotas'

            SELECT @idCuentaPorPagar = idCuentaPorPagar FROM OPENJSON(@json) WITH (idCuentaPorPagar INT)

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

            RETURN
        END

    --> Get For Data Delete 
    IF @tipo = 5
        BEGIN
            
            DECLARE @id INT

            SET @tableNames = 'cuentas,cuotas,estadoPago'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT hp.idCuentaPorPagar ,cp.importeTotal as saldo, cp.abono as abonoDoc ,hp.abono ,pa.cobro
            FROM Contabilidad.Historial_Pago        hp WITH (NOLOCK) 
            INNER JOIN dbo.Pago                     pa WITH (NOLOCK) ON pa.idPago           = hp.idPago
            INNER JOIN Contabilidad.CuentaPorPagar  cp WITH (NOLOCK) ON cp.idCuentaPorPagar = hp.idCuentaPorPagar
            WHERE hp.idComprobanteEgreso = @id

            SELECT pd.idCuotaPorPagar ,cp.cuota as saldo ,cp.abono as abonoCuota ,pd.abono ,pa.cobro
            FROM dbo.PagoDetalle                   pd WITH (NOLOCK)
            INNER JOIN dbo.Pago                    pa WITH (NOLOCK) ON pa.idPago           = pd.idPago
            INNER JOIN Contabilidad.CuotaPorPagar  cp WITH (NOLOCK) ON cp.idCuotaPorPagar  = pd.idCuotaPorPagar
            WHERE pa.idComprobanteEgreso = @id

            SELECT idEstadoPago ,descripcion ,codigo FROM dbo.EstadoPago WHERE estado = 1 AND codigo IN ('PE','PP')

            RETURN 
        END 

    --> Cheques Posfechados
    IF @tipo = 6
        BEGIN
            
            SET @tableNames = 'cheques'

            SELECT pa.idPago                                                                               as id
		          ,pa.idComprobanteEgreso                                                                  as idComprobante
                  ,es.idEstablecimiento                                                                    as codDoc
		          ,'CE' + '-' + es.estab + '-' + RIGHT('000000000' + CONVERT(VARCHAR, ce.nroDocumento), 9) as nroDocumento
		          ,cu.BusinessName                                                                         as persona
		          ,cu.IDCard                                                                               as nroIdentificacion
		          ,pa.valor
		          ,pa.nro                                 
		          ,FORMAT(pa.fechaEmision, 'dd/MM/yyyy HH:mm')                                             as fechaEmision
            FROM dbo.Pago pa WITH (NOLOCK)
            INNER JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK) ON ce.idComprobanteEgreso = pa.idComprobanteEgreso
            INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = pa.idEntidadFinanciera
            INNER JOIN Customer.Customer     cu WITH (NOLOCK) ON cu.Id                  = ce.CustomerId
            INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento   = ce.idEstablecimiento
            WHERE ef.codigo = 'CHE'
              AND ce.estado = 1
              AND ce.idEntidad = @idEntidad
              AND pa.posfechado = 1

            RETURN 
        END 
END
