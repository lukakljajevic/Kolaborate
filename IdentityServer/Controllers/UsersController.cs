using IdentityServer.Helpers;
using IdentityServer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost]
        public IActionResult GetUsers([FromBody] GetUsersDto dto)
        {
            var users = _userManager.Users
                .Where(u => u.FullName.ToLower()
                .StartsWith(dto.FullName.ToLower()))
                .Select(u => new { u.Id, u.FullName, u.UserName });
            return Ok(users);
        }

        
        
    }
}
