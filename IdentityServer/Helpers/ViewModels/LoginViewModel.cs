using Microsoft.AspNetCore.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Helpers.ViewModels
{
	public class LoginViewModel
	{
		public string Username { get; set; }
		public string Password { get; set; }
		public string ReturnUrl { get; set; }
		public bool InvalidUsername { get; set; }
		public string InvalidUsernameMessage { get; set; }
		public bool InvalidPassword { get; set; }
		public string InvalidPasswordMessage { get; set; }
	}
}
