namespace TextUml.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class AddSharedWithEmailsToDocument : DbMigration
    {
        public override void Up()
        {
            AddColumn(
                "dbo.Documents",
                "SharedWithEmails",
                c => c.String(true, 2048));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Documents", "SharedWithEmails");
        }
    }
}
