

IF OBJECT_ID('FactElect.Doc_Elect_Error_Get_Id') IS NOT NULL
	DROP PROCEDURE FactElect.Doc_Elect_Error_Get_Id
GO

CREATE PROCEDURE FactElect.Doc_Elect_Error_Get_Id @id INT
AS
BEGIN 
	SET NOCOUNT ON; 
	SELECT estado, mensaje, informacionAdicional, tipo, fechaRegistro FROM DocumentoElectronicoError WITH (NOLOCK) WHERE idDocumentoElectronico = @id; 
END 

