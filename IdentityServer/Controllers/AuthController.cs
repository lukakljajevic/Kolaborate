using IdentityServer.Helpers;
using IdentityServer.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer.Controllers
{

    public class AuthController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IIdentityServerInteractionService _interactionService;

        public AuthController(UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager,
                              IIdentityServerInteractionService interactionService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _interactionService = interactionService;
        }

        [HttpGet]
        public async Task<IActionResult> Logout(string logoutId)
        {
            await _signInManager.SignOutAsync();

            var logoutRequest = await _interactionService.GetLogoutContextAsync(logoutId);

            if (string.IsNullOrEmpty(logoutRequest.PostLogoutRedirectUri))
            {
                return RedirectToAction("Index", "Home");
            }

            return Redirect(logoutRequest.PostLogoutRedirectUri);
        }

        [HttpGet]
        public IActionResult Login(string returnUrl)
        {
            return View(new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel vm)
        {

            var signInResult = await _signInManager.PasswordSignInAsync(vm.Username, vm.Password, false, false);
            if (signInResult.Succeeded)
            {
                return Redirect(vm.ReturnUrl);
            }

            return View(vm);
        }

        [HttpGet]
        public IActionResult Register(string returnUrl)
        {
            return View(new RegisterViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel vm)
        {

            if (vm.Password != vm.ConfirmPassword || string.IsNullOrEmpty(vm.FullName))
            {
                return View(vm);
            }

            var user = new ApplicationUser { 
                UserName = vm.Username,
                FullName = vm.FullName
            };

            var signUpResult = await _userManager.CreateAsync(user, vm.Password);
            if (signUpResult.Succeeded)
            {
                await _signInManager.PasswordSignInAsync(vm.Username, vm.Password, false, false);
                return Redirect(vm.ReturnUrl);
            }

            return View();
        }

        [HttpGet]
        [Route("auth/getFullName/{userId}")]
        public async Task<string> GetFullName(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user.FullName;
        }

        [HttpPost]
        [Route("auth/password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

            if (result.Succeeded)
                return Ok();

            return BadRequest();
        }
    }
}
