
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
    }

    public string GetScopeName()
    {
        return Str.CloneString(scopeName);
    }

    public bool Log(int level)
    {
        if (level >= scope.MinimumLogLevel) {
            LLogLibraryStatic.GetInstance().PrepareMessage(level, scope, scopeName);
            return true;
        }
        return false;
    }
};
