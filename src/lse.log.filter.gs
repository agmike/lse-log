
include "lse.log.gs"


class LLogFilter isclass GSObject
{
    // Checks if given LLogRecord satisfies this filter.
    public bool Accepts(LLogRecord record);

    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    public bool Accepts(LLogRecord record)
    {
        return true;
    }
};
