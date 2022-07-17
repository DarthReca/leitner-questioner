using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Channels;
using System.Windows;
using System.Windows.Controls;

namespace leitner
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        private string[] _files;
        
        public MainWindow()
        {
            InitializeComponent();
            
            _files = Directory.GetFiles("./boxes", "*.csv");

            for (int i = 0; i < _files.Length; i++)
            {
                Grid.ColumnDefinitions.Add(new ColumnDefinition());
                
                var parsedCsv = 
                    from line in File.ReadLines(_files[i])
                    select line.Split(',');
                var questionAnswer = parsedCsv
                    .Select(x => new QuestionAnswer(x[0], x[1]))
                    .ToList();
                
                Card card = new Card(questionAnswer);
                card.Correct.Click += (sender, args) => MoveQuestion(card, 1); 
                card.Wrong.Click += (sender, args) => MoveQuestion(card, -1);
                Grid.Children.Add(card);
                Grid.SetColumn(card, i);
            }
        }
        

        void MoveQuestion(Card card, int position)
        {
            QuestionAnswer? questionAnswer = card.RemoveQuestion();
            if(!questionAnswer.HasValue) return;
            int column = Grid.GetColumn(card) + position % Grid.Children.Count;
            if (column < 0) column += Grid.Children.Count;
            (Grid.Children[column] as Card).AddQuestion(questionAnswer.Value);
        }

        void Save()
        {
            var questionAnswers = 
                    from Card child in Grid.Children
                    select child.QuestionAnswers;
            

        }
    }
}