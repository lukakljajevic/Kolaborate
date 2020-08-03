using Api.Data;
using Api.Helpers;
using Api.Helpers.DTOs.User;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBugTrackerRepository _repo;

        public UsersController(IMapper mapper, IBugTrackerRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // POST /api/users
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
        {
            var u = await _repo.GetUser(dto.Id);
            if (u != null) return Ok();

            var user = _mapper.Map<User>(dto);
            user.Avatar = "";
            _repo.Add(user);
            if (await _repo.SaveAll()) return Ok();
            return BadRequest();
        }

        // PUT /api/users
        [HttpPut, DisableRequestSizeLimit]
        public async Task<IActionResult> Update([FromForm] UserUpdateDto dto)
        {
            var userId = User.GetUserId();
            var user = await _repo.GetUser(userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            user.FullName = dto.FullName;
            user.Username = dto.Username;

            

            if (dto.Avatar != null && dto.Avatar.Length > 0)
            {
                var avatar = dto.Avatar;
                var folderName = Path.Combine("Resources", "Avatars");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                var fileName = ContentDispositionHeaderValue.Parse(avatar.ContentDisposition).FileName.Trim('"');
                var fileExtension = fileName.Split('.')[^1];
                fileName = $"{user.Username}-{GenerateCurrentDateTime()}.{fileExtension}";

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


            if (await _repo.SaveAll())
                return Ok(new { avatarUrl = user.Avatar });
            return BadRequest();
        }

        // GET /users/avatar
        [HttpGet("avatar")]
        public async Task<IActionResult> GetAvatar()
        {
            var userId = User.GetUserId();
            var user = await _repo.GetUser(userId);

            return Ok(new { user.Avatar });
        }


        public string GenerateCurrentDateTime()
        {
            var date = DateTime.Now;
            return $"({date.Day}.{date.Month}.{date.Year}-{date.Hour}-{date.Minute}-{date.Second})";
        }
    }
}
