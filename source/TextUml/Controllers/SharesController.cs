namespace TextUml.Controllers
{
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    using Models;
    using Services;

    [Authorize]
    public class SharesController : ApiController
    {
        private readonly IShareService service;

        public SharesController(IShareService service)
        {
            this.service = service;
        }

        public async Task<HttpResponseMessage> Get(int id)
        {
            var result = await service.Query(id);

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public async Task<HttpResponseMessage> Put(
            int id,
            IEnumerable<ShareEdit> models)
        {
            await service.Update(
                id,
                models,
                () =>
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                });

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}