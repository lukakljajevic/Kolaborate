using Microsoft.EntityFrameworkCore.Migrations;

namespace IdentityServer.Data.Migrations.AppMigrations
{
    public partial class ExternalLogin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ExternalLogin",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalLogin",
                table: "AspNetUsers");
        }
    }
}
