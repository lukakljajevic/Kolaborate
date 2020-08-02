using Api.Data;
using Api.Helpers.DTOs.User;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}
