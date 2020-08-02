using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers.DTOs.User
{
    public class UserCreateDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
    }
}
