
include "lse.log.gs"


class LLogSubscription isclass GSObject
{
    public int MinimumLogLevel = LLogger.ALL;
    public LLogListener Listener = null;
};
