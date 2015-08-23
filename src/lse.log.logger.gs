
include "lse.log.gs"

/*  Class: LLogger

    Logger facade. Logs submitted to instance of this class are

    Example:

        (code)
        static class MyClassLogger isclass LLogger
        {
            string S() { return "mypackage.myclass" }
        };

        class MyPackageMyClass {
            // some function:
            if (MyClassLogger.Warn()) {
                MyClassLogger.P("this is warning")
                             .P("values:")
                             .P(valueSoup);
            }

        }
        (end)

    See Also:
*/
class LLogger isclass GSObject
{
    /*  Constants: Log Levels

        ALL - Pseudo-level that is higher than any other level, used for
            enabling all messages.
        TRACE - Level for detailed logging.
        DEBUG - Level for providing debug information.
        INFO - Level for providing useful information to user.
        WARN - Level for warnings about incorrect usage.
        ERROR - Level for unexpected situations and errors.
        NONE - Pseudo-level that is lower than any other level, used for
            disabling logging entirely.
    */
    define public int NONE  = -100;
    define public int ERROR = 0;
    define public int WARN  = 1;
    define public int INFO  = 2;
    define public int DEBUG = 3;
    define public int TRACE = 4;
    define public int ALL   = 100;

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
        Debug - Does this DEBUG log level.
        Info - Does this INFO log level.
        Warn - Does this WARN log level.
        Error - Does this ERROR log level.

        Returns:

            True if requested log level is enabled, false otherwise.

        See Also:
            <Log Levels>, <Log>
    */
    final public bool Trace();
    final public bool Debug();
    final public bool Info();
    final public bool Warn();
    final public bool Error();

    /// Returns true if logger is recording a message. Useful when function wants to continue
    // logging to same message.
    final public bool Log();

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


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    LLogLibrary lib = LLogLibraryStatic.GetInstance();
    LLoggerData data = LLogLibraryStatic.GetInstance().InitLogger(S());

    LLogRecord record;

    final public bool Trace() { return (record = data.BeginLogMessage(TRACE)) != null; }
    final public bool Debug() { return (record = data.BeginLogMessage(DEBUG)) != null; }
    final public bool Info()  { return (record = data.BeginLogMessage(INFO )) != null; }
    final public bool Warn()  { return (record = data.BeginLogMessage(WARN )) != null; }
    final public bool Error() { return (record = data.BeginLogMessage(ERROR)) != null; }

    final public bool Log() { return record != null; }

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
};
