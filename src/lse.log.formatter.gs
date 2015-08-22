
include "lse.log.gs"


class LLogFormatter isclass GSObject
{
    // Formats the message to string
    public string Format(LLogRecord record);

    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    public string Format(LLogRecord record)
    {
        string type = "UNDEF";
        switch (record.Level) {
            case LLogger.TRACE: type = "TRACE"; break;
            case LLogger.INFO:  type = " INFO"; break;
            case LLogger.WARN:  type = " WARN"; break;
            case LLogger.ERROR: type = "ERROR"; break;
            default:
                break;
        }

        string message = " ";
        message[message.size(),] = type;
        message[message.size(),] = " [";
        message[message.size(),] = record.Scope;
        message[message.size(),] = "]: ";
        message[message.size(),] = record.Message;

        return message;
    }
};
