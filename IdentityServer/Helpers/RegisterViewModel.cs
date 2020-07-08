using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Helpers
{
    public class RegisterViewModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string ReturnUrl { get; set; }
        public string FullName { get; set; }
    }
}
