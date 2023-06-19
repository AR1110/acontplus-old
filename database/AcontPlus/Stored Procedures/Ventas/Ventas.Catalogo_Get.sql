

USE AcontPlus;

IF OBJECT_ID('Ventas.Catalogo_Get   ') IS NOT NULL
	DROP PROCEDURE Ventas.Catalogo_Get   
GO

CREATE PROCEDURE Ventas.Catalogo_Get @idUsuarioRol INT, @json VARCHAR(800)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT 
	DECLARE @idPolitica INT 

	DECLARE @typeList INT

	DECLARE @configVentas AS TABLE (
		idCliente        INT NULL
	   ,idArticulo       INT NULL
	   ,searchCode       BIT NOT NULL
	   ,printerAutomatic BIT NOT NULL
	   ,payAutomatic     BIT NOT NULL
	)

	SELECT @idEntidad = idEntidad, @idPolitica = idRol FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol	

	SELECT @typeList = typeList FROM OPENJSON(@json)WITH(typeList INT)

	--Insert Configuracion Ventas 
	INSERT INTO @configVentas(idCliente,idArticulo,searchCode,printerAutomatic,payAutomatic) 
	SELECT idCliente, idArticulo, searchCode, printerAutomatic, payAutomatic FROM Config.Sistema WITH (NOLOCK)  
	CROSS APPLY OPENJSON(jsonConfig)		
	WITH(idCliente            INT '$.idCliente'
			,idArticulo       INT '$.idArticulo'
			,searchCode       BIT '$.searchCode'
			,printerAutomatic BIT '$.printerAutomatic'
			,payAutomatic     BIT '$.payAutomatic'
	)
	WHERE idEntidad = 4 AND codConfig = 'CV'

	IF @typeList = 1
		BEGIN 

			--Establecimientos asignados 
			SELECT
				ea.codEstab_Asig,
				ea.codEstab,
				e.nombreComercial,
				ea.predeterminado,
				e.estab,
				tarifasImpuestos = (
					SELECT
						'IVA ' + descripcion AS descripcion,
						'IVA' AS codigo,
						codigo AS codigoPorcentaje,
						porcentaje AS tarifa
					FROM
						Sri.TarifaImpuesto ti WITH (NOLOCK)
					WHERE
						ti.estado = 1
						AND (
							(e.actividad = '01' AND ti.codigo IN ('2', '8'))
							OR (e.actividad <> '01' AND codigo = '2')
						)
					ORDER BY codigoPorcentaje DESC
					FOR JSON PATH
				)
			FROM
				Config.Estab_Asig ea WITH (NOLOCK)
				INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON ea.codEstab = e.codEstab
			WHERE
				idUsuarioRol = @idUsuarioRol
			ORDER BY ea.predeterminado 


			--Puntos de Emision Asignados 
			SELECT ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado
			FROM Config.PtoEmi_Asig pa  WITH (NOLOCK) 
			INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
			INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
			WHERE ea.idUsuarioRol = @idUsuarioRol 

			-------------Bodegas --------------------------
			SELECT ba.codEstab_Asig, b.idBodega, b.descripcion, ba.predeterminado
			FROM Config.Bodeg_Asig ba  WITH (NOLOCK) 
			INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ba.codEstab_Asig = ea.codEstab_Asig
			INNER JOIN Bodega b WITH(NOLOCK) On b.idBodega = ba.idBodega
			WHERE b.estado = 1 AND ea.idUsuarioRol = @idUsuarioRol 

			-------------Config. Ventas --------------------
			SELECT 
			 searchCode,
			 printerAutomatic,
			 payAutomatic
			FROM @configVentas gs

			--Configuracion Decimal Ventas 
			SELECT jsonConfig = (SELECT * FROM OPENJSON(cs.jsonConfig) 
								   WITH (codTransaccion       VARCHAR(5) '$.codTransaccion'
										 ,nroPrecio           INT '$.nroPrecio'
										 ,nroCantidad         INT '$.nroCantidad'
										 ,nroIva              INT '$.nroIva'
										 ,nroDescuentoDetalle INT '$.nroDescuentoDetalle'
										 ,nroTotalDetalle     INT '$.nroTotalDetalle'
										 ,nroTotalSubTotal    INT '$.nroTotalSubTotal'
										 ,nroDescuento        INT '$.nroDescuento'
										 ,nroIce              INT '$.nroIce'
										 ,importeTotal        INT '$.importeTotal') as dt
								   WHERE dt.codTransaccion  = 'V' FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							   ) 
			FROM  Config.Sistema cs WITH (NOLOCK) WHERE cs.idEntidad = 4 AND codConfig = 'CD'

			--------------Configuracion Detalle Ventas-----------------
			SELECT 
				porcentajeIva
			   ,porcentajeDescuento
			   ,descuento
			   ,totalDescuento
			   ,ice 
			FROM dbo.ConfigVentaDetalle WITH (NOLOCK)
			WHERE idEntidad = @idEntidad

			--------------TipoIvas------------------------------------
			SELECT 
				idTipoIva
			   ,descripcion
			   ,tarifa = porcentaje
			   ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
			FROM dbo.TipoIva WITH (NOLOCK) 
			WHERE estado = 1

			--------------Tarifas-------------------------------------
			SELECT 
				idTarifa
			   ,descripcion
			   ,predeterminada
			   ,codigo 
			FROM Tarifa WITH (NOLOCK) 
			WHERE idEntidad = @idEntidad AND estado = 1

			-------------Tiempo Creditos------------------------------
			SELECT 
				idTiempoCredito
			   ,descripcion
			   ,diasCredito
			   ,numeroCuota 
			FROM TiempoCredito WITH (NOLOCK) 
			WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

			--------------Articulo por defecto-------------------------
			SELECT 
				a.idArticulo
			   ,a.codigo
			   ,a.descripcion
			FROM @configVentas gs 
			INNER JOIN Articulo a WITH (NOLOCK) ON a.idArticulo = gs.idArticulo

			--------------Cliente por defecto--------------------------
			SELECT 
				cl.idCliente
			   ,cl.numeroIdentificacion
			   ,cl.nombreComercial
			   ,cl.nombreFiscal
			   ,cl.direccion
			   ,cl.correo
			FROM @configVentas gs
			INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = gs.idCliente

			

			------------Permisos Ventas---------------------
			SELECT 
			 jsonPermission
			FROM Config.UserPermission WHERE idUsuarioRol = @idUsuarioRol AND codModule='V'

			-----------Permiso modulo articulo-----------
			SELECT a.leer, a.crear, a.editar FROM Acceso a
			INNER JOIN SubMenu sm WITH(NOLOCK) ON sm.idSubMenu = a.idSubMenu
			WHERE sm.codTemp ='ART' AND a.idPolitica = @idPolitica

		END

END 