using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace PointOfSales
{
    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        public LoginWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            string identificacion = identificacionTxtBox.Text;
            string password = passwordTxtBox.Text;
            // Verify the entered credentials against a data source
            if (IsValidUser(identificacion, password))
            {
                // Navigate to the main application window
                MainWindow mainWindow = new MainWindow();
                mainWindow.Show();
                this.Close();
            }
            else
            {
                MessageBox.Show("Invalid username or password. Please try again.");
            }
        }
        private bool IsValidUser(string username, string password)
        {
            // Implement the logic to verify the entered credentials against a data source
            // For example, you could query a database or call a web service
            // and return true if the user exists and the password matches, otherwise false
            return true;
        }
    }
}
