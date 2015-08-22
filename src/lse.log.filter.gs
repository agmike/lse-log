
include "lse.log.gs"


class LLogFilter isclass GSObject
{
    // Checks if given LLogRecord satisfies this filter.
    public bool Test(LLogRecord record);

    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    public bool Test(LLogRecord record)
    {
        return true;
    }
};
