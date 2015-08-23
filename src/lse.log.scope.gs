
include "lse.log.gs"


class LLogScope isclass GSObject
{
    public string Name = "";
    public LLogScope Parent = null;
    public LLogScope[] Children = null;
    public LLogScope Exact = null;

    public int MaxLogLevel = LLogger.NONE;

    public LLogListenerData[] Listeners = null;

    final LLogScope CreateChild(string scopeName)
    {
        LLogScope child = new LLogScope();
        child.Name = scopeName;
        child.Parent = me;
        child.MaxLogLevel = MaxLogLevel;
        return child;
    }

    final void SetMaxLogLevel(int maxLogLevel)
    {
        if (MaxLogLevel == maxLogLevel)
            return;
        MaxLogLevel = maxLogLevel;
        if (Exact)
            Exact.MaxLogLevel = MaxLogLevel;
        if (Children) {
            int i;
            for (i = 0; i < Children.size(); ++i) {
                Children[i].SetMaxLogLevel(MaxLogLevel);
            }
        }
    }

    public void UpdateMaxLogLevel(int parentMaxLogLevel)
    {
        int maxLogLevel = parentMaxLogLevel;
        if (Listeners) {
            int i;
            for (i = 0; i < Listeners.size(); ++i)
                MaxLogLevel = Math.Max(MaxLogLevel, Listeners[i].MaxLogLevel);
        }
        if (Exact and Exact.Listeners) {
            int i;
            for (i = 0; i < Exact.Listeners.size(); ++i)
                MaxLogLevel = Math.Max(MaxLogLevel, Exact.Listeners[i].MaxLogLevel);
        }
        SetMaxLogLevel(maxLogLevel);
    }

    public void AddListener(LLogListenerData listener)
    {
        SetMaxLogLevel(Math.Max(MaxLogLevel, listener.MaxLogLevel));
        if (!Listeners) {
            Listeners = new LLogListenerData[1];
            Listeners[0] = listener;
            return;
        }
        int i;
        for (i = 0; i < Listeners.size(); ++i) {
            if (listener == Listeners[i])
                return;
        }
        Listeners[Listeners.size()] = listener;
    }

    public LLogScope GetScope(string scope)
    {
        if (scope == "") {
            if (!Exact)
                Exact = CreateChild(null);
            return Exact;
        }
        if (scope == "*")
            return me;

        string subScope = scope;
        int i = Str.Find(scope, ".", 0);
        if (i >= 0) {
            subScope = scope[0, i];
            scope = scope[i + 1, ];
        }
        else
            scope = "";

        i = 0;
        if (Children) {
            for (; i < Children.size(); ++i) {
                LLogScope child = Children[i];
                if (child.Name == subScope)
                    return child.GetScope(scope);
            }
        }
        else {
            Children = new LLogScope[1];
        }

        Children[i] = CreateChild(subScope);
        return Children[i].GetScope(scope);
    }
};
