USE AcontplusHist
GO
INSERT INTO FactElect.DocumentoElectronico([Ambiente], [AutomaticSriAuth], [CompanyId], [ClaveAcceso], [CodDoc], [CodEstado], [ComprobanteId],
	[EstablecimientoId], [Estab], [FechaEmision], [FechaAutorizacion], [CustomerId], [PuntoEmisionId], [PtoEmi], [Secuencial],
	[VersionComp], [XmlSri], [CreatedAt], [UserId])
SELECT codAmbiente, ISNULL(isAutomatic,0), idEntidad, claveAcceso, codDoc, codEstado, idDocumentoElectronico,
	idEstablecimiento, estab, fechaEmision, fechaAutorizacion, c.Id, ve.idPuntoEmision, ve.ptoEmi, ve.secuencial,
	ve.versionComp, ve.XmlSri, ve.FechaRegistro, idUsuario
FROM Acontplus.FactElect.v_DocElectronico ve WITH (NOLOCK)
	INNER JOIN Acontplus.Customer.Customer c WITH (NOLOCK) ON ve.rucReceptor = c.IDCard

	--SELECT * FROM FactElect.DocumentoElectronico
	--select * from Acontplus.FactElect.v_DocElectronico ve where ve.rucReceptor NOT IN (SELECT IDCard FROM Acontplus.Customer.Customer )

	 --INSERT INTO Acontplus.Customer.Customer(IDType, IDCard, BusinessName, TradeName, email, telephone, [Address], SriValidation)
		--					SELECT TOP 1 ti.codigoSri, c.numeroIdentificacion, c.nombreFiscal, c.nombreComercial, correo, telefono, direccion, validationSri FROM Acontplus.dbo.cliente c
		--					inner join Acontplus.dbo.tipoIdentificacion ti ON c.idTipoIdentificacion = ti.idTipoIdentificacion
		--					where numeroIdentificacion = '02011200730'
		--					ORDER BY idCliente DESC

     --UPDATE Acontplus.dbo.DocumentoElectronico SET xmlSri = NULL