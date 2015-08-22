
include "lse.log.gs"


class LLogListener isclass GSObject
{
    // Called by LLogLibrary when listener recieves new message.
    public void Accept(LLogRecord record);

    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    public void Accept(LLogRecord record)
    {
    }
};
