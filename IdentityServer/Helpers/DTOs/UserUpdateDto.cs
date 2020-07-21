using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Helpers.DTOs
{
    public class UserUpdateDto
    {
        public string Username { get; set; }
        public string FullName { get; set; }
    }
}
