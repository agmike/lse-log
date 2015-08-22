
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
    define public int TRACE = 0;
    define public int DEBUG = 10; // TODO: implement this
    define public int INFO  = 20;
    define public int WARN  = 30;
    define public int ERROR = 40;
    define public int NONE  = 100;

    // /*  Func: GetScope
    //
    //     Returns log scope of current instance.
    // */
    // final public string GetScope();

    /*  Func: S

        Must be overridden to provide scope for class which is using this log.
        Recommended format is Java-like package name.

        This function is called one when intializing this logger.

        Example:

            (code)
            string S() { return "tram.xpath.router"; }
            (end)

        Returns:

            Non-null string containing scope name.
    */
    string S() { return ""; }

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
    final public LLogger P(string message);
    final public LLogger P(Soup data);

    /// Finishes log message and handle it to listeners.
    final public void F();


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    LLogLibrary lib = LLogLibraryStatic.GetInstance();
    LLoggerData data = LLogLibraryStatic.GetInstance().InitLogger(S());
    LLogRecord record;

    final public bool Trace() { return data.Log(TRACE); }
    final public bool Info()  { return data.Log(INFO ); }
    final public bool Warn()  { return data.Log(WARN ); }
    final public bool Error() { return data.Log(ERROR); }

    final public LLogger P(string message)
    {
        record.Message[record.Message.size(), ] = message;
        return me;
    }

    final public LLogger P(Soup sp)
    {
        // TODO:
        // if (!data.MessageRecord.Data)
        //     data.MessageRecord = sp;
        // else
        //     LData.Append(data.MessageRecord.Data, sp);
        record.Data = sp;
        return me;
    }

    final public void F()
    {
        LLogLibraryStatic.GetInstance().FlushMessage();
    }
};
