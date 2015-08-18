
include "lse.log.gs"


class LLogSubscription isclass GSObject
{
    public int MinimumLogLevel = LLog.ALL;
    public LLogListener Listener = null;
};
