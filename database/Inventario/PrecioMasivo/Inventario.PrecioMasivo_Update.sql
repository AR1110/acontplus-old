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
CREATE OR ALTER PROCEDURE Inventario.PrecioMasivo_Update @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT
	       ,@articles VARCHAR(MAX)
           ,@tipo INT
           ,@quantity INT
           ,@Obs VARCHAR(300)

    DECLARE @tbArticle AS TABLE
    (
        idArticuloPvP INT NOT NULL UNIQUE
       ,idArticulo INT NOT NULL
       ,idTarifa INT NOT NULL
       ,idTipoIva INT NOT NULL
       ,precioVenta NUMERIC(18,2) NOT NULL
       ,precioConIva NUMERIC(18,5) NOT NULL
       ,porcentajeUtilidad NUMERIC(18,5) NOT NULL
    )

     DECLARE @tbArticleFraccionado AS TABLE
    (
        idArticuloFraccionadoPvP INT NOT NULL UNIQUE
       ,idArticuloFraccionado INT NOT NULL
       ,idTarifa INT NOT NULL
       ,idTipoIva INT NOT NULL
       ,precioVenta NUMERIC(18,2) NOT NULL
       ,precioConIva NUMERIC(18,5) NOT NULL
       ,porcentajeUtilidad NUMERIC(18,5) NOT NULL
    )

	BEGIN TRY
        
        SELECT @tipo = tipo, @articles = articles FROM OPENJSON (@json) WITH (tipo INT ,articles NVARCHAR(MAX) as json )
	    
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        IF @tipo = 2
            BEGIN 

                INSERT INTO @tbArticle
                      (idArticuloPvP,idArticulo,idTarifa,idTipoIva,precioVenta,precioConIva,porcentajeUtilidad)
                SELECT idArticuloPvP,idArticulo,idTarifa,idTipoIva,precioVenta,precioConIva,porcentajeUtilidad
                FROM OPENJSON(@articles) WITH
                (
                    idArticuloPvP      INT 
                   ,idArticulo         INT 
                   ,idTarifa           INT 
                   ,idTipoIva          INT
                   ,precioVenta        NUMERIC(18,2) 
                   ,precioConIva       NUMERIC(18,5) 
                   ,porcentajeUtilidad NUMERIC(18,5)
                )
                SELECT @Quantity = COUNT(*), @Obs = 'Pvps Articulos' FROM @tbArticle 

                IF (SELECT COUNT(*) FROM @tbArticle) = 0 
                    BEGIN
                        SELECT '0'code,'Error en la informacion'[message]
                        RETURN 
                    END 

            END 

        IF @tipo = 3
             BEGIN 

                INSERT INTO @tbArticleFraccionado
                      (idArticuloFraccionadoPvP,idArticuloFraccionado,idTarifa,idTipoIva,precioVenta,precioConIva,porcentajeUtilidad)
                SELECT idArticuloFraccionadoPvP,idArticuloFraccionado,idTarifa,idTipoIva,precioVenta,precioConIva,porcentajeUtilidad
                FROM OPENJSON(@articles) WITH
                (
                    idArticuloFraccionadoPvP INT 
                   ,idArticuloFraccionado    INT 
                   ,idTarifa                 INT 
                   ,idTipoIva                INT
                   ,precioVenta              NUMERIC(18,2) 
                   ,precioConIva             NUMERIC(18,5) 
                   ,porcentajeUtilidad       NUMERIC(18,5)
                )
                
                SELECT @Quantity = COUNT(*), @Obs = 'Pvps Articulos Fraccionados' FROM @tbArticleFraccionado;

                IF (SELECT COUNT(*) FROM @tbArticleFraccionado) = 0 
                    BEGIN
                        SELECT  '0'code,'Error en la informacion'[message]
                        RETURN 
                    END 
            END 
            
             
		BEGIN TRAN
		    
            IF @tipo = 2
                BEGIN 
                    UPDATE tb SET 
                           tb.precioVenta        = tt.precioVenta
				          ,tb.precioConIva       = tt.precioConIva
				          ,tb.porcentajeUtilidad = tt.porcentajeUtilidad
		            FROM dbo.ArticuloPvp  tb WITH (ROWLOCK)
		            INNER JOIN @tbArticle tt ON tt.idArticuloPvP = tb.idArticuloPvP  
                END 

            IF @tipo = 3
                BEGIN 
                    UPDATE tb SET 
                           tb.precioVenta        = tt.precioVenta
				          ,tb.precioConIva       = tt.precioConIva
				          ,tb.porcentajeUtilidad = tt.porcentajeUtilidad
		            FROM dbo.ArticuloFraccionadoPvP  tb WITH (ROWLOCK)
		            INNER JOIN @tbArticleFraccionado tt ON tt.idArticuloFraccionadoPvP = tb.idArticuloFraccionadoPvP  
                END 

            INSERT INTO Seguridad.TransactionHistory
                    (UserRoleId,Quantity,Module,[Action],obs,CreateAt)
            SELECT @userRoleId,@Quantity,'/Inventario/PrecioMasivo',@Obs,'Update',GETDATE() 

		COMMIT TRAN
        SELECT  '1'code,'Actualización exitosa'[message]
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
            BEGIN 
			    ROLLBACK TRAN
            END 
		
        INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'PrecioMasivo/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	    
        SELECT  '0'code,'Error en el procedimiento'[message]
    END CATCH
END
GO
