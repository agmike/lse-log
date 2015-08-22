
include "lse.log.logger.gs"


class LLoggerData isclass GSObject
{
    public string Scope;
    public LLogSubscription[] Subscriptions;
    public int MinimumLogLevel;

    public LLogRecord MessageRecord;
};
