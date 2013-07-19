namespace TextUml.Controllers
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    using Models;
    using Services;

    [Authorize]
    public class DocumentsController : ApiController
    {
        private readonly IDocumentService service;

        public DocumentsController(IDocumentService service)
        {
            this.service = service;
        }

        public async Task<HttpResponseMessage> Get([FromUri]DocumentsQuery model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            var result = await service.Query(model);

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public async Task<HttpResponseMessage> Get(int id)
        {
            var result = await service.One(
                id,
                () =>
                    {
                        throw new HttpResponseException(
                            HttpStatusCode.NotFound);
                    });

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public async Task<HttpResponseMessage> Post(DocumentEdit model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            var result = await service.Create(model);

            HttpResponseMessage response = null;

            try
            {
                response = Request.CreateResponse(
                                HttpStatusCode.Created,
                                result);

                var location = Url.Link("DefaultApi", new { id = result.Id });

                if (location != null)
                {
                    response.Headers.Location = new Uri(location);
                }

                return response;
            }
            catch
            {
                if (response != null)
                {
                    response.Dispose();
                }

                throw;
            }
        }

        public async Task<HttpResponseMessage> Put(int id, DocumentEdit model)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    ModelState);
            }

            var result = await service.Update(
                id,
                model,
                () =>
                    {
                        throw new HttpResponseException(
                            HttpStatusCode.NotFound);
                    });

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        public async Task<HttpResponseMessage> Delete(int id)
        {
            await service.Delete(
                id,
                () =>
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                });

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}