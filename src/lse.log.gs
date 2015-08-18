
include "lse.log.library.gs"

/*  Class: LLog

    Logger facade. Logs submitted to instance of this class are

    Example:

        (code)
        static class MyClassLogger isclass LLog
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

        <LLogStatic>
*/
class LLog isclass GSObject
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
    final public void Log(string message);
    final public void Log(Soup data);


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************


    public string GetScope()
    {
        return "";
    }


    final public bool Trace()
    {
        return false;
    }


    final public bool Info()
    {
        return false;
    }


    final public bool Warn()
    {
        return false;
    }


    final public bool Error()
    {
        return false;
    }


    final public void Log(string message)
    {

    }


    final public void Log(Soup data)
    {

    }
};
