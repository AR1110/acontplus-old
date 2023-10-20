
IF OBJECT_ID('Ventas.Factura_Get_v2') IS NOT NULL
	DROP PROCEDURE Ventas.Factura_Get_v2
GO
-- exec Ventas.Factura_Get 28, '{"checkBoxNotaCredito":true,"byNotaCredito":false,"checkBoxEstado":true,"byEstado":15,"checkBoxCliente":true,"byCliente":47424,"checkBoxDefault":false,"codEstab":"ESTAB-000000048","tipoFecha": "FE","pageIndex":"1","pageSize":"50"}'

CREATE PROCEDURE Ventas.Factura_Get_v2 @idRol INT, @json NVARCHAR(MAX) 
AS 
BEGIN
	DECLARE @byEntidad INT 
	DECLARE @tipoFecha VARCHAR(10)
	DECLARE @checkBoxFecha BIT 
	DECLARE @checkBoxCliente BIT
	DECLARE @checkBoxEstado BIT 
	DECLARE @checkBoxUsuario BIT
	DECLARE @checkBoxDefecto BIT
	DECLARE @checkBoxNotaCredito BIT
	DECLARE @codDoc VARCHAR(20)
	DECLARE @byCliente INT 
	DECLARE @byEstado INT 
	DECLARE @byUsuarioSearch INT 
	DECLARE @codEstab VARCHAR(150)
	DECLARE @bySucursalDefecto INT
	DECLARE @fechaInicio DATETIME 
	DECLARE @fechaFin DATETIME  

	DECLARE @paraNotaCredito BIT --para listar facturas para retencion de venta 
	DECLARE @isSearchNroSequential BIT 
	DECLARE @nroSecuencial VARCHAR(30) 
	DECLARE @tipo INT


	DECLARE @isViewOtherDocs BIT = (SELECT JSON_VALUE(jsonPermission, '$.additional.viewOthersDocs.view') FROM Config.UserPermission WHERE codModule='V' AND idUsuarioRol = @idRol)
	DECLARE @idUsuario INT;	

	DECLARE @pageSize INT
	DECLARE @pageIndex INT 
	
	DECLARE @params NVARCHAR(MAX) = ' @idEntidad    INT
									 ,@codEstab     VARCHAR(150)
									 ,@idCliente    INT
									 ,@idEstadoPago INT
									 ,@idUsuario    INT
									 ,@byUsuarioSearch INT
									 ,@fechaE       DATETIME
									 ,@fechaF       DATETIME
									 ,@typeDate     VARCHAR(50)									 
									 ,@pageSize INT
									 ,@pageIndex INT'

	DECLARE @sql NVARCHAR(MAX) = 'SELECT idDocumento             = fv.idFactura
										,idTipoDocumento         = fv.idTipoDocumento
										,idTiempoCredito         = fv.idTiempoCredito
										,idCuentaPorCobrar       = cc.idCuentaPorCobrar
										,codDoc                  = ''01''
										,idCliente               = fv.idCliente
										,codEstab                = es.codEstab
										,telefonoEstablecimiento = ISNULL(es.telefono, '''')
										,nombreComercial         = es.nombreComercial
										,fechaEmision            = FORMAT(fv.fechaEmision, ''dd/MM/yyyy HH:mm'')
										,fechaVencimiento        = FORMAT(cc.fechaVencimiento, ''dd/MM/yyyy'')
										,total                   = fv.total
										,nroFactura              = dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,fv.nroFactura)
										,nombreFiscal            = cl.nombreFiscal
										,correos                 = ISNULL(cl.correo, '''')
										,identificacionComprador = cl.numeroIdentificacion
										,estadoFinanciero        = ep.descripcion
										,estadoSri               = CASE WHEN fv.autorizada = 1 THEN ''Autorizada'' ELSE ''Proceso..'' END
										,claveAcceso             = ISNULL(fv.claveAcceso, '''')
										,telefono                = ISNULL(cl.telefono, '''')
										,codEstado               = ep.codigo
								        ,tiempoCredito           = tc.tipo
										,abono                   = cc.abono
										,saldo                   = cc.saldo
										,style                   = CASE WHEN ep.codigo = ''A'' THEN ''table-danger''
													                    WHEN autorizada = 1    THEN ''table-success''
													                    ELSE ''''
												                   END
										,usuario                 = us.nombreUsuario
										,nroNotaCredito          = ''0''
										,nroGuiaRemision         = dbo.afnNroGuiaRemision(fv.idFactura)
										,nroRetencion            = dbo.afnNroRetencion(fv.idFactura,fv.idTipoDocumento)
										,nroIdentificacion       = us.nroIdentificacion
										,totalRecords            = count(*)             over()
										,totalDocument           = sum(cc.importeTotal) over()
										,totalAbono              = sum(cc.abono)        over()
										,totalSaldo              = sum(cc.saldo)        over()
									FROM dbo.Factura                        fv WITH(NOLOCK)
									INNER JOIN dbo.PuntoEmision             pe WITH(NOLOCK) ON pe.idPuntoEmision  = fv.idPuntoEmision 
									INNER JOIN Sri.Establecimiento          es WITH(NOLOCK) ON es.codEstab        = pe.codEstab
									INNER JOIN dbo.Cliente                  cl WITH(NOLOCK) ON cl.idCliente       = fv.idCliente
									INNER JOIN Contabilidad.CuentaPorCobrar cc WITH(NOLOCK) ON cc.codDoc          = ''01'' AND cc.idDocumento = fv.idFactura
									INNER JOIN dbo.TiempoCredito            tc WITH(NOLOCK) ON tc.idTiempoCredito = cc.idTiempoCredito
									INNER JOIN dbo.EstadoPago               ep WITH(NOLOCK) ON ep.idEstadoPago    = cc.idEstadoPago
									INNER JOIN dbo.Usuario                  us WITH(NOLOCK) ON us.idUsuario       = fv.idUsuario
									WHERE fv.idEntidad = @idEntidad AND pe.codEstab = @codEstab '
		   
		
		SELECT TOP 1 @byEntidad  = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @idRol

		SELECT @tipo                  = tipo 
		      ,@checkBoxFecha         = checkBoxFecha
			  ,@checkBoxCliente       = checkBoxCliente
			  ,@checkBoxEstado        = checkBoxEstado
			  ,@checkBoxUsuario       = checkBoxUsuario
			  ,@checkBoxDefecto       = checkBoxDefault
			  ,@checkBoxNotaCredito   = checkBoxNotaCredito 
			  ,@byCliente             = byCliente
			  ,@byEstado              = byEstado
			  ,@byUsuarioSearch       = byUsuario
			  ,@codEstab              = codEstab
			  ,@fechaInicio           = fechaInicio
			  ,@fechaFin              = fechaFin
			  ,@tipoFecha             = tipoFecha			  
			  ,@pageSize              = pageSize
			  ,@pageIndex             = pageIndex
		FROM OPENJSON(@json) 
		WITH(tipo                  INT '$.tipo'
		    ,checkBoxFecha         BIT '$.checkBoxFecha'
		    ,checkBoxCliente       BIT '$.checkBoxCliente'
			,checkBoxEstado        BIT '$.checkBoxEstado'
			,checkBoxUsuario       BIT '$.checkBoxUsuario'
			,checkBoxDefault       BIT '$.checkBoxDefault'
			,checkBoxNotaCredito   BIT '$.checkBoxNotaCredito'
			,byCliente             INT '$.byCliente'
			,codEstab     VARCHAR(150) '$.codEstab'
			,byEstado              INT '$.byEstado'
			,byUsuario             INT '$.byUsuario'
			,fechaInicio      DATETIME '$.fechaInicio'
			,fechaFin         DATETIME '$.fechaFin'
			,tipoFecha     VARCHAR(50) '$.tipoFecha'			
			,pageIndex             INT '$.pageIndex'
			,pageSize              INT '$.pageSize'
			)

		SELECT TOP 1 @codDoc = codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE idEstadoPago = @byEstado


	
		
		-------------------------------------------BUSQUEDA POR PARAMETRO----------------------------------------------------------------
		IF @isSearchNroSequential = 0
			BEGIN
				SET @sql = @sql + ' AND fv.nroFactura = @nroSecuencial '
			END 
		ELSE
			BEGIN
				IF @checkBoxCliente = 1
					BEGIN
						SET @sql = @sql+'AND fv.idCliente = @idCliente '
					END

				IF @checkBoxEstado = 1
					BEGIN
						IF @codDoc = 'AUTH' OR  @codDoc = 'NAUTH'
							BEGIN
								SET @sql = @sql + ' AND fv.autorizada = IIF(@codDocParamt = ''AUTH'',1,0) AND ep.codigo != ''A'' '
							END 
					
						ELSE IF @codDoc = 'NCBR'
							BEGIN
								SET @sql = @sql+'AND ep.codigo IN (''PE'',''PP'') '
							END 

						ELSE 
							BEGIN
								SET @sql = @sql+'AND ep.idEstadoPago = @idEstadoPago '
							END 
					
					END	
			
				IF @checkBoxFecha = 1 
					BEGIN
						SET @sql = @sql+'AND CAST(IIF(@typeDate=''FE'',fv.fechaEmision,fv.fechaVencimiento) as date) BETWEEN CAST(@fechaE as date) AND CAST(@fechaF as date) '
					END

				IF @checkBoxDefecto = 1
					BEGIN
						SET @sql = @sql+'AND CAST(fv.fechaRegistro AS DATE) = CAST(dbo.ufnGetDateEcuador() AS DATE) '
					END 
									   				
				--Verificamos si tiene permiso a ver otros documentos
				IF @isViewOtherDocs = 0
					BEGIN
						SET @sql = @sql + ' AND fv.idUsuario = @idUsuario'
					END 
				 ELSE
					BEGIN 
						IF @checkBoxUsuario = 1
							BEGIN
								SET @sql = @sql+'AND fv.idUsuario = @byUsuarioSearch '
							END  
					END 
			END 

		IF ISNULL(@tipo,1) = 1
			BEGIN
				SET @sql = @sql + ' ORDER BY fv.idFactura DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'
			END 

		IF @tipo = 2
			BEGIN
				SET @sql = @sql + ' ORDER BY fv.idFactura DESC'
			END

		EXEC sp_executesql @sql
			                ,@params 
			                ,@idEntidad       = @byEntidad
				            ,@codEstab        = @codEstab
				            ,@idCliente       = @byCliente
				            ,@idEstadoPago    = @byEstado 
				            ,@idUsuario       = @idUsuario
				            ,@byUsuarioSearch = @byUsuarioSearch
				            ,@fechaE          = @fechaInicio
				            ,@codDocParamt    = @codDoc
				            ,@fechaF          = @fechaFin
				            ,@typeDate        = @tipoFecha				            
							,@pageIndex       = @pageIndex
							,@pageSize        = @pageSize
	
		

END