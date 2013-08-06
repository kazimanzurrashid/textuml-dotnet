namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class DocumentMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Documents",
                c => new
                {
                    Id = c.Int(false, true),
                    Title = c.String(false, 128),
                    Content = c.String(),
                    CreatedAt = c.DateTime(false),
                    UpdatedAt = c.DateTime(false),
                    UserId = c.String(maxLength: 128),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId);

            CreateIndex("dbo.Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
        }

        public override void Down()
        {
            DropIndex("dbo.Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
            DropForeignKey("dbo.Documents", "UserId", "dbo.Users");
            DropTable("dbo.Documents");
        }
    }
}