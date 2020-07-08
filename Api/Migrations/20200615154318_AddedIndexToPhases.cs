using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class AddedIndexToPhases : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Index",
                table: "Phases",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Index",
                table: "Phases");
        }
    }
}
