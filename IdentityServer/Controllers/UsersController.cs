using IdentityServer.Helpers;
using IdentityServer.Helpers.DTOs;
using IdentityServer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Controllers
{
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

        [HttpPost("taken")]
        public async Task<IActionResult> CheckUsername([FromBody] CheckUsernameDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null)
                return Ok(new { isTaken = false });
            return Ok(new { isTaken = true });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromForm] UserUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found." });

            if (!user.ExternalLogin)
			{
                var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
                if (!validPassword)
                    return BadRequest(new { message = "Invalid password." });
            }

            user.FullName = dto.FullName;
            user.UserName = dto.Username;

            var updateResult = await _userManager.UpdateAsync(user);

            if (updateResult.Succeeded)
                return Ok();
            return BadRequest();
        }

        public string GenerateCurrentDateTime()
        {
            var date = DateTime.Now;
            return $"({date.Day}.{date.Month}.{date.Year}-{date.Hour}-{date.Minute}-{date.Second})";
        }

    }

    
}
