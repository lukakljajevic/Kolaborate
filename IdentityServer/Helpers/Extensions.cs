using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Helpers
{
    public static class Extensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
        }

        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "preferred_username").Value;
        }

        public static string GetUserFullName(this ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "fullName").Value;
        }
    }
}
