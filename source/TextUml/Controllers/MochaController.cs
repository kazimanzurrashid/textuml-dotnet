#if DEBUG
namespace TextUml.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Hosting;
    using System.Web.Mvc;

    public class MochaController : Controller
    {
        public ActionResult Index()
        {
            var originalFilePaths = new List<string>();

            var root = HostingEnvironment
                .VirtualPathProvider
                .GetDirectory("~/Scripts/specs/application");

            foreach (var directory in root
                .Directories
                .Cast<VirtualDirectory>())
            {
                TraverseDirectory(directory, originalFilePaths);
            }

            IncludeFiles(root, originalFilePaths);

            var replacedFilePaths = ReplaceFilePaths(originalFilePaths);

            return View(replacedFilePaths);
        }

        private static IEnumerable<string> ReplaceFilePaths(IEnumerable<string> oldPaths)
        {
            var newPaths = oldPaths
                .Select(file => "." + file.Substring("/Scripts".Length) + "'")
                .Select(file => file.Substring(0, file.Length - (".js".Length + 1)))
                .Select(file => "'" + file + "'")
                .ToList();

            return newPaths;
        }

        private static void TraverseDirectory(
            VirtualDirectory directory,
            ICollection<string> filePaths)
        {
            foreach (var childDirectory in directory
                .Directories
                .Cast<VirtualDirectory>())
            {
               TraverseDirectory(childDirectory, filePaths); 
            }

            IncludeFiles(directory, filePaths);
        }

        private static void IncludeFiles(
            VirtualDirectory directory,
            ICollection<string> filePaths)
        {
            foreach (var file in directory.Files
                .Cast<VirtualFile>()
                .Select(vf => new
                    {
                        path = vf.VirtualPath,
                        ext = VirtualPathUtility.GetExtension(vf.VirtualPath)
                    })
                .Where(x => ".js".Equals(x.ext, StringComparison.OrdinalIgnoreCase))
                .Select(x => x.path))
            {
                filePaths.Add(file);
            }
        }
    }
}
#endif