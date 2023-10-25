USE AcontPlus
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
-- Author:		Ivan Paz
-- Create date: 2023-03-21
-- Description:	SP FOR GET REPORTS IN RESTAURANTS
-- =============================================
IF OBJECT_ID('Restaurant.ConsumoTpv_Report') IS NOT NULL
BEGIN 
	DROP PROCEDURE Restaurant.ConsumoTpv_Report
END 
GO
CREATE PROCEDURE Restaurant.ConsumoTpv_Report @idRol INT
,@json VARCHAR(MAX)	
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	,@codEstab VARCHAR(200)
	,@tipo INT
	,@txtSearch VARCHAR(13)
	,@ctualTime TIME
	,@idConfigTpv INT
	,@formato VARCHAR(10)
	,@idEmpresa INT
	,@fechaInicio DATETIME
	,@fechaFin DATETIME 

	SELECT  @tipo = tipo, @txtSearch = txtSearch
	, @idConfigTpv = idConfigTpv
	, @formato = formato 
	,@fechaInicio = fechaInicio
	,@fechaFin = fechaFin
	,@idEmpresa = idEmpresa
	FROM OPENJSON(@json)
							WITH (
									idUsuarioRol INT '$.idUsuarioRol'
									,tipo INT '$.tipo'
									,txtSearch VARCHAR(13) '$.txtSearch'
									,idConfigTpv INT '$.idConfigTpv'
									,formato VARCHAR(10) '$.formato'
									,idEmpresa INT '$.idEmpresa'
									,fechaInicio DATETIME '$.fechaInicio'
									,fechaFin DATETIME '$.fechaFin'
								)

	SET @ctualTime = (SELECT CAST(dbo.ufnGetDateEcuador() AS TIME))
	
	SELECT @idEntidad = idEntidad FROM AFTDataRol(@idRol)

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1

	IF @idConfigTpv > 0 
		BEGIN  
			SELECT c.idCliente
			,cl.numeroIdentificacion
			, ISNULL(c.idConsumoTpv,0) idConsumoTpv
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
 	
		END
	ELSE
		BEGIN 
			SELECT  c.idCliente
			,cl.numeroIdentificacion
			, ISNULL(c.idConsumoTpv,0) idConsumoTpv
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
		END

			--SET @rdlcProps = (SELECT rdlcName = 'ConsumoEmpresaTpv.rdl'
			--						,'CONSUMO EMPRESA' as 'fileName'
			--						,@formato as 'format' FOR JSON PATH)
			
			--SET @rdlcParams = (SELECT title = 'Reporte de Consumo por Empresa'
			--						,fecha =  CAST(dbo.ufnGetDateEcuador()  AS DATE)
			--						,razonSocial = ISNULL(@razonSocial, '|')
			--						,nombreComercial = ISNULL(@nombreComercial, '|')
			--						,logo = 'testlogo'
			--						,logoMime = 'image/png'
			--						,fechaInicio = CAST(@fechaInicio AS DATE)
			--						,fechaFin = CAST(@fechaFin AS DATE)
			--						,empresa = (SELECT razonSocial FROM Administrador.Empresa WHERE idEmpresa = @idEmpresa)
			--						,usuario = (SELECT usuario FROM AFTDataRol(@idRol))

			--FOR JSON PATH)

END
GO
