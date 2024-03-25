CREATE TABLE Statics (
    username VARCHAR(255) PRIMARY KEY NOT NULL,
    earned_money INT DEFAULT 0,
    classic_correctly_answered_questions INT DEFAULT 0,
    classic_incorrectly_answered_questions INT DEFAULT 0,
    classic_total_time_played INT DEFAULT 0,
    classic_games_played INT DEFAULT 0
    -- Aquí puedes agregar más columnas para otras estadísticas de juegos si es necesario
);

