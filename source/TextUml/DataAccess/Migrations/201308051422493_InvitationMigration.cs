namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class InvitationMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Invitations",
                c => new
                {
                    Id = c.Int(false, true),
                    Email = c.String(false, 256),
                    DocumentId = c.Int(false),
                    CanEdit = c.Boolean(false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Documents", t => t.DocumentId);

            CreateIndex(
                "dbo.Invitations",
                new[] { "DocumentId", "Email" },
                true);
        }

        public override void Down()
        {
            DropIndex("dbo.Invitations", new[] { "DocumentId", "Email" });

            DropForeignKey("dbo.Invitations", "DocumentId", "dbo.Documents");

            DropTable("dbo.Invitations");
        }
    }
}