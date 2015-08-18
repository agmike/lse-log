
include "lse.log.gs"


class LLogListener isclass GSObject
{
    // Sets filter for this listener. By default, messages not satisfying filter will be ignored.
    public void SetFilter(LLogFilter filter);

    // Sets formatter for messages. Formatters covert LLogRecord object to string, which is then
    // passed to Print method.
    public void SetFormatter(LLogFormatter formatter);

    // Called by LLogLibrary when listener recieves new message.
    public void Accept(LLogRecord record);

    // Override this method to print message to desired output stream.
    void Print(string formattedMessage);

    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    LLogFilter filter = new LLogFilter();
    LLogFormatter formatter = new LLogFormatter();

    public void SetFilter(LLogFilter filter)
    {
        me.filter = filter;
    }

    public void SetFormatter(LLogFormatter formatter)
    {
        me.formatter = formatter;
    }

    public void Accept(LLogRecord record)
    {
        if (filter.Accepts(record)) {
            Print(formatter.Format(record));
        }
    }

    void Print(string formattedMessage)
    {
    }
};
