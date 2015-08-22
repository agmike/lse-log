
include "lse.log.logger.gs"


final class LLoggerData isclass GSObject
{
    LLogScope scope;
    string scopeName;

    public void Init(LLogScope scope, string scopeName)
    {
        if (!(!me.scope and scope)) {
            Interface.Exception("Illegal initialization");
            while (true) { /* terminate */  }
        }
        me.scope = scope;
        me.scopeName = scopeName;
    }

    public string GetScopeName()
    {
        return Str.CloneString(scopeName);
    }

    public LLogRecord BeginLogMessage(int level)
    {
        if (level <= scope.MaxLogLevel) {
            return LLogLibraryStatic.GetInstance().BeginLogMessage(level, scope, scopeName);
        }
        return null;
    }

    public void EndLogMessage()
    {
        LLogLibraryStatic.GetInstance().EndLogMessage();
    }
};
