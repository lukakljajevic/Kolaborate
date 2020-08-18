using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Helpers.ViewModels
{
    public class ExternalRegisterViewModel
    {
        public string Username { get; set; }
        public string FullName { get; set; }
		public string Email { get; set; }
		public string ReturnUrl { get; set; }
        public bool InvalidUsername { get; set; }
        public string InvalidUsernameMessage { get; set; }
        public bool InvalidFullName { get; set; }
        public string InvalidFullNameMessage { get; set; }
    }
}
