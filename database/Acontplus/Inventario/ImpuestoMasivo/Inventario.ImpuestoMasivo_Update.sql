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
-- Create date: 2023-05-16
-- Description:	SP FOR UPDATE ALL PRICES OF ARTICLES
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.ImpuestoMasivo_Update @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Variables Globales
	DECLARE @idUsuario INT, @idEntidad INT

    --> Dato json
    DECLARE @taxIdFrom INT, @taxIdTo INT, @decimal INT, @subCategoryId INT
	       
    DECLARE @tbImpuesto AS TABLE 
    (
        taxIdFrom INT NOT NULL
       ,taxIdTo INT NOT NULL
       ,Quantity INT NOT NULL
       ,Module VARCHAR(150) NOT NULL DEFAULT '/Inventario/ImpuestoMasivo'
       ,[Action] VARCHAR(150) NOT NULL DEFAULT 'Update'
       ,CreateAt DATETIME2 NOT NULL DEFAULT GETDATE()
       ,Obs VARCHAR(200) NOT NULL
       ,subCategoryId INT NULL
    )

    

	BEGIN TRY
        
        --> Informacion General
	    SELECT TOP 1 @idUsuario = idUsuario , @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
       
        SELECT TOP 1 @decimal = ISNULL(nroPrecio,5) FROM Config.v_Sistema_Decimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTrasaccion = 'AL'

        --> Data Json
        INSERT INTO @tbImpuesto
              (taxIdFrom,taxIdTo,Quantity,Obs, subCategoryId)
        SELECT taxIdFrom,taxIdTo,quantity,obs, subCategoryId
        FROM OPENJSON(@json) WITH 
        (
             taxIdFrom INT
            ,taxIdTo   INT
            ,quantity  INT
            ,obs       VARCHAR(200)
            ,subCategoryId INT
        ) 

        --> Validacion de informacion
        IF (SELECT COUNT(*) FROM @tbImpuesto) = 0
            BEGIN
              --  SELECT  '0'code,'Error en la informacion de json'[message]
                SELECT [Common].[ufnSpResponse]('1','Error en la informacion de json', DEFAULT)
                RETURN
            END 

        --> recuperar informacion variables
        SELECT TOP 1 @taxIdFrom = taxIdFrom, @taxIdTo = taxIdTo, @subCategoryId = subCategoryId FROM @tbImpuesto

		BEGIN TRAN
		    
            UPDATE dbo.Articulo WITH (ROWLOCK)
                SET idTipoIva = @taxIdTo
            WHERE idEntidad = @idEntidad
              AND estado = 1 
              AND idTipoIva = @taxIdFrom
              AND (@subCategoryId IS NULL OR idSubFamilia = @subCategoryId)

            UPDATE pv SET
                 --  pv.precioConIva = ROUND(pv.precioVenta + ((pv.precioVenta * ti.porcentaje) / 100),@decimal)
                  pv.precioVenta =    ROUND(pv.precioConIva / (1 + (ti.porcentaje / 100)), @decimal) 
            FROM dbo.ArticuloPvP    pv WITH (ROWLOCK)
            INNER JOIN dbo.Articulo ar WITH (ROWLOCK) ON ar.idArticulo = pv.idArticulo
            INNER JOIN dbo.TipoIva  ti WITH (ROWLOCK) ON ti.idTipoIva  = ar.idTipoIva
            WHERE ar.idEntidad = @idEntidad 
              AND ar.estado = 1
              AND ar.idTipoIva = @taxIdTo
              AND pv.precioVenta > 0
               AND (@subCategoryId IS NULL OR ar.idSubFamilia = @subCategoryId)

            UPDATE fp SET
             --      fp.precioConIva = ROUND(fp.precioVenta + ((fp.precioVenta * ti.porcentaje) / 100),@decimal)
                     fp.precioVenta =    ROUND(fp.precioConIva / (1 + (ti.porcentaje / 100)), @decimal) 
            FROM dbo.ArticuloFraccionadoPvP    fp WITH (ROWLOCK)
            INNER JOIN dbo.ArticuloFraccionado af WITH (ROWLOCK) ON af.idArticuloFraccionado = fp.idArticuloFraccionado
            INNER JOIN dbo.Articulo            ar WITH (ROWLOCK) ON ar.idArticulo            = af.idArticulo
            INNER JOIN dbo.TipoIva             ti WITH (ROWLOCK) ON ti.idTipoIva             = ar.idTipoIva
             WHERE ar.idEntidad = @idEntidad 
               AND ar.estado = 1
               AND ar.idTipoIva = @taxIdTo
               AND fp.precioVenta > 0
                AND (@subCategoryId IS NULL OR ar.idSubFamilia = @subCategoryId)

            INSERT INTO Seguridad.TransactionHistory
                   (UserRoleId,Quantity,Module,[Action],Obs,CreateAt)
            SELECT @userRoleId,Quantity,Module,[Action],Obs,CreateAt FROM @tbImpuesto

		COMMIT TRAN
      --  SELECT  '1'code,'Actualización exitosa'[message]
         SELECT [Common].[ufnSpResponse]('1','Actualización exitosa', DEFAULT)
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
            BEGIN 
			    ROLLBACK TRAN
            END 
		
        INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'ImpuestoMasivo/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	    
       -- SELECT  '0'code,'Error en el procedimiento'[message]
        SELECT [Common].[ufnSpResponse]('0','Error en el procedimiento', DEFAULT)
    END CATCH
END
GO
