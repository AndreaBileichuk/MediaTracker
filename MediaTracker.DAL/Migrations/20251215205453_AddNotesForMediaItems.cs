using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MediaTracker.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesForMediaItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserNotes",
                schema: "App",
                table: "MediaItems");

            migrationBuilder.AddColumn<int>(
                name: "ExternalId",
                schema: "App",
                table: "MediaItems",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PosterPath",
                schema: "App",
                table: "MediaItems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Notes",
                schema: "App",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Text = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    CreateAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    MediaItemId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notes_MediaItems_MediaItemId",
                        column: x => x.MediaItemId,
                        principalSchema: "App",
                        principalTable: "MediaItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notes_MediaItemId",
                schema: "App",
                table: "Notes",
                column: "MediaItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notes",
                schema: "App");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                schema: "App",
                table: "MediaItems");

            migrationBuilder.DropColumn(
                name: "PosterPath",
                schema: "App",
                table: "MediaItems");

            migrationBuilder.AddColumn<string>(
                name: "UserNotes",
                schema: "App",
                table: "MediaItems",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);
        }
    }
}
