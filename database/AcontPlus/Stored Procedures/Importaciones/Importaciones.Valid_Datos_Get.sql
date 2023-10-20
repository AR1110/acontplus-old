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
-- Test       : EXEC Importaciones.Valid_Datos_Get  38,'AF','[{"codigo":"AVVB1","codBarras":"ACC0","codigoAuxiliar":"AUX-ACC0","codIva":2,"codMedida":"1UNI","codSubFamilia":"IMP0","descripcion":"CAMARA WEB XTRATECH X20 HD 1080P \/ 30FPS USB \/ MICROFONO INTEGRADO","precioCosto":90.00000,"stock":-2.00000,"llevaInventario":"SI"},{"codigo":"AVVB4","codBarras":"ACC1","codigoAuxiliar":"AUX-ACC1","codIva":2,"codMedida":"1UNI","codSubFamilia":"IMP0","descripcion":"BOTELLA DE TINTA EPSON T664120 NEGRO 70ML - L220,L380,L355,L395,L495,L575,L565,L1455,L655,L1300","precioCosto":50.00000,"stock":-14.00000,"llevaInventario":"SI"},{"codigo":"AVVB5","codBarras":"ACC2","codigoAuxiliar":"AUX-ACC2","codIva":2,"codMedida":"1UNI","codSubFamilia":"IMP0","descripcion":"AUDIFONO + MICROFONO HP ON EAR CONECTOR USB + 1 CONECTOR","precioCosto":20.00000,"stock":18.00000,"llevaInventario":"SI"},{"codigo":"AVVB135","codBarras":"864322052676817","codigoAuxiliar":"AUX-TEL0","codIva":2,"codMedida":"1UNI","codSubFamilia":"IMP0","descripcion":"TELÉFONO CELULAR MODELO RMX3231","precioCosto":185.00000,"stock":-24.00000,"llevaInventario":"SI"},{"codigo":"AVVB146","codBarras":"COM0","codigoAuxiliar":"AUX-COM0","codIva":2,"codMedida":"1UNI","codSubFamilia":"IMP0","descripcion":"COMPUTADOR PORTATIL DELL INSPIRON","precioCosto":10.00000,"stock":-2.00000,"llevaInventario":"SI"}]'
IF OBJECT_ID(N'Importaciones.Valid_Datos_Get', N'P') IS NOT NULL
DROP PROCEDURE Importaciones.Valid_Datos_Get 
GO
CREATE PROCEDURE Importaciones.Valid_Datos_Get @idRol INT,@codImportacion VARCHAR(5), @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @payload VARCHAR(MAX) 
	DECLARE @sequential INT 
	DECLARE @idEntidad INT
	DECLARE @tablaSubFamilia     TABLE(idSubFamilia INT NOT NULL,codSubFamilia VARCHAR(50) UNIQUE NOT NULL,descripcion VARCHAR(150) NOT NULL)
	DECLARE @tablaMarca          TABLE(idMarca      INT NOT NULL,codMarca      VARCHAR(50) UNIQUE NULL)
	DECLARE @tablaModelo         TABLE(idModelo     INT NOT NULL,codModelo     VARCHAR(50) UNIQUE NOT NULL)
	DECLARE @tablaMedida         TABLE(idMedida     INT NOT NULL,codMedida     VARCHAR(50) UNIQUE NULL,    descripcion VARCHAR(150) NOT NULL)
	DECLARE @tablaTarifa         TABLE(idTarifa     INT NOT NULL,codTarifa     VARCHAR(50) UNIQUE NOT NULL,descripcion VARCHAR(150) NOT NULL,perdeterminada BIT)
	DECLARE @tablaArticuloImport TABLE(idArticulo   INT NOT NULL,codArticulo   VARCHAR(50) UNIQUE NOT NULL)
	DECLARE @table table 
	(
		id INT UNIQUE NOT NULL
	   ,codigo VARCHAR(300) UNIQUE NOT NULL
	   ,descripcion VARCHAR(200) NOT NULL
	)

	DECLARE @tableFamily TABLE 
	(
		id INT UNIQUE NOT NULL
	   ,codigo  UNIQUEIDENTIFIER NOT NULL
	   ,siglas VARCHAR(25) NOT NULL
	   ,descripcion VARCHAR(200) NOT NULL
	)

	DECLARE @tableClienteExists TABLE (
		idTable INT NOT NULL UNIQUE IDENTITY(1,1) 
	   ,id INT UNIQUE NOT NULL
	   ,numeroIdentificacion VARCHAR(50) UNIQUE NOT NULL
	)

	DECLARE @tableCliente table 
	(
		id INT IDENTITY(1,1) UNIQUE NOT NULL
	   ,idSubContribuyente INT NULL
	   ,idTipoIdentificacion INT NULL
	   ,numeroIdentificacion VARCHAR(200) UNIQUE NOT NULL
	   ,nombreComercial VARCHAR(500) NOT NULL
	   ,nombreFiscal VARCHAR(500) NOT NULL
	   ,contribuyente VARCHAR(200) NULL
	   ,tipoIdentificacion VARCHAR(20) NULL
	   ,telefono VARCHAR(100) NULL
	   ,correo VARCHAR(200) NULL
	   ,direccion VARCHAR(500) NULL
	   ,estado VARCHAR(150) NOT NULL
	)

	DECLARE @tableArticulo TABLE 
	(
		id INT UNIQUE NOT NULL
	   ,idTipoIva INT  NULL
	   ,codigo VARCHAR(200) UNIQUE NOT NULL
	   ,descripcion VARCHAR(200) NULL
	)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

	BEGIN TRY
		BEGIN TRAN 

			IF @codImportacion = 'CL' OR @codImportacion = 'PR'
				BEGIN
					INSERT INTO @tableClienteExists (id,numeroIdentificacion)
					SELECT idCliente,numeroIdentificacion FROM dbo.Cliente WHERE idEntidad = @idEntidad AND @codImportacion = 'CL'
					UNION ALL
					SELECT idProveedor,numeroIdentificacion FROM dbo.Proveedor WHERE idEntidad = @idEntidad AND @codImportacion = 'PR'

					INSERT @tableCliente (
						idSubContribuyente
					   ,idTipoIdentificacion
					   ,contribuyente
					   ,tipoIdentificacion
					   ,numeroIdentificacion
					   ,nombreComercial
					   ,nombreFiscal
					   ,telefono
					   ,correo
					   ,direccion
					   ,estado

					)
					SELECT 
						 idSubContribuyente = ISNULL(tc.idSubContribuyente,0)
						,idTipoIdentificacion = ISNULL(ti.idTipoIdentificacion,0)
						,contribuyente = ISNULL(tc.descripcion,'Ninguna')
						,tipoIdentificacion = ISNULL(ti.descripcion,'Ninguna')
						,dt.numeroidentificacion
						,dt.nombreComercial
						,dt.nombreFiscal
						,dt.telefono
						,dt.correo
						,dt.direccion
						,estado = CASE  WHEN t.id > 0 THEN 'REGISTRADO'
										WHEN tc.idSubContribuyente   IS NULL THEN 'ERROR CONTRIBUYENTE' 
										WHEN ti.idTipoIdentificacion IS NULL THEN 'ERROR TIPO IDENTIFICACION'
										ELSE 'IMPORTAR'
									END 
					FROM OPENJSON(@json)
					WITH
					(
						 codContribuyente     VARCHAR(10)  '$.codContribuyente'
						,codIdentificacion    VARCHAR(10)  '$.codIdentificacion'
						,numeroIdentificacion VARCHAR(50)  '$.numeroIdentificacion'
						,nombreComercial      VARCHAR(500) '$.nombreComercial'
						,nombreFiscal         VARCHAR(500) '$.nombreFiscal'
						,direccion            VARCHAR(500) '$.direccion'
						,telefono             VARCHAR(500) '$.telefono'
						,correo               VARCHAR(500) '$.correo'
					) as dt
					LEFT JOIN dbo.SubContribuyente tc ON tc.codigo  = dt.codContribuyente
					LEFT JOIN dbo.TipoIdentificacion ti ON ti.codigoSri = dt.codIdentificacion
					LEFT JOIN @tableClienteExists t ON t.numeroIdentificacion = dt.numeroIdentificacion

					SET @payload = (SELECT * FROM @tableCliente FOR JSON PATH)

				END 
			
			IF @codImportacion = 'ME' OR @codImportacion = 'MA' OR @codImportacion = 'MO'
				BEGIN
					
						INSERT INTO @table (id,codigo,descripcion)
						SELECT idMedida,codigo,descripcion FROM dbo.Medida WHERE idEntidad = @idEntidad AND  @codImportacion = 'ME'
						UNION ALL
						SELECT idMarca,codigo,descripcion FROM dbo.Marca WHERE idEntidad = @idEntidad AND  @codImportacion = 'MA'
						UNION ALL
						SELECT idModelo,codigo,descripcion FROM dbo.Modelo WHERE idEntidad = @idEntidad AND  @codImportacion = 'MO'

						SET @payload = (
											SELECT 
												dt.codigo
											   ,dt.descripcion 
											   ,estado = IIF(t.id > 0,'REGISTRADO','IMPORTAR')
											FROM OPENJSON(@json) 
											WITH (codigo VARCHAR(200)'$.codigo' ,descripcion VARCHAR(200) '$.descripcion') as dt
											LEFT JOIN @table t ON t.codigo = dt.codigo 
											FOR JSON PATH
										)
				END

			IF @codImportacion = 'SF'
				BEGIN
					INSERT INTO @tableFamily(id,codigo,descripcion,siglas)
					SELECT idSubFamilia,codigo,descripcion,siglas FROM dbo.SubFamilia WHERE idEntidad = @idEntidad

					SET @payload = ( 
										SELECT 
											 dt.codigo
											,dt.descripcion
											,dt.siglas
											,estado = IIF(F.id > 0,'REGISTRADO','IMPORTAR')
										FROM OPENJSON(@json) 
										WITH
										(   codigo VARCHAR(200)      '$.codigo'
										   ,descripcion VARCHAR(200) '$.descripcion'
										   ,siglas VARCHAR(10)       '$.siglas'
										) as dt
										LEFT JOIN @tableFamily f ON f.codigo = dt.codigo
										FOR JSON PATH
									)

				END 

			IF @codImportacion = 'AR'
				BEGIN
					INSERT INTO @tablaSubFamilia(idSubFamilia,codSubFamilia,descripcion)        SELECT idSubFamilia,codigo,descripcion            FROM dbo.SubFamilia WHERE idEntidad = @idEntidad
					INSERT INTO @tablaMarca     (idMarca,codMarca)								SELECT idMarca,codigo                             FROM dbo.Marca      WHERE idEntidad = @idEntidad 
					INSERT INTO @tablaModelo    (idModelo,codModelo)							SELECT idModelo,codigo                            FROM dbo.Modelo     WHERE idEntidad = @idEntidad 
					INSERT INTO @tablaMedida    (idMedida,codMedida,descripcion)				SELECT idMedida,codigo,descripcion                FROM dbo.Medida     WHERE idEntidad = @idEntidad
					INSERT INTO @tablaTarifa    (idTarifa,codTarifa,descripcion,perdeterminada) SELECT idTarifa,codigo,descripcion,predeterminada FROM dbo.Tarifa     WHERE idEntidad = @idEntidad 
					INSERT INTO @tableArticulo  (id,codigo)										SELECT idArticulo,codigo						  FROM dbo.Articulo   WHERE idEntidad = @idEntidad
					
				 	SET @payload =  (
										  SELECT 
											idSubFamilia = ISNULL(ts.idSubFamilia,0)
										   ,idMedida = ISNULL(tm.idMedida,0)
										   ,idTipoIva = ISNULL(ti.idTipoIva,0)
										   ,tma.idMarca
										   ,tmo.idModelo
										   ,dt.codigo
										   ,dt.codBarras
										   ,dt.codAuxiliar
										   ,dt.descripcion
										   ,dt.precioCosto
										   ,dt.stock
										   ,tipoIva =  ISNULL(ti.descripcion,'NINGUNA')
										   ,medida = ISNULL(tm.descripcion,'NINGUNA')
										   ,subFamilia = ISNULL(ts.descripcion,'NINGUNA')
										   ,llevaInventario = IIF(dt.llevaInventario = 'SI',CAST(1 AS BIT),CAST(0 AS BIT))
										   ,fraccionado = IIF(dt.fraccionado = 'SI',CAST(1 AS BIT),CAST(0 AS BIT))
										   ,ubicacion
										   ,fechaven 
										   ,PVP1           
										   ,PVP2 
										   ,PVP3  
										   ,PVP4 
										   ,PVP5 
										   ,estado = CASE WHEN ta.id IS NOT NULL THEN 'REGISTRADO'
														  WHEN ti.idTipoIva  IS NULL THEN 'ERROR CODIGO IVA' 
														  WHEN tm.idMedida   IS NULL THEN 'ERROR CODIGO MEDIDA'
														  WHEN ts.idSubFamilia  IS NULL THEN 'ERROR CODIGO FAMILIA'
														  ELSE 'IMPORTAR'
													 END 
										FROM OPENJSON(@json) 
										WITH
										(
											 codigo          VARCHAR(300)  '$.codigo'
											,codBarras       VARCHAR(500)  '$.codBarras'
											,codAuxiliar     VARCHAR(500)  '$.codigo'
											,codSubFamilia   VARCHAR(150)  '$.codSubFamilia'
											,codMedida       VARCHAR(150)  '$.codMedida'
											,codMarca        VARCHAR(150)  '$.codMarca'
											,codModelo       VARCHAR(150)  '$.codModelo'
											,codIva          INT           '$.codIva'
											,descripcion     VARCHAR(500)  '$.descripcion'
											,precioCosto     DECIMAL(20,5) '$.precioCosto'
											,llevaInventario VARCHAR(10)   '$.llevaInventario'
											,fraccionado     VARCHAR(10)   '$.fraccionado'
											,stock           DECIMAL(20,5) '$.stock'
											,PVP1            DECIMAL(20,5) '$.PVP1'
											,PVP2            DECIMAL(20,5) '$.PVP2'
											,PVP3            DECIMAL(20,5) '$.PVP3'
											,PVP4            DECIMAL(20,5) '$.PVP4'
											,PVP5            DECIMAL(20,5) '$.PVP5'
											,ubicacion       VARCHAR(300)  '$.ubicacion'
											,fechaven        VARCHAR(150)  '$.fechaven'
 										) as dt
										LEFT JOIN dbo.TipoIva      ti  ON ti.codigoPorcentaje = dt.codIva
										LEFT JOIN @tablaMedida     tm  ON tm.codMedida	      = dt.codMedida
										LEFT JOIN @tablaSubFamilia ts  ON ts.codSubFamilia    = dt.codSubFamilia
										LEFT JOIN @tablaMarca      tma ON tma.codMarca	      = dt.codMarca
										LEFT JOIN @tablaModelo     tmo ON tmo.codModelo	      = dt.codModelo
										LEFT JOIN @tableArticulo    ta ON ta.codigo           = dt.codigo
										FOR JSON PATH
									)
				END 

			IF @codImportacion = 'AF'
				BEGIN
					INSERT INTO @tableArticulo (id,idTipoIva,codigo,descripcion) SELECT idArticulo,idTipoIva,codigo,descripcion FROM dbo.Articulo WHERE idEntidad = @idEntidad AND estado = 1 AND productoFraccionable = 1
					INSERT INTO @tablaMedida(idMedida,codMedida,descripcion) SELECT idMedida,codigo,descripcion FROM dbo.Medida WHERE idEntidad = @idEntidad
					
					SET @payload = 	(
									
										SELECT 
										    codigo = NEWID()
										   ,idArticulo = ISNULL(ta.id,0)
										   ,idTipoIva = ISNULL(ta.idTipoIva,0)
										   ,idMedida = ISNULL(tm.idMedida,0)
										   ,articulo = ISNULL(ta.descripcion,'NINGUNA')
										   ,medida = ISNULL(tm.descripcion,'NINGUNA')
										   ,tipoIva =  ISNULL(ti.descripcion,'NINGUNA')
										   ,codArticulo = ISNULL(dt.codArticulo,'NINGUNA')
										   ,dt.conversion
										   ,dt.precioCosto
										   ,dt.PVP1
										   ,dt.PVP2
										   ,dt.PVP3
										   ,dt.PVP4
										   ,dt.PVP5
										   ,estado = CASE WHEN (SELECT COUNT(*) FROM dbo.ArticuloFraccionado af WHERE af.idArticulo = ta.id AND af.idMedida = tm.idMedida ) >= 1 THEN 'REGISTRADO'
														  WHEN tm.idMedida  IS NULL THEN 'MEDIDA NO ENCONTRADA'
														  WHEN ta.id IS NULL THEN 'ARTICULO NO ENCONTRADO'
														  ELSE 'IMPORTAR'
													 END 
										FROM OPENJSON(@json) 
										WITH
										(
											 codArticulo VARCHAR(300)  '$.codArticulo'
											,codMedida   VARCHAR(150)  '$.codMedida'
											,conversion  DECIMAL(20,5) '$.conversion'
											,precioCosto DECIMAL(20,5) '$.precioCosto'
											,PVP1        DECIMAL(20,5) '$.PVP1'
											,PVP2        DECIMAL(20,5) '$.PVP2'
											,PVP3        DECIMAL(20,5) '$.PVP3'
											,PVP4        DECIMAL(20,5) '$.PVP4'
											,PVP5        DECIMAL(20,5) '$.PVP5'
										) as dt
										LEFT JOIN @tablaMedida   tm ON tm.codMedida = dt.codMedida
										LEFT JOIN @tableArticulo ta ON ta.codigo    = dt.codArticulo
										LEFT JOIN dbo.TipoIva    ti ON ti.idTipoIva = ta.idTipoIva
										FOR JSON PATH
									)
				END

		COMMIT TRAN 
		SELECT '1'code, @payload as payload
		RETURN

	END TRY 

	BEGIN CATCH 
		SELECT '0'code,'Error en el procedimiento '+ERROR_MESSAGE() as 'message'
		RETURN
	END CATCH 
END
GO
