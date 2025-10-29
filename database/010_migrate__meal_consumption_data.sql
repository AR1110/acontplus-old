BEGIN TRANSACTION;

BEGIN TRY
    -- MealScheduleSetting
    IF NOT EXISTS (SELECT 1 FROM [Restaurant].[MealScheduleSetting])
    BEGIN
        SET IDENTITY_INSERT [Restaurant].[MealScheduleSetting] ON;
        INSERT INTO [Restaurant].[MealScheduleSetting] 
            ([Id], [EstablishmentId], [MealCode], [Description], [StartTime], [EndTime], [DisplayOrder], [IsActive], [CreatedAt])
        VALUES
            (1, 339, 'D', 'Desayuno', '00:01:00', '12:00:00', 1, 1, '2024-03-30T10:00:00'),
            (2, 339, 'A', 'Almuerzo', '12:01:00', '17:59:00', 2, 1, '2024-03-30T10:00:00'),
            (3, 339, 'C', 'Cena', '18:00:00', '23:59:00', 3, 1, '2024-03-30T10:00:00'),
            (4, 421, 'D', 'Desayuno', '05:00:00', '10:59:00', 1, 1, '2024-07-30T10:00:00'),
            (5, 421, 'A', 'Almuerzo', '11:00:00', '15:30:00', 2, 1, '2024-07-30T10:00:00'),
            (6, 421, 'C', 'Cena', '15:31:00', '22:00:00', 3, 1, '2024-07-30T10:00:00'),
            (7, 340, 'D', 'Desayuno', '08:00:00', '10:00:00', 1, 1, '2024-05-30T10:00:00'),
            (8, 340, 'A', 'Almuerzo', '10:01:00', '14:30:00', 2, 1, '2024-05-30T10:00:00'),
            (9, 340, 'C', 'Cena', '14:31:00', '20:00:00', 3, 1, '2024-05-30T10:00:00');
        SET IDENTITY_INSERT [Restaurant].[MealScheduleSetting] OFF;
        PRINT 'MealScheduleSetting seeded successfully';
    END

    -- MealPlan
    IF NOT EXISTS (SELECT 1 FROM [Restaurant].[MealPlan])
    BEGIN
        SET IDENTITY_INSERT [Restaurant].[MealPlan] ON;
        INSERT INTO [MealPlan] 
            ([Id], [Name], [Description], [DailyMealLimit], [MonthlyMealLimit], [SubsidyPercentage], [IsActive], [CreatedAt])
        VALUES
            (1, 'Plan Básico', 'Plan básico de alimentación con límites estándar', 2, 44, 70.00, 1, '2024-03-30T10:00:00'),
            (2, 'Plan Completo', 'Plan completo con acceso a todas las comidas', 3, 66, 85.00, 1, '2024-03-30T10:00:00'),
            (3, 'Plan Ejecutivo', 'Plan ejecutivo con mayores beneficios', 3, 66, 90.00, 1, '2024-03-30T10:00:00');
        SET IDENTITY_INSERT [MealPlan] OFF;
        PRINT 'MealPlan seeded successfully';
    END

    -- MealPlanSchedule
    IF NOT EXISTS (SELECT 1 FROM [Restaurant].[MealPlanSchedule])
    BEGIN
        SET IDENTITY_INSERT [Restaurant].[MealPlanSchedule] ON;
        INSERT INTO [Restaurant].[MealPlanSchedule] 
            ([Id], [MealPlanId], [MealScheduleSettingId], [IsIncluded])
        VALUES
            (1, 1, 1, 1), (2, 1, 2, 1), (3, 1, 3, 1), (4, 1, 4, 1), (5, 1, 5, 1),
            (6, 1, 6, 1), (7, 1, 7, 1), (8, 1, 8, 1), (9, 1, 9, 1), (10, 2, 1, 1),
            (11, 2, 2, 1), (12, 2, 3, 1), (13, 2, 4, 1), (14, 2, 5, 1), (15, 2, 6, 1),
            (16, 2, 7, 1), (17, 2, 8, 1), (18, 2, 9, 1), (19, 3, 1, 1), (20, 3, 2, 1),
            (21, 3, 3, 1), (22, 3, 4, 1), (23, 3, 5, 1), (24, 3, 6, 1), (25, 3, 7, 1),
            (26, 3, 8, 1), (27, 3, 9, 1);
        SET IDENTITY_INSERT [Restaurant].[MealPlanSchedule] OFF;
        PRINT 'MealPlanSchedule seeded successfully';
    END

    -- MonthlyMealAllowance
    --IF NOT EXISTS (SELECT 1 FROM [Restaurant].[MonthlyMealAllowance])
    --BEGIN
    --    SET IDENTITY_INSERT [Restaurant].[MonthlyMealAllowance] ON;
    --    INSERT INTO [Restaurant].[MonthlyMealAllowance] 
    --        ([Id], [EmployeeId], [Year], [Month], [AllocatedMeals], [ConsumedMeals], [RemainingMeals], [TotalSubsidy], [EmployeeContribution], [CreatedAt], [LastUpdated])
    --    VALUES
    --        (1, 1, 2025, 3, 66, 0, 66, 0.0, 0.0, '2025-03-01T00:00:00', '2025-03-01T00:00:00'),
    --        (2, 2, 2025, 3, 44, 0, 44, 0.0, 0.0, '2025-03-01T00:00:00', '2025-03-01T00:00:00'),
    --        (3, 3, 2025, 3, 66, 0, 66, 0.0, 0.0, '2025-03-01T00:00:00', '2025-03-01T00:00:00'),
    --        (4, 4, 2025, 3, 44, 0, 44, 0.0, 0.0, '2025-03-01T00:00:00', '2025-03-01T00:00:00');
    --    SET IDENTITY_INSERT [Restaurant].[MonthlyMealAllowance] OFF;
    --    PRINT 'MonthlyMealAllowance seeded successfully';
    --END

    COMMIT TRANSACTION;
    PRINT 'All seed data completed successfully.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Seed data failed: ' + ERROR_MESSAGE();
    THROW;
END CATCH;
