using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Helpers.DTOs
{
    public class UserUpdateDto
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public IFormFile Avatar { get; set; }
        public string Password { get; set; }
    }
}
