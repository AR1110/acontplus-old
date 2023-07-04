using System.ComponentModel.DataAnnotations;

namespace Restaurant.API.Dtos
{
    public class RegisterDto
    {
        [Required] 
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
    }
}
