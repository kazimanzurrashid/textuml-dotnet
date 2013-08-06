namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class ShareMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Shares",
                c => new
                {
                    Id = c.Int(false, true),
                    DocumentId = c.Int(false),
                    UserId = c.String(maxLength: 128),
                    CanEdit = c.Boolean(false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Documents", t => t.DocumentId)
                .ForeignKey("dbo.Users", t => t.UserId);

            CreateIndex("dbo.Shares", new[] { "DocumentId", "UserId" });
        }

        public override void Down()
        {
            DropIndex("dbo.Documents", new[] { "DocumentId", "UserId" });
            DropForeignKey("dbo.Shares", "DocumentId", "dbo.Documents");
            DropForeignKey("dbo.Shares", "UserId", "dbo.Users");
            DropTable("dbo.Shares");
        }
    }
}