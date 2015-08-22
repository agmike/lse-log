
include "library.gs"

include "lse.log.gs"
include "lse.log.filter.gs"
include "lse.log.listener.gs"
include "lse.log.listenerdata.gs"
include "lse.log.logger.gs"
include "lse.log.loggerdata.gs"
include "lse.log.record.gs"
include "lse.log.scope.gs"

include "lse.log.static.gs"


class LLogLibrary isclass Library {

    public void AddListener(LLogListener listener, string scope, int maxLogLevel);
    public void SetFilter(LLogListener listener, LLogFilter filter);


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    LLogScope rootScope;

    LLogRecord nextMessage = null;
    LLogScope nextMessageScope = null;

    int listenerVisitMark = 0;

    LLogListenerData[] listeners;

    final LLogListenerData GetListenerData(LLogListener listener)
    {
        int i;
        for (i = 0; i < listeners.size(); ++i) {
            if (listener == listeners[i].Listener) {
                return listeners[i];
            }
        }
        listeners[i] = new LLogListenerData();
        listeners[i].Listener = listener;
        return listeners[i];
    }

    public void AddListener(LLogListener listener, string scope, int maxLogLevel)
    {
        rootScope.GetScope(scope).AddListener(GetListenerData(listener), maxLogLevel);
    }

    public void SetFilter(LLogListener listener, LLogFilter filter)
    {
        GetListenerData(listener).Filter = filter;
    }

    public LLoggerData InitLogger(string scope)
    {
        if (!scope) return null;
        LLoggerData data = new LLoggerData();
        data.Init(rootScope.GetScope(scope), scope);
        return data;
    }

    public void EndLogMessage()
    {
        if (!nextMessage)
            return;

        LLogRecord record = nextMessage;
        nextMessage = null;
        LLogScope scope = nextMessageScope;
        nextMessageScope = null;

        int mark = ++listenerVisitMark;
        while (scope) {
            int i;
            if (scope.Listeners) {
                for (i = 0; i < scope.Listeners.size(); ++i) {
                    LLogListenerData listener = scope.Listeners[i];
                    if (listener.Mark != mark) {
                        listener.Mark = mark;
                        if (!listener.Filter or listener.Filter.Test(record))
                            listener.Listener.Accept(record);
                    }
                }
            }
            scope = scope.Parent;
        }

        record.Scope = null;
        record.Source = null;
        record.Message = null;
        record.Data = null;
    }

    public LLogRecord BeginLogMessage(int level, LLogScope scope, string scopeName)
    {
        EndLogMessage();

        nextMessageScope = scope;
        nextMessage = new LLogRecord();
        nextMessage.Level = level;
        nextMessage.Scope = Str.CloneString(scopeName);
        nextMessage.Source = Router.GetCurrentThreadGameObject();
        nextMessage.Message = "";
        nextMessage.Data = null;

        PostMessage(me, "LseLogLibrary-298469", "EndLogMessage", 0.0);
        return nextMessage;
    }

    public Soup GetProperties()
    {
        return inherited();
    }

    public void SetProperties(Soup sp)
    {
        inherited(sp);
    }

    void OnEndLogMessage(Message msg)
    {
        EndLogMessage();
    }

    public void Init(Asset asset) {
        inherited(asset);

        rootScope = new LLogScope();
        listeners = new LLogListenerData[0];

        AddHandler(me, "LseLogLibrary-298469", "EndLogMessage", "OnEndLogMessage");
    }
};
