using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Helpers
{
    public class LoginViewModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string ReturnUrl { get; set; }
    }
}
