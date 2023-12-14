use [Acontplus]
GO 


ALTER TABLE Mechanical.Vehicle ADD CONSTRAINT FK_Vehicle_Country_Id FOREIGN KEY (CountryId) REFERENCES Common.Country(Id) 