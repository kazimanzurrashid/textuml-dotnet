namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class TokenMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Tokens",
                c => new
                {
                    UserId = c.String(false, 128),
                    ActivatedAt = c.DateTime(),
                    ActivationToken = c.String(maxLength: 128),
                    ResetPasswordToken = c.String(maxLength: 128),
                    ResetPasswordTokenExpiredAt = c.DateTime(),
                })
                .PrimaryKey(t => t.UserId)
                .ForeignKey("dbo.Users", t => t.UserId);

            CreateIndex("dbo.Tokens", new[] { "ActivatedAt", "ResetPasswordToken" });
        }

        public override void Down()
        {
            DropIndex("dbo.Tokens", new[] { "ActivatedAt", "ResetPasswordToken" });
            DropForeignKey("dbo.Tokens", "UserId", "dbo.Users");
            DropTable("dbo.Tokens");
        }
    }
}