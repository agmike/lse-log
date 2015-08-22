
include "library.gs"

include "lse.log.gs"
include "lse.log.filter.gs"
include "lse.log.logger.gs"
include "lse.log.loglistener.gs"
include "lse.log.logrecord.gs"
include "lse.log.subscription.gs"

include "lse.log.static.gs"


class LLogLibrary isclass Library {

    public void AddListener(LLogListener listener, string scope, int minLogLevel);
    public void RemoveListener(LLogListener listener);
    public void SetFilter(LLogListener listener, LLogFilter filter);


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    LLoggerData[] loggers = new LLoggerData[0];
    LLoggerData loggerWithNextMessage = null;

    public void AddListener(LLogListener listener, string scope, int minLogLevel)
    {

    }

    public void RemoveListener(LLogListener listener)
    {

    }

    public void SetFilter(LLogListener listener, LLogFilter filter)
    {

    }

    public LLoggerData InitLogger(string scope)
    {
        if (!scope) return null;
        LLoggerData loggerData = new LLoggerData();
        loggerData.Scope = scope;
        //UpdateSubscriptions(loggerData);
        return loggerData;
    }

    public void PrepareMessage(LLoggerData loggerData, int level)
    {
        PostMessage(me, "LseLogLibrary-298469", "FlushMessages", 0.0);
    }

    public void FlushMessages()
    {
        ClearMessages("LseLogLibrary-298469", "FlushMessages");

        LLoggerData loggerData = loggerWithNextMessage;
        loggerWithNextMessage = null;

        LLogRecord record = loggerData.MessageRecord;
        loggerData.MessageRecord = null;

        int j;
        for (j = 0; j < loggerData.Subscriptions.size(); ++j) {
            LLogSubscription sub = loggerData.Subscriptions[j];
            if (record.Level >= sub.MinimumLogLevel) {
                sub.Listener.Accept(record);
            }
        }
    }

    public Soup GetProperties()
    {
        return inherited();
    }

    public void SetProperties(Soup sp)
    {
        inherited(sp);
    }

    void OnFlushMessages(Message msg)
    {
        FlushMessages();
    }

    public void Init(Asset asset) {
        inherited(asset);

        AddHandler(me, "LseLogLibrary-298469", "FlushMessages", "OnFlushMessages");
    }
};
