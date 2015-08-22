
include "library.gs"

include "lse.log.gs"
include "lse.log.filter.gs"
include "lse.log.logger.gs"
include "lse.log.loglistener.gs"
include "lse.log.logrecord.gs"
include "lse.log.subscription.gs"

include "lse.log.static.gs"


class LLogLibrary isclass Library {

    public void AddLogger(LLogger logger);
    public void Subscribe(LLogListener listener, string scope, int minLogLevel);
    public void Unsubscribe(LLogListener listener, string scope);
    public void SetFilter(LLogListener listener, LLogFilter filter);


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    LLogger[] loggers = new LLogger[50];
    LLogListener[] listeners = new LLogListener[50];

    public void AddLogger(LLogger logger)
    {
        Interface.Log("adding logger");
        loggers[loggers.size()] = logger;
    }

    public void Subscribe(LLogListener listener, string scope, int minLogLevel)
    {
        Interface.Log("adding subscription");
        int i;
        for (i = 0; i < loggers.size(); ++i) {
            LLogger logger = loggers[i];
            if (LLogLibraryStatic.ScopeMatches(logger.GetScope(), scope)) {

                // Adding listener to logger subscriptions
                LLogSubscription subscription = null;
                if (logger.Subscriptions) {
                    int j;
                    for (j = 0; j < logger.Subscriptions.size(); ++j) {
                        LLogSubscription sub = logger.Subscriptions[j];
                        if (sub.Listener == listener) {
                            subscription = sub;
                            break;
                        }
                    }
                }
                else {
                    logger.Subscriptions = new LLogSubscription[1];
                    logger.Subscriptions[0] = subscription = new LLogSubscription();
                }

                if (!subscription) {
                    subscription = new LLogSubscription();
                    logger.Subscriptions[logger.Subscriptions.size()] = subscription;
                }

                subscription.Listener = listener;
                subscription.MinimumLogLevel = minLogLevel;

                // Updating logger minimum log level
                logger.MinimumLogLevel = LLogger.NONE;
                int j;
                for (j = 0; j < logger.Subscriptions.size(); ++j) {
                    LLogSubscription sub = logger.Subscriptions[j];
                    logger.MinimumLogLevel = Math.Min(logger.MinimumLogLevel, sub.MinimumLogLevel);
                }
            }
        }
    }

    public void Unsubscribe(LLogListener listener, string scope)
    {
        int i;
        for (i = 0; i < loggers.size(); ++i) {
            LLogger logger = loggers[i];
            if (LLogLibraryStatic.ScopeMatches(logger.GetScope(), scope)) {

                // Removing listener from logger subscriptions
                int j;
                for (j = 0; j < logger.Subscriptions.size(); ++j) {
                    LLogSubscription sub = logger.Subscriptions[j];
                    if (sub.Listener == listener) {
                        logger.Subscriptions[j, j + 1] = null;
                        break;
                    }
                }

                // Updating logger minimum log level
                logger.MinimumLogLevel = LLogger.NONE;
                for (j = 0; j < logger.Subscriptions.size(); ++j) {
                    LLogSubscription sub = logger.Subscriptions[j];
                    logger.MinimumLogLevel = Math.Min(logger.MinimumLogLevel, sub.MinimumLogLevel);
                }
            }
        }
    }

    public void SetFilter(LLogListener listener, LLogFilter filter)
    {

    }

    public Soup GetProperties()
    {
        return inherited();
    }

    public void SetProperties(Soup sp)
    {
        inherited(sp);
    }

    public void Init(Asset asset) {
        inherited(asset);
    }
};
