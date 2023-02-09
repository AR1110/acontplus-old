using es.mityc.javasign.pkstore;
using java.security.cert;

namespace SignerWS
{
    internal class PassStoreKS : IPassStoreKS
    {
        private string password;

        public PassStoreKS(string password)
        {
            this.password = password;
        }

        public char[] getPassword(X509Certificate certificate, string alias)
        {
            return this.password.ToCharArray();
        }
    }
}