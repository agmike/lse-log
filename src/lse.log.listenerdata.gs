
include "lse.log.gs"


class LLogListenerData isclass GSObject
{
    public LLogListener Listener;
    public LLogFilter Filter;
    public int MaxLogLevel = LLogger.NONE;
    public int Mark = 0;
};
