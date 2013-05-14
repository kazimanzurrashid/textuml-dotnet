namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class AddPrefixToTablesMigration : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Shares", new[] { "DocumentId", "UserId" });
            DropIndex("dbo.Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
            DropIndex("dbo.Users", new[] { "Email" });
            DropForeignKey("dbo.Shares", "DocumentId", "dbo.Documents");
            DropForeignKey("dbo.Shares", "UserId", "dbo.Users");
            DropForeignKey("dbo.Documents", "UserId", "dbo.Users");
            RenameTable("dbo.Users", "tw_Users");
            RenameTable("dbo.Documents", "tw_Documents");
            RenameTable("dbo.Shares", "tw_Shares");
            AddForeignKey("dbo.tw_Documents", "UserId", "dbo.tw_Users", "Id");
            AddForeignKey("dbo.tw_Shares", "DocumentId", "dbo.tw_Documents", "Id");
            AddForeignKey("dbo.tw_Shares", "UserId", "dbo.tw_Users", "Id");
            CreateIndex("dbo.tw_Users", new[] { "Email" }, true);
            CreateIndex("dbo.tw_Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
            CreateIndex("dbo.tw_Shares", new[] { "DocumentId", "UserId" });
        }
        
        public override void Down()
        {
            DropIndex("dbo.tw_Shares", new[] { "DocumentId", "UserId" });
            DropIndex("dbo.tw_Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
            DropIndex("dbo.tw_Users", new[] { "Email" });
            DropForeignKey("dbo.tw_Shares", "DocumentId", "dbo.tw_Documents");
            DropForeignKey("dbo.tw_Shares", "UserId", "dbo.tw_Users");
            DropForeignKey("dbo.tw_Documents", "UserId", "dbo.tw_Users");
            RenameTable("dbo.tw_Shares", "Shares");
            RenameTable("dbo.tw_Documents", "Documents");
            RenameTable("dbo.tw_Users", "Users");
            AddForeignKey("dbo.Documents", "UserId", "dbo.Users", "Id");
            AddForeignKey("dbo.Shares", "DocumentId", "dbo.Documents", "Id");
            AddForeignKey("dbo.Shares", "UserId", "dbo.Users", "Id");
            CreateIndex("dbo.Users", new[] { "Email" }, true);
            CreateIndex("dbo.Documents", new[] { "UserId", "Title", "UpdatedAt", "CreatedAt" });
            CreateIndex("dbo.Shares", new[] { "DocumentId", "UserId" });
        }
    }
}
