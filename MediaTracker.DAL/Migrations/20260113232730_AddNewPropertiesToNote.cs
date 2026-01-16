using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediaTracker.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddNewPropertiesToNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "TimeSpan",
                schema: "App",
                table: "Notes",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "App",
                table: "Notes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                schema: "App",
                table: "Notes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeSpan",
                schema: "App",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Title",
                schema: "App",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Type",
                schema: "App",
                table: "Notes");
        }
    }
}
