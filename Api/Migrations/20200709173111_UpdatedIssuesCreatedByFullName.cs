using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class UpdatedIssuesCreatedByFullName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "IssueUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "IssueUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedByFullName",
                table: "Issues",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUsername",
                table: "Issues",
                maxLength: 256,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "IssueUsers");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "IssueUsers");

            migrationBuilder.DropColumn(
                name: "CreatedByFullName",
                table: "Issues");

            migrationBuilder.DropColumn(
                name: "CreatedByUsername",
                table: "Issues");
        }
    }
}
