USE Acontplus
GO

ALTER TABLE Vet.Behavior 
ADD CONSTRAINT fk_vet_behavior_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.BehaviorStatus 
ADD CONSTRAINT fk_vet_behavior_status_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.BehaviorTest 
ADD CONSTRAINT fk_vet_behavior_test_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.Breed 
ADD CONSTRAINT fk_vet_breed_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.Disease 
ADD CONSTRAINT fk_vet_disease_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.DiseaseStatus 
ADD CONSTRAINT fk_vet_disease_status_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.DiseaseType
ADD CONSTRAINT fk_vet_disease_type_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.Gender
ADD CONSTRAINT fk_vet_gender_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.HealthCheck
ADD CONSTRAINT fk_vet_health_check_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.MedicalHistory
ADD CONSTRAINT fk_vet_medical_history_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.Pet
ADD CONSTRAINT fk_vet_pet_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO

ALTER TABLE Vet.PetType
ADD CONSTRAINT fk_vet_pet_type_user_id
FOREIGN KEY (userId) REFERENCES dbo.Usuario(idUsuario)
GO