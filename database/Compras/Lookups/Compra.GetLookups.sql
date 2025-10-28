USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Liquidacion_Get]    Script Date: 1/30/2023 1:44:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-12-06
-- Description:	SP para leer las liquidaciones de compra
--exec aspLiquidacionCompraGet 1051,'[]'
-- =============================================
CREATE OR ALTER PROCEDURE Compra.GetLookups
     @userRoleId INT
    ,@json VARCHAR(MAX) = NULL
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @idEntidad INT ,@idUsuario INT 
	
	SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    BEGIN TRY
        SET @tableNames = 'taxes,credit_times,emission_points,warehouses,subcategories,additional_config,document_status,measures'

        SELECT idTipoIva
              ,idImpuesto
	          ,descripcion
	          ,tarifa = porcentaje
	          ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
              ,estado 
        FROM dbo.TipoIva WITH (NOLOCK) 
        WHERE estado = 1
			
		SELECT idTiempoCredito,descripcion,diasCredito,numeroCuota,entrada FROM TiempoCredito WITH (NOLOCK) WHERE idEntidad = @idEntidad AND gestion = 0 AND estado = 1

        SELECT idEstablecimiento
              ,nombreComercial
              ,codEstab
              ,idPuntoEmision
              ,ptoEmi + '-' + estab as ptoEmi
              ,defaultEstab
              ,defaultPtoEmi 
        FROM v_PtoEmi_Asign WITH(NOLOCK) 
        WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

        SELECT idEstablecimiento
              ,nombreComercial
              ,codEstab
              ,idBodega
              ,bodega
              ,defaultEstab
              ,defaultBodega 
        FROM v_Bodega_Asign WITH(NOLOCK) 
        WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

        SELECT * FROM Contabilidad.Subcategory WITH (NOLOCK) WHERE CompanyId = @idEntidad AND [Enabled] = 1

        SELECT cd.idPuntoEmision,cd.infoAdicional 
        FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
        INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento 
        INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE es.idEntidad = @idEntidad
          AND td.codigoSri = '03'
          AND cd.infoAdicional IS NOT NULL

        SELECT idEstadoPago,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('PA','NPA','A')

        SELECT * FROM dbo.Medida WHERE idEntidad = @idEntidad AND estado = 1

        RETURN
    END TRY

    BEGIN CATCH 
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ApiCompras/Lookups',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),'Compra.GetLookups',ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

	END CATCH
        
END
