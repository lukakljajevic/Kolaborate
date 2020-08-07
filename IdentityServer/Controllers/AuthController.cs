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
		private readonly IHttpClientFactory _httpClientFactory;

		public AuthController(UserManager<ApplicationUser> userManager,
							  SignInManager<ApplicationUser> signInManager,
							  IIdentityServerInteractionService interactionService,
							  IHttpClientFactory httpClientFactory)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_interactionService = interactionService;
			_httpClientFactory = httpClientFactory;
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
			if (vm.Username == null || vm.Username.Length == 0)
			{
				vm.InvalidUsername = true;
				vm.InvalidUsernameMessage = "Please enter a username.";
				return View(vm);
			}

			if (vm.Password == null || vm.Password.Length == 0)
			{
				vm.InvalidPassword = true;
				vm.InvalidPasswordMessage = "Please enter a password.";
				return View(vm);
			}

			if (vm.Password.Length < 4)
			{
				vm.InvalidPassword = true;
				vm.InvalidPasswordMessage = "Password must be at least 4 characters long.";
				return View(vm);
			}

			var signInResult = await _signInManager.PasswordSignInAsync(vm.Username, vm.Password, false, false);

			if (signInResult.Succeeded)
			{
				return Redirect(vm.ReturnUrl);
			}

			vm.InvalidUsername = true;
			vm.InvalidPassword = true;
			vm.InvalidPasswordMessage = "Invalid username or password.";
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
			if (vm.Username == null || vm.Username.Length == 0)
			{
				vm.InvalidUsername = true;
				vm.InvalidUsernameMessage = "Please enter a username.";
				return View(vm);
			}

			var u = await _userManager.FindByNameAsync(vm.Username);

			if (u != null)
			{
				vm.InvalidUsername = true;
				vm.InvalidUsernameMessage = "Username already taken.";
				return View(vm);
			}

			if (vm.FullName == null || vm.FullName.Length == 0)
			{
				vm.InvalidFullName = true;
				vm.InvalidFullNameMessage = "Please enter your full name.";
				return View(vm);
			}

			if (vm.Password == null || vm.Password.Length == 0)
			{
				vm.InvalidPassword = true;
				vm.InvalidPasswordMessage = "Please enter a password.";
				return View(vm);
			}

			if (vm.Password != vm.ConfirmPassword)
			{
				vm.InvalidConfirmPassword = true;
				vm.InvalidConfirmPasswordMessage = "Passwords must match.";
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

			vm.InvalidPassword = true;
			vm.InvalidPasswordMessage = "Password must be at least 4 characters long.";
			return View(vm);
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
