using System;

namespace Domain
{
    public class Value
    {
        public int Id { get; set; } // EF automatically makes Id the Primary Key. As Integer, will also be configured as auto-generated number
        public string Name{ get; set; }
    }
}
