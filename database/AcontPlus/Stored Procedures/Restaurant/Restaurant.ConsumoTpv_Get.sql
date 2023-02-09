USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR GET TPV CLIENTS
-- =============================================
IF OBJECT_ID(N'Restaurant.ConsumoTpv_Get', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConsumoTpv_Get
GO
CREATE PROCEDURE Restaurant.ConsumoTpv_Get @idRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT
	,@codEstab VARCHAR(50)
	,@tipo INT
	,@txtSearch VARCHAR(13)
	,@ctualTime TIME
	,@idConfigTpv INT
	,@formato VARCHAR(10)
	,@idEmpresa INT
	,@fechaInicio DATETIME
	,@fechaFin DATETIME

	SELECT @idEntidad = idEntidad FROM AFTDataRol(@idRol)

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1

	SELECT @tipo = tipo, @txtSearch = txtSearch
	, @idConfigTpv = idConfigTpv
	, @formato = formato 
	,@fechaInicio = fechaInicio
	,@fechaFin = fechaFin
	,@idEmpresa = idEmpresa
	FROM OPENJSON(@json)
							WITH (
									tipo INT '$.tipo'
									,txtSearch VARCHAR(13) '$.txtSearch'
									,idConfigTpv INT '$.idConfigTpv'
									,formato VARCHAR(10) '$.formato'
									,idEmpresa INT '$.idEmpresa'
									,fechaInicio DATETIME '$.fechaInicio'
									,fechaFin DATETIME '$.fechaFin'
								)

	SET @ctualTime = (SELECT CAST(dbo.ufnGetDateEcuador() AS TIME))
	--select @fechaInicio, @fechaFin, @idEmpresa return
	IF (@tipo = 1)
		BEGIN
			DECLARE @query NVARCHAR(MAX)
			,@ParamDefinition NVARCHAR(100) = '@idConfigTpv INT, @codEstab INT'

			SET @query = 'SELECT c.idConsumoTpv
							,c.idConfigTpv
							,e.razonSocial empresa
							,cl.nombreFiscal cliente
							,ct.descripcion servicio
							,c.fechaRegistro
							,c.cantidad
							,c.estado
							FROM Restaurant.ConsumoTpv c 
							INNER JOIN Restaurant.ConfigTpv ct ON c.idConfigTpv = ct.idConfigTpv
							INNER JOIN Cliente cl ON c.idCliente = cl.idCliente
							LEFT JOIN Administrador.Empresa e ON cl.idEmpresa = e.idEmpresa
							LEFT JOIN Administrador.Cargo ca ON cl.idCargo = ca.idCargo
							WHERE CAST(c.fechaRegistro AS date) = CAST(GETDATE() AS DATE)
							AND ct.codEstab = @codEstab'

		
			IF @idConfigTpv > 0 
				BEGIN 
					SET @query = @query + ' AND ct.idConfigTpv = @idConfigTpv'
				END

			EXEC sp_executesql @query, @ParamDefinition, @codEstab = @codEstab, @idConfigTpv = @idConfigTpv

			RETURN
		END

	IF (@tipo = 3)
		BEGIN
			SELECT c.idCliente
			,c.nombreFiscal razonSocial
			,c.numeroIdentificacion
			,ISNULL(e.idEmpresa, 0) idEmpresa
			,e.razonSocial empresa
			,cc.descripcion cargo
			,c.estado
			INTO #temp
			FROM Cliente c WITH (NOLOCK)
			LEFT JOIN Administrador.Empresa e ON c.idEmpresa = e.idEmpresa
			LEFT JOIN Administrador.Cargo cc ON c.idCargo = cc.idCargo
			WHERE numeroIdentificacion = LTRIM(RTRIM(@txtSearch)) 
			AND c.idEntidad = @idEntidad --AND c.estado = 1
			
			IF EXISTS (SELECT 1 FROM #temp where estado = 0)
				BEGIN
					SELECT '-1' code, 'Este cliente se encuentra en estado inactivo!' as 'message' --(-1) aplica a datasets o datatables como error de backend
					RETURN
				END

			IF NOT EXISTS(SELECT 1 FROM #temp)
				BEGIN
					RETURN
				END

			DECLARE @idCliente INT = (SELECT idCliente FROM #temp)
	
			SELECT * FROM #temp

			SELECT ISNULL(
			
			CASE WHEN (SELECT COUNT(1) FROM Restaurant.ConsumoAnuladoTpv ca
									WHERE ca.idConsumoTpv = ct.idConsumoTpv) > 0 THEN 0 ELSE ct.idConsumoTpv END
			,0
			) idconsumoTpv
			,ISNULL(ct.idConfigTpv, c.idConfigTpv) idConfigTpv
			,c.codigo
			,c.descripcion
			,c.horaInicio
			,c.horaFin
			,CAST(CASE WHEN ct.idConsumoTpv > 0 THEN
				CASE WHEN (SELECT COUNT(1) FROM Restaurant.ConsumoAnuladoTpv ca
									WHERE ca.idConsumoTpv = ct.idConsumoTpv) > 0 THEN 0 ELSE 1 END
			ELSE 0 END AS BIT) estado
			,CAST(CASE WHEN @ctualTime BETWEEN c.horaInicio AND c.horaFin THEN 1 ELSE 0 END AS BIT) onTime
			--INTO #tempII
			FROM Restaurant.ConfigTpv c WITH (NOLOCK)
			LEFT JOIN Restaurant.ConsumoTpv ct ON c.idConfigTpv = ct.idConfigTpv
			AND ct.idCliente = @idCliente AND ct.estado = 1
			AND CAST(ct.fechaRegistro AS date) = CAST(GETDATE() AS DATE)
			WHERE codEstab = @codEstab
			--AND NOT EXISTS (SELECT * FROM Restaurant.ConsumoAnuladoTpv cota WHERE ct.idConsumoTpv = cota.idConsumoTpv)

			--SELECT idconsumoTpv, idConfigTpv, codigo, descripcion, horaInicio
			--,horaFin
			--,estado
			--,onTime
			--FROM #tempII

			DROP TABLE #temp
			RETURN
		END

	IF (@tipo = 4)
		BEGIN 
			SELECT c.idConfigTpv
			,c.codigo
			,c.descripcion
			,c.horaInicio
			,c.horaFin 
			,CAST(CASE WHEN @ctualTime BETWEEN c.horaInicio AND c.horaFin THEN 1 ELSE 0 END AS BIT) onTime
			FROM Restaurant.ConfigTpv c WITH (NOLOCK)
			WHERE codEstab = @codEstab
			RETURN
		END

	
	--REPORTS
	DECLARE @dataSources VARCHAR(MAX)
	,@rdlcProps VARCHAR(MAX)
	,@rdlcParams VARCHAR(MAX)
	,@razonSocial VARCHAR(300)
	,@nombreComercial VARCHAR(300)

	SET @razonSocial = (SELECT entidad FROM AFTDATAROL(@idRol))
		SET @nombreComercial = (SELECT nombreComercial FROM Entidad WHERE identidad=  @idEntidad)

	IF (@tipo = 5)
		BEGIN
			--DECLARE @query VARCHAR(MAX)

			IF (@idConfigTpv > 0)
				BEGIN
					SELECT @dataSources = (SELECT mainDs = (

						SELECT c.idConsumoTpv
						,c.idConfigTpv ordenServicio
						,e.razonSocial empresa
						,cl.nombreFiscal cliente
						,ct.descripcion servicio
						,c.fechaRegistro
						,c.estado
						,c.cantidad
						FROM Restaurant.ConsumoTpv c 
						INNER JOIN Restaurant.ConfigTpv ct ON c.idConfigTpv = ct.idConfigTpv
						INNER JOIN Cliente cl ON c.idCliente = cl.idCliente
						LEFT JOIN Administrador.Empresa e ON cl.idEmpresa = e.idEmpresa
						LEFT JOIN Administrador.Cargo ca ON cl.idCargo = ca.idCargo
						WHERE ct.idSucursal = @codEstab
						AND ct.idConfigTpv = @idConfigTpv
						AND CAST(c.fechaRegistro AS date) = CAST(GETDATE() AS DATE)
						AND c.estado = 1
						FOR JSON PATH) FOR JSON PATH)
				END
			ELSE
				BEGIN
						SELECT @dataSources = (SELECT mainDs = (

						SELECT c.idConsumoTpv
						,c.idConfigTpv
						,e.razonSocial empresa
						,cl.nombreFiscal cliente
						,ct.descripcion servicio
						,c.fechaRegistro
						,c.estado
						,c. cantidad
						FROM Restaurant.ConsumoTpv c 
						INNER JOIN Restaurant.ConfigTpv ct ON c.idConfigTpv = ct.idConfigTpv
						INNER JOIN Cliente cl ON c.idCliente = cl.idCliente
						LEFT JOIN Administrador.Empresa e ON cl.idEmpresa = e.idEmpresa
						LEFT JOIN Administrador.Cargo ca ON cl.idCargo = ca.idCargo
						WHERE ct.idSucursal = @codEstab
						AND CAST(c.fechaRegistro AS date) = CAST(GETDATE() AS DATE)
						AND c.estado = 1
						FOR JSON PATH) FOR JSON PATH)	
				END
			SET @rdlcProps = (SELECT rdlcName = 'ConsumoGeneralTpv.rdl'
								, 'CONSUMO DIARIO' as 'fileName'
								, @formato as 'format' 
								FOR JSON PATH)
			SET @rdlcParams = (SELECT title = 'Reporte Diario de consumo' 
									 ,razonSocial = @razonSocial
									 ,nombreComercial = @nombreComercial
									FOR JSON PATH)
			SELECT @rdlcProps rdlcProps, @dataSources dataSources, @rdlcParams rdlcParams

			RETURN
		END
	IF (@tipo = 6)
		BEGIN
			SELECT c.idConfigTpv
			,c.codigo
			,c.descripcion
			,c.horaInicio
			,c.horaFin
			FROM Restaurant.ConfigTpv c WITH (NOLOCK)
			WHERE codEstab = @codEstab
			AND estado = 1

			SELECT e.idEmpresa
			,e.razonSocial
			FROM Administrador.Empresa e WITH (NOLOCK)
			INNER JOIN Cliente c WITH (NOLOCK) ON e.idEmpresa = c.idEmpresa
			INNER JOIN Restaurant.ConsumoTpv r ON c.idCliente = r.idCliente
			INNER JOIN Restaurant.ConfigTpv ct ON r.idConfigTpv = ct.idConfigTpv
			WHERE ct.codEstab = codEstab
			GROUP BY e.idEmpresa
			,e.razonSocial
			RETURN
		END
	IF (@tipo = 7)
		BEGIN
			IF @idConfigTpv > 0 
				BEGIN 
						SELECT @dataSources = (SELECT mainDataSet = (
															SELECT ISNULL(c.idConsumoTpv,0) idConsumoTpv
															,ISNULL(ct.idConfigTpv , 0) idConfigTpv 
															,ISNULL(cl.nombreFiscal,'') + ' (' + ISNULL(e.razonSocial,'') + ')' cliente
															,ct.descripcion servicio
															,fecha =  ISNULL((SELECT CONVERT(VARCHAR, FORMAT(c.fechaRegistro, 'dd/MM/yyyy'), 106) FROM Restaurant.ConsumoTpv ctt
																			WHERE ctt.idCliente = c.idcliente 
																			AND ctt.idConfigTpv = ct.idConfigTpv
																			AND ctt.fechaRegistro = c.fechaRegistro
																			), '')
															--,CONVERT(VARCHAR, FORMAT(c.fechaRegistro, 'dd/MM/yyyy'), 106) fecha
															,c.estado
															,cantidad = ISNULL((SELECT sum(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt
																			WHERE ctt.idCliente = c.idcliente 
																			AND ctt.idConfigTpv = ct.idConfigTpv
																			AND ctt.fechaRegistro = c.fechaRegistro
																			), 0)
															,ct.codigo codServicio
															,ct.orden ordenServicio
															,totalDesayunos = case when ct.codigo = 'D' THEN ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt 
															INNER JOIN Restaurant.ConfigTpv cf
															ON ctt.idConfigTpv = cf.idConfigTpv 
															WHERE ctt.idCliente = c.idCliente
															AND cf.idConfigTpv = @idConfigTpv
															AND CAST(ctt.fechaRegistro AS date)
															BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
															AND ctt.estado = 1
															),0) END
															,totalAlmuerzos = case when ct.codigo = 'A' THEN ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt 
															INNER JOIN Restaurant.ConfigTpv cf
															ON ctt.idConfigTpv = cf.idConfigTpv 
															WHERE ctt.idCliente = c.idCliente
															AND cf.idConfigTpv = @idConfigTpv
															AND CAST(ctt.fechaRegistro AS date)
															BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
															AND ctt.estado = 1
															),0) END
															,totalCenas = CASE WHEN CT.codigo = 'C' THEN ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt 
															INNER JOIN Restaurant.ConfigTpv cf
															ON ctt.idConfigTpv = cf.idConfigTpv 
															WHERE ctt.idCliente = c.idCliente
															AND cf.idConfigTpv = @idConfigTpv
															AND CAST(ctt.fechaRegistro AS date)
															BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
															AND ctt.estado = 1
															),0) END
															,totalAlimentacion = ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt 
															INNER JOIN Restaurant.ConfigTpv cf
															ON ctt.idConfigTpv = cf.idConfigTpv 
															WHERE ctt.idCliente = c.idCliente
															AND cf.idConfigTpv = @idConfigTpv
															AND CAST(ctt.fechaRegistro AS date)
															BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
															AND ctt.estado = 1
															),0)
															FROM Restaurant.ConsumoTpv c  
															CROSS JOIN Restaurant.ConfigTpv ct
															INNER JOIN Cliente cl ON c.idCliente = cl.idCliente  
															INNER JOIN Administrador.Empresa e WITH(NOLOCK) ON cl.idEmpresa = e.idEmpresa

															WHERE ct.codEstab = codEstab
															AND ct.idConfigTpv = @idConfigTpv
															AND cl.idEmpresa = @idEmpresa
															AND c.estado = 1
															AND CAST(c.fechaRegistro AS date)
															BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
															FOR JSON PATH) 
						FOR JSON PATH)	
			END
			ELSE
				BEGIN
					SELECT @dataSources = (SELECT mainDataSet = (
																	SELECT ISNULL(c.idConsumoTpv,0) idConsumoTpv
																	,ISNULL(ct.idConfigTpv , 0) idConfigTpv 
																	,ISNULL(cl.nombreFiscal,'') + ' (' + ISNULL(e.razonSocial,'') + ')' cliente
																	,ct.descripcion servicio
																	,fecha =  ISNULL((SELECT CONVERT(VARCHAR, FORMAT(c.fechaRegistro, 'dd/MM/yyyy'), 106) FROM Restaurant.ConsumoTpv ctt
																			WHERE ctt.idCliente = c.idcliente 
																			AND ctt.idConfigTpv = ct.idConfigTpv
																			AND ctt.fechaRegistro = c.fechaRegistro
																			), '')
																	--,CONVERT(VARCHAR, FORMAT(c.fechaRegistro, 'dd/MM/yyyy'), 106) fecha
																	,c.estado
																	,cantidad = ISNULL((SELECT sum(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt
																			WHERE ctt.idCliente = c.idcliente 
																			AND ctt.idConfigTpv = ct.idConfigTpv
																			AND ctt.fechaRegistro = c.fechaRegistro
																			), 0)
																	,ct.codigo codServicio
																	,ct.orden ordenServicio
																	,totalDesayunos = ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt 
																	INNER JOIN Restaurant.ConfigTpv cf
																	ON ctt.idConfigTpv = cf.idConfigTpv 
																	WHERE ctt.idCliente = c.idCliente
																	AND cf.codigo = 'D'
																	AND CAST(ctt.fechaRegistro AS date)
																	BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
																	AND ctt.estado = 1
																	),0)
																	,totalAlmuerzos = ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt 
																	INNER JOIN Restaurant.ConfigTpv cf
																	ON ctt.idConfigTpv = cf.idConfigTpv 
																	WHERE ctt.idCliente = c.idCliente
																	AND cf.codigo = 'A'
																	AND CAST(ctt.fechaRegistro AS date)
																	BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
																	AND ctt.estado = 1
																	),0)
																	,totalCenas = ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt 
																	INNER JOIN Restaurant.ConfigTpv cf
																	ON ctt.idConfigTpv = cf.idConfigTpv 
																	WHERE ctt.idCliente = c.idCliente
																	AND cf.codigo = 'C'
																	AND CAST(ctt.fechaRegistro AS date)
																	BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
																	AND ctt.estado = 1
																	),0),
																	totalAlimentacion = ISNULL((SELECT SUM(ctt.cantidad) FROM Restaurant.ConsumoTpv ctt  
																	WHERE ctt.idCliente = c.idCliente
																	AND CAST(ctt.fechaRegistro AS date)
																	BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
																	AND ctt.estado = 1
																	),0)
																	FROM Restaurant.ConsumoTpv c WITH(NOLOCK)
																	CROSS JOIN Restaurant.ConfigTpv ct WITH(NOLOCK)
																	INNER JOIN Cliente cl ON c.idCliente = cl.idCliente 
																	INNER JOIN Administrador.Empresa e WITH(NOLOCK) ON cl.idEmpresa = e.idEmpresa
																	WHERE ct.codEstab = @codEstab 
																	AND cl.idEmpresa = @idEmpresa
																	AND c.estado = 1
																	AND CAST(c.fechaRegistro AS date)
																	BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE)
																	FOR JSON PATH) FOR JSON PATH)
				END

			SET @rdlcProps = (SELECT rdlcName = 'ConsumoEmpresaTpv.rdl'
									,'CONSUMO EMPRESA' as 'fileName'
									,@formato as 'format' FOR JSON PATH)
			
			SET @rdlcParams = (SELECT title = 'Reporte de Consumo por Empresa'
									,fecha =  CAST(dbo.ufnGetDateEcuador()  AS DATE)
									,razonSocial = ISNULL(@razonSocial, '|')
									,nombreComercial = ISNULL(@nombreComercial, '|')
									,logo = 'testlogo'
									,logoMime = 'image/png'
									,fechaInicio = CAST(@fechaInicio AS DATE)
									,fechaFin = CAST(@fechaFin AS DATE)
									,empresa = (SELECT razonSocial FROM Administrador.Empresa WHERE idEmpresa = @idEmpresa)
									,usuario = (SELECT usuario FROM AFTDataRol(@idRol))

			FOR JSON PATH)

			SELECT @rdlcProps rdlcProps, @dataSources dataSources, @rdlcParams rdlcParams
			RETURN
		END
END
GO
