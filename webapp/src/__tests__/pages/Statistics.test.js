const { User, Statistics } = require('../services/user-model');

describe('Creating test user', () => {
  beforeAll(async () => {
    
    await User.create({
      username: 'testuser',
      password: 'test123',
      name: 'Test',
      surname: 'User'
    });

    // Crear las estadísticas de usuario de prueba
    await Statistics.create({
      username: 'testuser',
      the_callenge_earned_money: 100,
      the_callenge_correctly_answered_questions: 10,
      the_callenge_incorrectly_answered_questions: 5,
      the_callenge_total_time_played: 3600,
      the_callenge_games_played: 20,
      wise_men_stack_earned_money: 50,
      wise_men_stack_correctly_answered_questions: 8,
      wise_men_stack_incorrectly_answered_questions: 2,
      wise_men_stack_games_played: 15,
      warm_question_earned_money: 80,
      warm_question_correctly_answered_questions: 12,
      warm_question_incorrectly_answered_questions: 3,
      warm_question_passed_questions: 2,
      warm_question_games_played: 18,
      discovering_cities_earned_money: 120,
      discovering_cities_correctly_answered_questions: 15,
      discovering_cities_incorrectly_answered_questions: 6,
      discovering_cities_games_played: 25
    });
  });

});