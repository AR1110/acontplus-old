USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Get]    Script Date: 12/14/2022 8:56:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-25
-- Description:	SP Para leer los datos e la tabla articulo get mutiple
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.GetLookups 
     @userRoleId INT
    ,@json VARCHAR(MAX) =  NULL
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    --> Global
	DECLARE @idEntidad INT 

    BEGIN TRY
        SET @tableNames  = 'warehouses,subcategories,categories,measures,models,brands,product_types,taxes,ice,fees,tags,document_types,transaction_types'

	    SELECT TOP 1  @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT idEstablecimiento,nombreComercial,defaultEstab,idBodega,bodega,defaultBodega FROM v_Bodega_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

		SELECT sf.idSubFamilia
		      ,f.idFamilia
		      ,familia      = ISNULL(f.descripcion,'Ninguna')
		      ,subFamilia   = sf.descripcion
		      ,sf.siglas
		      ,sf.ultimoSecuencial
              ,sf.siglas + CAST(sf.ultimoSecuencial as varchar) as codigo
		FROM dbo.SubFamilia sf  WITH (NOLOCK)
			LEFT JOIN Familia   f  WITH (NOLOCK) ON sf.idFamilia = f.idFamilia 
		WHERE sf.idEntidad = @idEntidad AND sf.estado = 1
        ORDER BY sf.descripcion ASC

		SELECT idFamilia, descripcion      
        FROM dbo.Familia WITH (NOLOCK) 
        WHERE ActividadEconomicaId IN (SELECT ea.ActividadEconomicaId FROM v_Estab_Asign ea WITH (NOLOCK) WHERE ea.idUsuarioRol = @userRoleId)    
        AND estado = 1
	
		SELECT idMedida,codigo,descripcion FROM dbo.Medida  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

		SELECT idModelo,codigo,descripcion FROM dbo.Modelo  WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

		SELECT idMarca,codigo,descripcion  FROM dbo.Marca   WITH (NOLOCK) WHERE idEntidad = @idEntidad AND estado = 1

        SELECT idTipoArticulo,descripcion FROM dbo.TipoArticulo WHERE estado = 1 

        SELECT * FROM dbo.TipoIva WHERE estado = 1

        SELECT * FROM dbo.TipoIce WHERE estado = 1
	        
        SELECT idTarifa,descripcion,codigo,predeterminada FROM dbo.Tarifa WHERE idEntidad = @idEntidad AND estado = 1 ORDER BY codigo ASC

        SELECT * FROM Inventario.Etiqueta WHERE idEntidad = @idEntidad AND estado = 1
			
        SELECT idTipoDocumento ,descripcion ,codigoSri ,codigo FROM Inventario.TipoDocumento WHERE estado = 1

        SELECT idTipoTransaccion ,descripcion ,codigo FROM Inventario.TipoTransaccion WHERE estado = 1

        RETURN 
           
    END TRY 

    BEGIN CATCH 
        DECLARE @idUsuario INT

        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		VALUES(NEWID(),'/ApiInventario/GetLookups',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),'Inventario.GetLookups',ERROR_LINE(),ERROR_MESSAGE() + ' json : ' + ISNULL(@json,''),GETDATE(),@idUsuario)
	END CATCH 
END
