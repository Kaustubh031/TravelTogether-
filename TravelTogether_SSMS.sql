-- ============================================
--   TravelTogether Database Setup Script
--   Run this in SSMS as a fresh setup
-- ============================================

-- 1. Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TravelTogetherDb')
BEGIN
    CREATE DATABASE TravelTogetherDb;
END
GO

USE TravelTogetherDb;
GO

-- ============================================
-- 2. EF Migrations tracking table
-- ============================================
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId]    nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32)  NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END
GO

-- ============================================
-- 3. Users
-- ============================================
IF OBJECT_ID(N'[Users]') IS NULL
BEGIN
    CREATE TABLE [Users] (
        [Id]               int           NOT NULL IDENTITY,
        [Name]             nvarchar(max) NOT NULL,
        [Email]            nvarchar(max) NOT NULL,
        [PasswordHash]     nvarchar(max) NOT NULL,
        [Photo]            nvarchar(max) NULL,
        [TravelStyle]      nvarchar(max) NOT NULL DEFAULT 'Budget',
        [Languages]        nvarchar(max) NULL,
        [Bio]              nvarchar(max) NULL,
        [EmergencyContact] nvarchar(max) NULL,
        [IsVerified]       bit           NOT NULL DEFAULT 0,
        [IsPremium]        bit           NOT NULL DEFAULT 0,
        [Rating]           float         NOT NULL DEFAULT 0,
        [ReviewCount]      int           NOT NULL DEFAULT 0,
        [CreatedAt]        datetime2     NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
    PRINT 'Table [Users] created.';
END
GO

-- ============================================
-- 4. Trips
-- ============================================
IF OBJECT_ID(N'[Trips]') IS NULL
BEGIN
    CREATE TABLE [Trips] (
        [Id]             int           NOT NULL IDENTITY,
        [OwnerId]        int           NOT NULL,
        [Origin]         nvarchar(max) NOT NULL,
        [Destination]    nvarchar(max) NOT NULL,
        [StartDate]      datetime2     NOT NULL,
        [EndDate]        datetime2     NOT NULL,
        [TravelMode]     nvarchar(max) NOT NULL DEFAULT 'Flight',
        [MaxCompanions]  int           NOT NULL DEFAULT 3,
        [Description]    nvarchar(max) NULL,
        [Status]         nvarchar(max) NOT NULL DEFAULT 'Open',
        [CreatedAt]      datetime2     NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_Trips] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Trips_Users_OwnerId]
            FOREIGN KEY ([OwnerId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_Trips_OwnerId] ON [Trips] ([OwnerId]);
    PRINT 'Table [Trips] created.';
END
GO

-- ============================================
-- 5. Matches
-- ============================================
IF OBJECT_ID(N'[Matches]') IS NULL
BEGIN
    CREATE TABLE [Matches] (
        [Id]          int           NOT NULL IDENTITY,
        [TripId]      int           NOT NULL,
        [RequesterId] int           NOT NULL,
        [OwnerId]     int           NOT NULL,
        [Status]      nvarchar(max) NOT NULL DEFAULT 'Pending',
        [CreatedAt]   datetime2     NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_Matches] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Matches_Trips_TripId]
            FOREIGN KEY ([TripId]) REFERENCES [Trips] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Matches_Users_RequesterId]
            FOREIGN KEY ([RequesterId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Matches_Users_OwnerId]
            FOREIGN KEY ([OwnerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_Matches_TripId]      ON [Matches] ([TripId]);
    CREATE INDEX [IX_Matches_RequesterId] ON [Matches] ([RequesterId]);
    CREATE INDEX [IX_Matches_OwnerId]     ON [Matches] ([OwnerId]);
    PRINT 'Table [Matches] created.';
END
GO

-- ============================================
-- 6. Messages
-- ============================================
IF OBJECT_ID(N'[Messages]') IS NULL
BEGIN
    CREATE TABLE [Messages] (
        [Id]          int           NOT NULL IDENTITY,
        [SenderId]    int           NOT NULL,
        [ReceiverId]  int           NOT NULL,
        [Room]        nvarchar(max) NOT NULL,
        [Text]        nvarchar(max) NOT NULL,
        [IsGroupRoom] bit           NOT NULL DEFAULT 0,
        [CreatedAt]   datetime2     NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_Messages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Messages_Users_SenderId]
            FOREIGN KEY ([SenderId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Messages_Users_ReceiverId]
            FOREIGN KEY ([ReceiverId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_Messages_SenderId]   ON [Messages] ([SenderId]);
    CREATE INDEX [IX_Messages_ReceiverId] ON [Messages] ([ReceiverId]);
    PRINT 'Table [Messages] created.';
END
GO

-- ============================================
-- 7. Reviews
-- ============================================
IF OBJECT_ID(N'[Reviews]') IS NULL
BEGIN
    CREATE TABLE [Reviews] (
        [Id]         int           NOT NULL IDENTITY,
        [ReviewerId] int           NOT NULL,
        [RevieweeId] int           NOT NULL,
        [TripId]     int           NOT NULL,
        [Rating]     int           NOT NULL,
        [Comment]    nvarchar(max) NULL,
        [CreatedAt]  datetime2     NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Reviews_Users_ReviewerId]
            FOREIGN KEY ([ReviewerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Reviews_Users_RevieweeId]
            FOREIGN KEY ([RevieweeId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Reviews_Trips_TripId]
            FOREIGN KEY ([TripId]) REFERENCES [Trips] ([Id]) ON DELETE CASCADE
    );
    -- Prevent duplicate reviews for same trip between same two users
    CREATE UNIQUE INDEX [IX_Reviews_ReviewerId_RevieweeId_TripId]
        ON [Reviews] ([ReviewerId], [RevieweeId], [TripId]);
    CREATE INDEX [IX_Reviews_RevieweeId] ON [Reviews] ([RevieweeId]);
    CREATE INDEX [IX_Reviews_TripId]     ON [Reviews] ([TripId]);
    PRINT 'Table [Reviews] created.';
END
GO

-- ============================================
-- 8. Mark migration as applied
--    (so dotnet run does not re-run it)
-- ============================================
IF NOT EXISTS (
    SELECT 1 FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260605122132_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260605122132_InitialCreate', N'10.0.8');
END
GO

-- ============================================
-- Done! All tables created in TravelTogetherDb
-- ============================================
PRINT '======================================';
PRINT 'TravelTogetherDb setup complete!';
PRINT 'Tables: Users, Trips, Matches, Messages, Reviews';
PRINT '======================================';
GO
