using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IdentityServer
{
    public class Config
    {
        public static IEnumerable<IdentityResource> IdentityResources = new List<IdentityResource>
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        };

        public static IEnumerable<ApiResource> ApiResources = new List<ApiResource>
        {
            new ApiResource
            {
                Name = "api",
                Scopes = { "api.full_access" }
            }
        };

        public static IEnumerable<Client> Clients = new List<Client>
        {
            new Client
            {
                ClientId = "angular_spa",
                ClientName = "Angular Client",
                RedirectUris = { "http://localhost:4200" },
                PostLogoutRedirectUris = { "http://localhost:4200" },
                AllowedGrantTypes = GrantTypes.Code,
                RequirePkce = true,
                AccessTokenLifetime = 3600*12,
                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "api.full_access"
                },
                AllowAccessTokensViaBrowser = true,
                RequireClientSecret = false,
                AlwaysIncludeUserClaimsInIdToken = true,
                RequireConsent = false,
                AllowedCorsOrigins = { "http://localhost:4200" }
            }
        };

        public static IEnumerable<ApiScope> ApiScopes = new List<ApiScope>
        {
            new ApiScope("api.full_access")
        };

    }
}
