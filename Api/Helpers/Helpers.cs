using Api.Helpers.DTOs;
using Api.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers
{
    public static class Extensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
        }

        public static string GetUserFullName(this ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == "fullName").Value;
        }
    }
}
