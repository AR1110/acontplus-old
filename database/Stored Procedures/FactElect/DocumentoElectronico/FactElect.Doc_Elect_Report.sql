USE AcontPlus
GO
CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Report @idRol INT,@json NVARCHAR(max)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    --> Global 
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    --> Recuperar Datos
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

    --> Factura 
    IF @tipo = 1
        BEGIN
            SET @sql = 'SELECT de.nombreComercial
                              ,de.claveAcceso
	                          ,Format(de.fechaEmision,''dd/MM/yyyy'') as fechaEmision
	                          ,de.rucReceptor
	                          ,de.razonSocial
	                          ,(SELECT CAST(f.subTotalNetoExentoIva as numeric(18,2)) FROM dbo.Factura f WITH (NOLOCK) WHERE f.idFactura = de.idDocumento) as subTotalExento
	                          ,(SELECT CAST(f.subTotalNetoIvaCero   as numeric(18,2)) FROM dbo.Factura f WITH (NOLOCK) WHERE f.idFactura = de.idDocumento) as subTotalIvaCero
	                          ,(SELECT CAST(f.subTotalSinImpuestos  as numeric(18,2)) FROM dbo.Factura f WITH (NOLOCK) WHERE f.idFactura = de.idDocumento) as precioTotalSinImpuestos
	                          ,(SELECT CAST(f.iva   as numeric(18,2)) FROM dbo.Factura f WITH (NOLOCK) WHERE f.idFactura = de.idDocumento) as iva
	                          ,(SELECT CAST(f.total as numeric(18,2)) FROM dbo.Factura f WITH (NOLOCK) WHERE f.idFactura = de.idDocumento) as total
	                          ,(SELECT TOP 1 dd.serieComprobante FROM FactElect.DocRelacionado dr WITH (NOLOCK)
								                        INNER JOIN Recepcion.DocumentoRecibido dd WITH (NOLOCK) ON dd.idDocumento = dr.idDocumentoRecibido
								                        WHERE dr.claveAcceso = de.claveAcceso GROUP BY serieComprobante) as nroRetencion
	                          ,(SELECT SUM(dr.valorRetenido) FROM FactElect.DocRelacionado  dr WITH (NOLOCK) WHERE dr.claveAcceso = de.claveAcceso) as totalRet
                              ,de.usuario
                        FROM FactElect.v_DocElectronico de WITH (NOLOCK)
                        WHERE de.codDoc = ''01'' AND de.idEntidad = @idEntidad '

            SET @params = '@idEntidad INT'

            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad = @idEntidad
            RETURN 
        END 

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN 
END 
