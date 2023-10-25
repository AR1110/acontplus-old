using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;
using Common.Core.Entities;

namespace FactElect.Core.Entities
{
    [Table("DocumentoElectronico", Schema = "FactElect")]
    public class DocumentoElectronico : BaseEntity
    {
        public int Ambiente { get; set; }
        public bool AutomaticSriAuth { get; set; }
        public int CompanyId { get; set; }
        [Required]
        [MaxLength(49)]
        public string ClaveAcceso { get; set; }
        [Required]
        [MaxLength(2)]
        public string CodDoc { get; set; }
        public int CodEstado { get; set; }
        public int ComprobanteId { get; set; }
        public int EstablecimientoId { get; set; }
        [Required]
        [MaxLength(3)]
        public string Estab { get; set; }
        public DateTime FechaEmision { get; set; }
        public DateTime FechaAutorizacion { get; set; }
        [Required]
        [MaxLength(13)]
        public string IDCardCompany { get; set; }
        [Required]
        [MaxLength(13)]
        public string IDCardCustomer { get; set; }
        public int PuntoEmisionId { get; set; }
        [Required]
        [MaxLength(3)]
        public string PtoEmi { get; set; }
        public int Secuencial { get; set; }
        [Required]
        [MaxLength(5)]
        public string VersionComp { get; set; }
        [Column(TypeName = "xml")]
        public string XmlSri { get; set; }
        [NotMapped]
        public XElement InitializedXmlElement
        {
            get { return XElement.Parse(XmlSri); }
            set { XmlSri = value.ToString(); }
        }
    }
}
