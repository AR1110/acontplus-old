USE Acontplus

IF OBJECT_ID('FactElect.Doc_Elect_Error_Get_Id') IS NOT NULL
	DROP PROCEDURE FactElect.Doc_Elect_Error_Get_Id
GO

--- FactElect.Doc_Elect_Error_Get_Id 118641
CREATE PROCEDURE FactElect.Doc_Elect_Error_Get_Id 
    @id INT
AS
BEGIN
    SET NOCOUNT ON; 
    
    DECLARE @code CHAR(1)
    DECLARE @data NVARCHAR(MAX)
      
	SET @data = (SELECT ISNULL(estado, CAST(0 AS BIT))      estado
                        , mensaje
                        , ISNULL(informacionAdicional, '')  informacionAdicional
                        , tipo
                        , fechaRegistro 
                 FROM DocumentoElectronicoError WITH (NOLOCK) 
                 WHERE idDocumentoElectronico = @id FOR JSON PATH)
    
    IF @data IS NULL
        BEGIN
            SELECT Common.ufnSpResponse('0', 'La transacción no devolvio respuesta', '')
            RETURN
        END

    SELECT Common.ufnSpResponse('1', 'Listado exitosamente', @data)
END 

