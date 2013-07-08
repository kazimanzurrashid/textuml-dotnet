namespace TextUml.Services
{
    using System;

    public interface ICurrentUserProvider
    {
        int UserId { get; }
    }

    public class CurrentUserProvider : ICurrentUserProvider
    {
        private readonly Func<int> getId;
        private int? id;

        public CurrentUserProvider(Func<int> getId)
        {
            this.getId = getId;
        }

        public int UserId
        {
            get
            {
                if (id == null)
                {
                    id = getId();
                }

                return id.GetValueOrDefault();
            }
        }
    }
}