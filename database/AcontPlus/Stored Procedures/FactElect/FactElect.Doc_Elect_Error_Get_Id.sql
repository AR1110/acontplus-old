

IF OBJECT_ID('FactElect.Doc_Elect_Error_Get_Id') IS NOT NULL
	DROP PROCEDURE FactElect.Doc_Elect_Error_Get_Id
GO

CREATE PROCEDURE FactElect.Doc_Elect_Error_Get_Id	@json NVARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	DECLARE @claveAcceso NVARCHAR(200);

	SELECT @claveAcceso = claveAcceso FROM OPENJSON(@json)WITH(claveAcceso NVARCHAR(200) '$.claveAcceso')

	SELECT estado, mensaje, informacionAdicional, tipo, fechaRegistro  FROM DocumentoElectronicoError WHERE claveAcceso= @claveAcceso;


END 

