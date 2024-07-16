use acontplus  
--drop table  Ventas.CreditoGarante
CREATE TABLE Ventas.CreditoGarante (
    idCreditoGarante INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    idCuentaPorCobrar INT NOT NULL,
    idCliente INT NOT NULL,
    idUsuario INT NOT NULL,
    fechaRegistro DATETIME NOT NULL,
    updatedAt DATETIME NULL,
    estado BIT DEFAULT 1,

    CONSTRAINT FK_CreditoGarante_CuentaPorCobrar FOREIGN KEY (idCuentaPorCobrar) REFERENCES Contabilidad.CuentaPorCobrar(idCuentaPorCobrar),
    CONSTRAINT FK_CreditoGarante_Cliente FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    CONSTRAINT FK_CreditoGarante_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);
 
