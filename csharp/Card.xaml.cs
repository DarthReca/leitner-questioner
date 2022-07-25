using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
public record struct QuestionAnswer(string Question, string Answer);

namespace leitner
{
    public partial class Card : UserControl
    {
        private List<QuestionAnswer> _questionAnswers;
        private int _currentQuestion = -1;
        private Random _rng;

        public List<QuestionAnswer> QuestionAnswers
        {
            get { return _questionAnswers; }
        }

        public Card(List<QuestionAnswer> questionsAnswers)
        {
            _questionAnswers = questionsAnswers;
            _rng = new Random();
            InitializeComponent();
            UpdateCard();
        }

        void UpdateCard()
        {
            Remaining.Content = $"Remaining: {_questionAnswers.Count}";
        }

        void NextQuestion(object sender, RoutedEventArgs e)
        {
            _currentQuestion = _rng.Next(_questionAnswers.Count - 1);
            Question.Content = _questionAnswers[_currentQuestion].Question;
            Answer.Content = "";
        }

        void ShowAnswer(object sender, RoutedEventArgs e)
        {
            if (_currentQuestion != -1)
            {
                Answer.Content = _questionAnswers[_currentQuestion].Answer;
            }
        }

        public QuestionAnswer? RemoveQuestion()
        {
            QuestionAnswer? questionAnswer = null;
            if (_currentQuestion != -1)
            {
                questionAnswer = _questionAnswers[_currentQuestion];
                _questionAnswers.RemoveAt(_currentQuestion);
                _currentQuestion = -1;
                UpdateCard();
            }
            return questionAnswer;
        }

        public void AddQuestion(QuestionAnswer questionAnswer)
        {
            _questionAnswers.Add(questionAnswer);
            UpdateCard();
        }
        
        
    }
}