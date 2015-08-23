
include "lse.log.gs"


class LLogRecord isclass GSObject
{
    public int Level;
    public string Scope;
    public GameObject Source;
    public float Time;
    public string Message;
    public Soup Data;
};
