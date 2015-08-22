
include "lse.log.gs"

/*  Class: LLogger

    Logger facade. Logs submitted to instance of this class are

    Example:

        (code)
        static class MyClassLogger isclass LLogger
        {
            public string GetScope()
            {
                return "mypackage.myclass"
            }
        };

        class MyPackageMyClass {
            // some function:
            if (MyClassLogger.Warn()) {
                MyClassLogger.Log("this is warning");
                MyClassLogger.Log("values:");
                MyClassLogger.Log(valueSoup);
            }

        }
        (end)

    See Also:
*/
class LLogger isclass GSObject
{
    /*  Constants: Log Levels

        ALL - Pseudo-level that is lower than any other level, used for
            enabling all messages.
        TRACE - Level for detailed logging.
        INFO - Level for providing useful information.
        WARN - Level for warnings about incorrect usage.
        ERROR - Level for unexpected situations and errors.
        NONE - Pseudo-level that is higher than any other level, used for
            disabling logging entirely.
    */
    define public int ALL   = -100;
    define public int TRACE = 1;
    define public int INFO  = 2;
    define public int WARN  = 3;
    define public int ERROR = 4;
    define public int NONE  = 100;

    /*  Func: GetScope

        Returns log scope of current instance.
        Must be overridden to provide scope for class which is using this log.
        Recommended format is Java-like package name.

        Example:

            (code)
            public string GetScope()
            {
                return "tram.xpath.router"
            }
            (end)

        Returns:

            String containing scope name.
    */
    public string GetScope();

    /*  Funcs: Log Initiators

        Checks if requested log level is enabled and, if true, sets it as log
        level for next Log calls.
        Log level is enabled if subsequent Log call will be recieved by one or
        more listeners.

        Trace - Does this TRACE log level.
        Info - Does this INFO log level.
        Warn - Does this WARN log level.
        Error - Does this ERROR log level.

        Returns:

            True if requested log level is enabled, false otherwise.

        See Also:
            <Log Levels>, <Log>
    */
    final public bool Trace();
    final public bool Info();
    final public bool Warn();
    final public bool Error();

    /*  Func: Log

        Logs provided message, arguments and data to all listeners subscribed
        to this logger.

        Parameters:
            message - Log message.
            data - Soup to include in the log message.

        See Also:

            <Log Initiators>
    */
    final public LLogger Log(string message);
    final public LLogger Log(string message, Soup data);


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    public LLogSubscription[] Subscriptions = null;
    public int MinimumLogLevel = LLogger.ALL;

    final int Initialize() {
        LLogLibraryStatic.GetInstance().AddLogger(me);
        return LLogger.ERROR;
    }

    int nextLogLevel = Initialize();

    public string GetScope()
    {
        return "";
    }


    final public bool Trace()
    {
        if (TRACE < MinimumLogLevel or !Subscriptions)
            return false;
        int i;
        for (i = 0; i < Subscriptions.size(); ++i) {
            LLogSubscription sub = Subscriptions[i];
            if (TRACE >= sub.MinimumLogLevel) {
                nextLogLevel = TRACE;
                return true;
            }
        }
        return true;
    }


    final public bool Info()
    {
        if (INFO < MinimumLogLevel or !Subscriptions)
            return false;
        int i;
        for (i = 0; i < Subscriptions.size(); ++i) {
            LLogSubscription sub = Subscriptions[i];
            if (INFO >= sub.MinimumLogLevel) {
                nextLogLevel = INFO;
                return true;
            }
        }
        return false;
    }


    final public bool Warn()
    {
        if (WARN < MinimumLogLevel or !Subscriptions)
            return false;
        int i;
        for (i = 0; i < Subscriptions.size(); ++i) {
            LLogSubscription sub = Subscriptions[i];
            if (WARN >= sub.MinimumLogLevel) {
                nextLogLevel = WARN;
                return true;
            }
        }
        return false;
    }


    final public bool Error()
    {
        if (ERROR < MinimumLogLevel or !Subscriptions)
            return false;
        int i;
        for (i = 0; i < Subscriptions.size(); ++i) {
            LLogSubscription sub = Subscriptions[i];
            if (ERROR >= sub.MinimumLogLevel) {
                nextLogLevel = ERROR;
                return true;
            }
        }
        return false;
    }


    final public LLogger Log(string message)
    {
        Log(message, null);
        return me;
    }

    final public LLogger Log(string message, Soup data)
    {
        LLogRecord record = new LLogRecord();
        record.Level = nextLogLevel;
        record.Scope = GetScope();
        record.Source = Router.GetCurrentThreadGameObject();
        record.Message = message;
        record.Data = data;

        int i;
        for (i = 0; i < Subscriptions.size(); ++i) {
            LLogSubscription sub = Subscriptions[i];
            if (record.Level >= sub.MinimumLogLevel) {
                sub.Listener.Accept(record);
            }
        }

        return me;
    }
};
