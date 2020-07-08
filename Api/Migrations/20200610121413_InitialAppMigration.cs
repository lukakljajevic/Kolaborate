using Microsoft.EntityFrameworkCore.Migrations;

namespace Api.Migrations
{
    public partial class InitialAppMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(maxLength: 255, nullable: false),
                    Description = table.Column<string>(maxLength: 255, nullable: true),
                    StartDate = table.Column<string>(maxLength: 10, nullable: true),
                    EndDate = table.Column<string>(maxLength: 10, nullable: true),
                    CompletedOn = table.Column<string>(maxLength: 10, nullable: true),
                    CreatedBy = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        "FK_Projects_AspNetUsers",
                        column: x => x.CreatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
