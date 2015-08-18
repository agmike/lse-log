
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
            case LLog.TRACE: type = "TRACE"; break;
            case LLog.INFO:  type = " INFO"; break;
            case LLog.WARN:  type = " WARN"; break;
            case LLog.ERROR: type = "ERROR"; break;
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
