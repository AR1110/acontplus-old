


USE [AcontPlus]

IF OBJECT_ID('ReporteVentas.Consolidado_Venta')IS NOT NULL
	DROP PROCEDURE ReporteVentas.Consolidado_Venta	
GO 

-- exec ReporteVentas.Consolidado_Venta 38,'[{"tipoReporte":"","radioFechaFiltro":true,"checkboxClienteFiltro":false,"checkboxEstadoFiltro":false,"checkboxUsuarioFiltro":false,"byOrderCampo":"doc.fechaEmision","byOrder":"ASC","byTipoFormato":"pdf","codDoc":"FVNE","byAnio":"2023","checkboxTipoDocRG":false,"byTipoDocRG":0,"fechaInicio":"2023-02-01T05:00:00.000Z","fechaFin":"2023-02-28T05:00:00.000Z","idRol":38,"anio":2023,"codEstab":"ESTAB-000000002"}]'

CREATE PROCEDURE ReporteVentas.Consolidado_Venta @idRol INT, @json VARCHAR(500)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @byEntidad INT  = (SELECT idEntidad FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @idRol)
	DECLARE @checkboxSucursalFiltro BIT
	DECLARE @codEstab VARCHAR(200)

	DECLARE @checkboxPuntoEmisionFiltro BIT
	DECLARE @byPuntoEmision INT
	
	DECLARE @checkboxUsuarioFiltro BIT
	DECLARE @byUsuario INT
	
	DECLARE @fechaInicio DATETIME
	DECLARE @fechaFin DATETIME

	DECLARE @checkboxEstadoFiltro BIT
	DECLARE @byEstado INT
			
	DECLARE @byOrderCampo NVARCHAR(50)
	DECLARE @byOrder NVARCHAR(10)

	DECLARE @checkboxTipoClienteFiltro BIT 
	DECLARE @byTipoCliente INT 
	DECLARE @filtroFecha VARCHAR(100)

	IF (OBJECT_ID(N'tempdb..#tableDocument') IS NOT NULL)
	BEGIN
	  DROP TABLE #tableDocument;
	END;

	CREATE TABLE #tableDocument(
			idPuntoEmision INT,
			idEstadoPago INT,
			idTipoClienteProveedor INT,
			idUsuario INT,
			codEstab VARCHAR(150),
			tipoDoc VARCHAR(100),
			nroDocumento VARCHAR(150),
			fechaEmision VARCHAR(20),
			fechaVencimiento VARCHAR(20),
			cliente VARCHAR(200),
			total DECIMAL(15, 2),
			abono DECIMAL(15, 2),
			saldo DECIMAL(15, 2),
			estado VARCHAR(150),
			codEstado VARCHAR(15),
			fechaRegistro VARCHAR(20),
			usuario VARCHAR(100)		
		);

	DECLARE @tempTbl as TABLE(					
			idPuntoEmision INT,
			idEstadoPago INT,
			idTipoClienteProveedor INT,
			idUsuario INT,
			codEstab VARCHAR(150),
			tipoDoc VARCHAR(100),
			nroDocumento VARCHAR(150),
			fechaEmision VARCHAR(20),
			fechaVencimiento VARCHAR(20),
			cliente VARCHAR(200),
			total DECIMAL(15, 2),
			abono DECIMAL(15, 2),
			saldo DECIMAL(15, 2),
			estado VARCHAR(150),
			codEstado VARCHAR(15),
			fechaRegistro VARCHAR(20),
			usuario VARCHAR(100)
		)

	DECLARE @sqlQuery NVARCHAR(MAX)	
	DECLARE @params NVARCHAR(MAX)='
							@codEstab VARCHAR(200),
							@byPuntoEmision INT,								
							@byUsuario INT,											
							@byEstado INT,
							@byOrder VARCHAR(10),							
							@byOrderCampo VARCHAR(50),
							@byTipoCliente INT ';	



	INSERT INTO #tableDocument(
								idPuntoEmision, 
								idEstadoPago, 
								idTipoClienteProveedor, 
								idUsuario, 
								codEstab, 
								tipoDoc, 
								nroDocumento, 
								fechaEmision, 
								fechaVencimiento, 
								cliente, 
								total, 
								abono, 
								saldo, 
								estado, 
								codEstado, 
								fechaRegistro, 
								usuario
							  ) SELECT 
									fv.idPuntoEmision, 
									ep.idEstadoPago, 
									cl.idTipoClienteProveedor, 
									fv.idUsuario, 
									s.codEstab, 
									'FV', 
									dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,fv.nroFactura), 
									dbo.AFTConvertDate(fv.fechaEmision),
									dbo.AFTConvertDate(fv.fechaVencimiento),
									cl.nombreFiscal, 
									CAST(fv.total AS numeric(15, 2)), 
									CAST(fv.abono AS numeric(15, 2)), 
									CAST(fv.saldo AS numeric(15, 2)), 
									ep.descripcion, 
									ep.codigo, 
									fv.fechaRegistro, 
									u.nombreUsuario
								FROM dbo.Factura fv  WITH(NOLOCK)	
								INNER JOIN PuntoEmision                 pe WITH(NOLOCK) ON pe.idPuntoEmision  = fv.idPuntoEmision 
								INNER JOIN Sri.Establecimiento          s  WITH(NOLOCK) ON s.codEstab         = pe.codEstab
								INNER JOIN Cliente                      cl WITH(NOLOCK) ON cl.idCliente       = fv.idCliente	
								INNER JOIN EstadoPago                   ep WITH(NOLOCK) ON ep.idEstadoPago    = fv.idEstadoPago
								INNER JOIN Usuario                       u WITH(NOLOCK) ON u.idUsuario        = fv.idUsuario								
								WHERE fv.estado = 1 AND  fv.idEntidad = @byEntidad AND CAST(fv.fechaEmision AS DATE) =  CAST(GETDATE() AS DATE)
								
								UNION ALL
	
								SELECT 
									ne.idPuntoEmision, 
									ep.idEstadoPago, 
									cl.idTipoClienteProveedor, 
									ne.idUsuario, es.codEstab, 
									'NE', 
									dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,ne.nroDocumento), 
									dbo.AFTConvertDate(ne.fechaEmision), 
									dbo.AFTConvertDate(ne.fechaVencimiento), 
									cl.nombreFiscal, 
									CAST(ne.total AS numeric(15, 2)), 
									CAST(ne.abono AS numeric(15, 2)), 
									CAST(ne.saldo AS numeric(15, 2)), 
									ep.descripcion, 
									ep.codigo, 
									ne.fechaRegistro,
									u.nombreUsuario
								FROM dbo.NotaEntrega ne	WITH(NOLOCK)
								INNER JOIN PuntoEmision         pe WITH(NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision 
								INNER JOIN Sri.Establecimiento  es WITH(NOLOCK) ON es.codEstab       = pe.codEstab
								INNER JOIN Cliente              cl WITH(NOLOCK) ON cl.idCliente      = ne.idCliente	
								INNER JOIN EstadoPago           ep WITH(NOLOCK) ON ep.idEstadoPago   = ne.idEstadoPago
								INNER JOIN Usuario              u  WITH(NOLOCK) ON u.idUsuario       = ne.idUsuario										
								WHERE ne.estado = 1 AND ne.idEntidad = @byEntidad AND CAST(ne.fechaEmision as date) = CAST(GETDATE() AS DATE)

	SET @sqlQuery = 'SELECT * FROM #tableDocument tmp '


	SELECT 
			    @checkboxSucursalFiltro     = checkboxSucursalFiltro
			   ,@codEstab                   = codEstab

			   ,@checkboxPuntoEmisionFiltro = checkboxPuntoEmisionFiltro
			   ,@byPuntoEmision             = byPuntoEmision

			   ,@checkboxUsuarioFiltro		= checkboxUsuarioFiltro			   
			   ,@byUsuario					= byUsuario
	   
			   ,@fechaInicio				= fechaInicio
			   ,@fechaFin					= fechaFin	
			   
			   ,@checkboxEstadoFiltro		= checkboxEstadoFiltro
			   ,@byEstado					= byEstado			   
			   
			   ,@byOrderCampo				= byOrderCampo
			   ,@byOrder					= byOrder

			   ,@checkboxTipoClienteFiltro  = checkboxTipoClienteFiltro
			   ,@byTipoCliente				= byTipoCliente
			
			FROM OPENJSON(@json)
			WITH (
			      checkboxSucursalFiltro BIT    '$.checkboxSucursalFiltro',
				  codEstab         VARCHAR(200) '$.codEstab',

				  checkboxPuntoEmisionFiltro BIT '$.checkboxPuntoEmisionFiltro',
				  byPuntoEmision             INT '$.byPuntoEmision',
				  
				  checkboxUsuarioFiltro      BIT '$.checkboxUsuarioFiltro',
				  byUsuario INT					'$.byUsuario',
			
				  fechaInicio DATETIME			'$.fechaInicio',
				  fechaFin DATETIME				'$.fechaFin',
				  
				  checkboxEstadoFiltro BIT		'$.checkboxEstadoFiltro',
				  byEstado INT					'$.byEstado',				  			

				  byOrderCampo NVARCHAR(50)		'$.byOrderCampo',
				  byOrder NVARCHAR(10)          '$.byOrder',

				  checkboxTipoClienteFiltro BIT '$.checkboxTipoClienteFiltro',
				  byTipoCliente INT             '$.byTipoCliente'
			) AS jsonValues	
		
		
	--BEGIN TRY 
	
		------------------------------------------------------BUSQUEDA DE DOS PARAMETRO ---------------------------------

		--Sucursal 
		IF @checkboxSucursalFiltro = 1
			BEGIN
				SET @sqlQuery = @sqlQuery + ' AND tmp.codEstab = @codEstab '
			END

		--Punto Emision 
		IF @checkboxPuntoEmisionFiltro = 1
			BEGIN
				SET @sqlQuery = @sqlQuery + ' AND tmp.idPuntoEmision = @byPuntoEmision '
			END 
		
		---Usuario 
		IF  @checkboxUsuarioFiltro = 1
			BEGIN
				SET @sqlQuery = @sqlQuery + ' AND tmp.idUsuario = @byUsuario '
			END

		---Estado cobrada o anulado 
		IF  @checkboxEstadoFiltro = 1 AND (@byEstado = 4 OR @byEstado = 2 OR @byEstado = 1)
			BEGIN
				SET @sqlQuery = @sqlQuery + ' AND tmp.idEstadoPago = @byEstado '
			END

		
		--Filtro con Tipo de Cliente 
		IF @checkboxTipoClienteFiltro = 1
			BEGIN
				SET @sqlQuery = @sqlQuery +  ' AND tmp.idTipoClienteProveedor = @byTipoCliente '			
			END

		--SET @sqlQuery = @sqlQuery +  ' ORDER BY ' + @byOrderCampo+ ' ' +  @byOrder


		
			SELECT
				e.ruc
				,e.razonSocial 
				,e.nombreComercial	
				,ISNULL(e.telefono, '')telefonoEntidad
				,ISNULL(e.direccion, '')direccionEntidad
				,CONVERT(NVARCHAR,FORMAT(@fechaInicio, 'dd/MM/yyyy') +' - ' +  FORMAT(@fechaFin, 'dd/MM/yyyy')) as filtroFecha
				FROM Entidad e		
				WHERE e.idEntidad = @byEntidad	 

	 INSERT INTO  @tempTbl (idPuntoEmision, idEstadoPago, idTipoClienteProveedor, idUsuario, codEstab, tipoDoc, nroDocumento, fechaEmision, fechaVencimiento, cliente, total, abono, saldo, estado, codEstado, fechaRegistro, usuario)
	 
	 EXECUTE sp_Executesql @SqlQuery, @params,						  
						   @codEstab     = @codEstab,
						   @byPuntoEmision= @byPuntoEmision,						   
						   @byUsuario     = @byUsuario,						  
						   @byEstado      = @byEstado,
						   @byOrder       = @byOrder,						   						   
						   @byOrderCampo  = @byOrderCampo,
						   @byTipoCliente = @byTipoCliente													

	 SELECT tipoDoc, nroDocumento, fechaEmision, fechaVencimiento, cliente, total, abono, saldo, estado, usuario FROM @tempTbl;	 

END 
GO