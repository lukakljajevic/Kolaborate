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

        [HttpPut("{id}"), DisableRequestSizeLimit]
        public async Task<IActionResult> Update([FromRoute] string id, [FromForm] UserUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound();

            user.FullName = dto.FullName;
            user.UserName = dto.Username;

            var avatar = dto.Avatar;
            var folderName = Path.Combine("Resources", "Avatars");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (avatar.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(avatar.ContentDisposition).FileName.Trim('"');
                var fileExtension = fileName.Split('.')[^1];
                fileName = $"{user.UserName}-{GenerateCurrentDateTime()}.{fileExtension}";
                var fullPath = Path.Combine(pathToSave, fileName);
                var dbPath = Path.Combine(folderName, fileName);

                if (user.Avatar != null)
                {
                    var currentFileName = user.Avatar.Split('\\')[^1];
                    var currentFullpath = Path.Combine(pathToSave, currentFileName);

                    if (System.IO.File.Exists(currentFullpath))
                        System.IO.File.Delete(currentFullpath);
                }
                
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    avatar.CopyTo(stream);
                }

                user.Avatar = dbPath;
            }

            var updateResult = await _userManager.UpdateAsync(user);

            if (updateResult.Succeeded)
                return Ok(new { avatarUrl = user.Avatar });
            return BadRequest();
        }

        public string GenerateCurrentDateTime()
        {
            var date = DateTime.Now;
            return $"({date.Day}.{date.Month}.{date.Year}-{date.Hour}-{date.Minute}-{date.Second})";
        }

    }

    
}
