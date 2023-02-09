select * from ApiPrinter.TipoImpresora

--ALTER TABLE ApiPrinter.TipoImpresora add formato VARCHAR(200)
--                                        ,isThermal BIT DEFAULT 1

--alter table ApiPrinter.TipoImpresora add deviceInfo VARCHAR(MAX)

--update ApiPrinter.TipoImpresora set formato = 'Image', isThermal = 1 WHERE idTipoImpresora in (1,2)
--update ApiPrinter.TipoImpresora set formato = 'Image', isThermal = 0 WHERE idTipoImpresora in (3)


--update ApiPrinter.TipoImpresora set deviceInfo = '<DeviceInfo><OutputFormat>EMF</OutputFormat><PageWidth>2.99in</PageWidth><PageHeight>11.69in</PageHeight><MarginTop>0.0in</MarginTop><MarginLeft>0.0in</MarginLeft><MarginRight>0.0in</MarginRight><MarginBottom>0.0in</MarginBottom></DeviceInfo>' WHERE idTipoImpresora in (1,2)

--update ApiPrinter.TipoImpresora set deviceInfo = '<DeviceInfo><OutputFormat>EMF</OutputFormat></DeviceInfo>' WHERE idTipoImpresora in (3)

--UPDATE ApiPrinter.TipoImpresora SET estado = 1
--UPDATE ApiPrinter.TipoImpresora SET formato = 'PDF' where idTipoImpresora = 3
