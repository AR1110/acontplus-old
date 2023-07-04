namespace Restaurant.API.Dtos
{
    public class UserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public List<UserRoleDto> roles { get; set; }
    }
}