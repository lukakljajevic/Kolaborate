using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs.User
{
    public class UserUpdateDto
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public IFormFile Avatar { get; set; }
        public string Password { get; set; }
    }
}
