
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

    public LLogRecord BeginLogMessage(int level)
    {
        LLogRecord nextMessage = null;
        if (level <= scope.MaxLogLevel) {
            LLogLibrary lib = LLogLibraryStatic.GetInstance();
            nextMessage = new LLogRecord();
            nextMessage.Level = level;
            nextMessage.Scope = Str.CloneString(scopeName);
            nextMessage.Source = Router.GetCurrentThreadGameObject();
            nextMessage.Time = World.GetSeconds();
            nextMessage.FrameId = lib.GetFrameId();
            nextMessage.Message = "";
            nextMessage.Data = null;
            LLogLibraryStatic.GetInstance().Log(nextMessage);
        }
        return nextMessage;
    }
};
