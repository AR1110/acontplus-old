USE Acontplus
GO

-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-03-10
-- Description:	sp for get docs sustento
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetAts_Doc_Sust_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	SET XACT_ABORT ON;
	
    BEGIN TRY

		DECLARE @tipo INT,
            @userId INT,
            @documentId INT,
            @isAutomatic BIT;

		SELECT @tipo = tipo
            ,@documentId = documentId
            ,@isAutomatic = isAutomatic 
        FROM OPENJSON(@json) WITH (tipo INT, documentId INT, isAutomatic BIT)
		 
        SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

		IF @tipo = 1
			BEGIN 
                SET @tableNames = 'doc,taxes,payments'; 
 
				DECLARE @table TABLE 
				(
					codDoc VARCHAR(2),
					xmlComp XML
				)

				DECLARE @docSustento AS TABLE(
					totalSinImpuestos NUMERIC(18,2)
				)
				DECLARE @taxes TABLE
				(
					codigo VARCHAR(5) NOT NULL,
                    codigoPorcentaje VARCHAR(5) NOT NULL,
                    baseImponible NUMERIC(18,2) NOT NULL,
                    valor NUMERIC(18,2) NOT NULL
				)

				DECLARE @tblPagos AS TABLE(
					formaPago VARCHAR(2),
                    total NUMERIC (18,2)
				)

				IF (@isAutomatic = 1)
					BEGIN
						INSERT INTO @table (codDoc, xmlComp)
						SELECT ci.codDoc, CONVERT(XML, DECOMPRESS(ci.xmlCompressed)).value('(/autorizacion/comprobante)[1]', 'NVARCHAR(MAX)')
						FROM Recepcion.DocumentoRecibido ci
						WHERE idDocumento = @documentId

						INSERT INTO @docSustento(totalSinImpuestos)
						SELECT ISNULL((SELECT xmlComp.query('//infoFactura').value('(/infoFactura/totalSinImpuestos)[1]', 'NUMERIC(18,2)') FROM @table),0)
						FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
						WHERE dr.idDocumento = @documentId

						INSERT INTO @taxes (codigo,codigoPorcentaje,baseImponible,valor)
						SELECT x.y.value('(codigo)[1]','VARCHAR(5)')
							,x.y.value('(codigoPorcentaje)[1]','VARCHAR(5)')
							,x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
							,x.y.value('(valor)[1]','NUMERIC(18,2)')
						FROM @table t
						CROSS APPLY t.xmlComp.nodes('//infoFactura/totalConImpuestos/totalImpuesto') x(y)

						INSERT INTO @tblPagos(formaPago, total)
						SELECT x.y.value('(formaPago)[1]','VARCHAR(2)')
							,total = x.y.value('(total)[1]','numeric(18,2)')
						FROM @table t
						CROSS APPLY t.xmlComp.nodes('//infoFactura/pagos/pago') x(y)

						IF NOT EXISTS (SELECT 1 FROM @tblPagos)
							BEGIN
						        INSERT INTO @tblPagos(formapago, total)
						        SELECT '20' formaPago, importeTotal 
                                FROM Recepcion.DocumentoRecibido ci 
                                WHERE idDocumento = @documentId
                            END

					END
				ELSE
					BEGIN
						INSERT INTO @docSustento(totalSinImpuestos)
						SELECT fc.subTotalSinImpuestos
						FROM FacturaCompra fc WITH (NOLOCK)
						WHERE fc.idFacturaCompra = @documentId

						INSERT INTO @taxes (codigo,codigoPorcentaje,baseImponible,valor)
						SELECT im.codigo, ti.codigoPorcentaje, CAST(ROUND( sum(fci.TaxBase),2,1) AS numeric(18,2)), CAST(ROUND( sum(fci.TaxValue),2,1) AS numeric(18,2)) 
						FROM Compra.FacturaImpuesto fci
                        INNER JOIN dbo.TipoIva ti ON ti.idTipoIva = fci.TaxPercentId
                        INNER JOIN dbo.Impuesto im ON im.idImpuesto = fci.TaxId 
						WHERE fci.FacturaCompraId = @documentId
						GROUP BY ti.codigoPorcentaje ,im.codigo

						INSERT INTO @tblPagos(formapago, total)
                        SELECT formaPago, total FROM Compra.FormaPago WHERE idDocumento = @documentId  
					END

				SELECT * FROM @docSustento

				SELECT i.idImpuesto
                ,impuesto = i.descripcion 
				,t.codigo
				,porcentaje = ti.descripcion
				,codigoPorcentaje = t.codigoPorcentaje
				,baseImponible = t.baseImponible
                ,ti.idTarifaImpuesto
				,ti.porcentaje tarifa
				,valorImpuesto = t.valor
			    FROM @taxes t
			    LEFT JOIN Sri.Impuesto i ON t.codigo = i.codigo
			    LEFT JOIN Sri.TarifaImpuesto ti ON i.idImpuesto = ti.idImpuesto AND t.codigoPorcentaje = ti.codigo
			    WHERE t.baseImponible > 0

                SELECT fp.Id formaPagoId
                    ,fp.Codigo
                    ,fp.Descripcion
                    ,p.total
                FROM @tblPagos p 
                    INNER JOIN Sri.FormaPago fp WITH (NOLOCK) ON p.formaPago = fp.Codigo
			END
	END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES('RetencionAtsDocSustento/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
        THROW;
    END CATCH
END
GO
