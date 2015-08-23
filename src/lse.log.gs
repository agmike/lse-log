
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

    public void SetListener(LLogListener listener, string scope);
    public void SetListener(LLogListener listener, string scope, int maxLogLevel);
    public void SetListener(LLogListener listener, string scope, int maxLogLevel, LLogFilter filter);
    public void SetMaxLogLevel(LLogListener listener, int level);
    public void SetFilter(LLogListener listener, LLogFilter filter);


    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    LLogScope rootScope;

    LLogRecord[] messageQueue = new LLogRecord[10];
    int messageQueueStart = 0, messageQueueEnd = 0, messageQueueCount = 0;
    bool flushScheduled = false;

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

    public void SetListener(LLogListener listener, string scope)
    {
        rootScope.GetScope(scope).AddListener(GetListenerData(listener));
    }

    public void SetListener(LLogListener listener, string scope, int maxLogLevel)
    {
        LLogListenerData data = GetListenerData(listener);
        data.MaxLogLevel = maxLogLevel;
        rootScope.GetScope(scope).AddListener(data);
    }

    public void SetListener(LLogListener listener, string scope, int maxLogLevel, LLogFilter filter)
    {
        LLogListenerData data = GetListenerData(listener);
        data.MaxLogLevel = maxLogLevel;
        data.Filter = filter;
        rootScope.GetScope(scope).AddListener(data);
    }

    public void SetMaxLogLevel(LLogListener listener, int level)
    {
        GetListenerData(listener).MaxLogLevel = level;
        rootScope.UpdateMaxLogLevel(LLogger.NONE);
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

    final void ProcessMessage(LLogRecord msg)
    {
        LLogScope scope = rootScope.GetScope(msg.Scope);
        int mark = ++listenerVisitMark;
        while (scope) {
            int i;
            if (scope.Listeners) {
                for (i = 0; i < scope.Listeners.size(); ++i) {
                    LLogListenerData listener = scope.Listeners[i];
                    if (msg.Level <= listener.MaxLogLevel and listener.Mark != mark) {
                        listener.Mark = mark;
                        if (!listener.Filter or listener.Filter.Test(msg))
                            listener.Listener.Accept(msg);
                    }
                }
            }
            scope = scope.Parent;
        }
    }

    final void FlushLog()
    {
        flushScheduled = false;

        while (messageQueueCount > 0) {
            LLogRecord msg = messageQueue[messageQueueEnd];
            messageQueue[messageQueueEnd] = null;
            messageQueueEnd = (messageQueueEnd + 1) % messageQueue.size();
            messageQueueCount = messageQueueCount - 1;
            ProcessMessage(msg);
        }

        if (messageQueueEnd == messageQueueStart)
            messageQueueEnd = messageQueueStart = 0;
    }

    public void Log(LLogRecord msg)
    {
        if (messageQueueCount >= messageQueue.size()) {
            LLogRecord[] newQueue = new LLogRecord[messageQueueCount * 2];

            int firstPartCount = messageQueueCount - messageQueueEnd;
            newQueue[0, firstPartCount] = messageQueue[messageQueueEnd, ];
            newQueue[firstPartCount, messageQueueCount] = messageQueue[0, messageQueueStart];

            messageQueueEnd = 0;
            messageQueueStart = messageQueueCount;
            messageQueue = newQueue;
        }
        messageQueue[messageQueueStart] = msg;
        ++messageQueueCount;
        messageQueueStart = (messageQueueStart + 1) % messageQueue.size();

        if (!flushScheduled) {
            PostMessage(me, "LseLogLibrary-298469", "Flush", 0.0);
            flushScheduled = true;
        }
    }

    void OnFlush(Message msg)
    {
        FlushLog();
    }

    public void Init(Asset asset) {
        inherited(asset);

        rootScope = new LLogScope();
        listeners = new LLogListenerData[0];

        AddHandler(me, "LseLogLibrary-298469", "Flush", "OnFlush");
    }

    public Soup GetProperties()
    {
        return inherited();
    }

    public void SetProperties(Soup sp)
    {
        inherited(sp);
    }
};
