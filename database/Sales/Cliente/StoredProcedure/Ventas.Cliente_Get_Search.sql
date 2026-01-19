USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Get_Search]    Script Date: 14/4/2023 22:03:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Ivan Paz
-- Create date: 2021-10-28
-- Description:	SP PARA BUSCAR CLIENTES
-- =============================================
--ASPClienteSearch 1, 'ivan'
CREATE OR ALTER PROCEDURE [Ventas].[Cliente_Get_Search] @userRoleId INT ,@json NVARCHAR(max), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT ,@textSearch NVARCHAR(255) 

    SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @textSearch = (REPLACE(LTRIM(RTRIM(textSearch)),SPACE(1),'%')) FROM OPENJSON(@json) WITH (textSearch NVARCHAR(255))

	SELECT TOP 25 cl.idCliente
                 ,ISNULL(cl.idTiempoCredito,0)            as idTiempoCredito
                 ,cl.customerId
                 ,cl.estado
			     ,ISNULL(cl.correo,'')                    as correo
                 ,ISNULL(cl.telefono,'')                  as telefono
			     ,ISNULL(cl.direccion, '')                as direccion
			     ,REPLACE(ISNULL(cl.placa,'N/A'),';',',') as placa
			     ,ISNULL(tc.diasCredito,'')               as diasCredito
			     ,cu.SriValidation                        as validationSri
                 ,cu.BusinessName                         as nombreFiscal
			     ,cu.TradeName                            as nombreComercial
			     ,cu.IdTypeId                             as idTipoIdentificacion
                 ,cu.IDCard                               as numeroIdentificacion
			     ,ti.codigo                               as tipoIdentificacion
                 ,ti.codigoSri
			     ,en.ruc                                  as rucEmpresa
			     ,en.idEntidad                            as companyId
	FROM dbo.Cliente                  cl WITH(NOLOCK) 
	INNER JOIN dbo.Entidad            en WITH(NOLOCK) ON en.idEntidad            = cl.idEntidad
    INNER JOIN Customer.Customer      cu WITH(NOLOCK) ON cu.Id                   = cl.CustomerId
     LEFT JOIN dbo.TiempoCredito      tc WITH(NOLOCK) ON tc.idTiempoCredito      = cl.idTiempoCredito
	INNER JOIN dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId
    WHERE cl.idEntidad = @idEntidad 
      AND cl.estado = 1 
	  AND 
         (
               cu.IDCard       LIKE '%' + @textSearch + '%'
            OR cu.TradeName    LIKE '%' + @textSearch + '%' 
            OR cu.BusinessName LIKE '%' + @textSearch + '%' 
            OR cl.placa        LIKE '%' + @textSearch + '%'
         ) 
END
