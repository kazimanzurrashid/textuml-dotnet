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

        public CurrentUserProvider(Func<int> getId)
        {
            this.getId = getId;
        }

        public int UserId
        {
            get { return getId(); }
        }
    }
}