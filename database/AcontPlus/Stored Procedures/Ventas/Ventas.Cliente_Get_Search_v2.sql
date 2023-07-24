USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Get_Search]    Script Date: 14/4/2023 22:03:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('Ventas.Cliente_Get_Search_v2')IS NOT NULL
	DROP PROCEDURE Ventas.Cliente_Get_Search_v2
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2021-10-28
-- Description:	SP PARA BUSCAR CLIENTES
-- =============================================
--ASPClienteSearch 1, 'ivan'
CREATE PROCEDURE Ventas.Cliente_Get_Search_v2
	 @idRol INT
	,@json NVARCHAR(max)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idEntidad int = (SELECT idEntidad FROM dbo.AFTDataRol(@idRol))
	        ,@search nvarchar(255) 
	

	SELECT 
		@search = (REPLACE(LTRIM(RTRIM(textSearch)),SPACE(1),'%')) 
	FROM OPENJSON(@json)
	WITH (textSearch NVARCHAR(255) '$.textSearch')

		SELECT TOP 25 
			 idCliente = cl.idCliente
			,nombreFiscal = cl.nombreFiscal
			,nombreComercial = cl.nombreComercial
			,numeroIdentificacion = cl.numeroIdentificacion
			,direccion = ISNULL(cl.direccion, '')
			,correo = ISNULL(cl.correo,'')
			,idTiempoCredito = ISNULL(cl.idTiempoCredito,0)
			,diasCredito = ISNULL(tc.diasCredito,'')
			,nombreCompleto = ISNULL(e.nombreCompleto, '')  
			,placa = REPLACE(ISNULL(cl.placa,'N/A'),';',',')
			,validationSri
			,tipoIdentificacion = ti.codigo
			,en.ruc rucEmpresa
			,en.idEntidad companyId
			,cl.customerId
			,ISNULL(cl.telefono, 'SN')
		FROM dbo.Cliente cl 
		INNER JOIN dbo.Entidad en ON en.idEntidad = cl.idEntidad
		 LEFT JOIN dbo.TiempoCredito tc ON tc.idTiempoCredito = cl.idTiempoCredito
		 LEFT JOIN dbo.Empleado e ON e.idEmpleado = cl.idEmpleado
		 LEFT JOIN TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
		WHERE cl.idEntidad = @idEntidad AND cl.estado = 1 
		AND (cl.numeroIdentificacion LIKE '%' + @search + '%' OR 
		     cl.nombreFiscal LIKE '%' + @search + '%' OR 
			 cl.nombreComercial LIKE '%' + @search + '%' OR 
			 cl.placa LIKE '%' + @search + '%') 
END
