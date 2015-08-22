
include "lse.log.gs"


/*  Class: LLogFactory

    Factory for dynamically creating <LLog> instances.

    See Also:

        <LLog>
*/
static class LLogFactory
{
    /*  Func: CreateLogger

        Creates <LLog> instance for provided scope.

        Parameters:

            scope - Logger scope.

        Returns:

            <LLog> instance with given scope.
    */
    final public LLogger CreateLogger(string scope);


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************


    final public LLogger CreateLogger(string scope)
    {
        return null;
    }
};
