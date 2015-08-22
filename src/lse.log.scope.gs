
include "lse.log.gs"


class LLogScope isclass GSObject
{
    public string Name = "";
    public LLogScope Parent = null;
    public LLogScope[] Children = null;
    public LLogScope Exact = null;

    public int MaxLogLevel = LLogger.NONE;

    public LLogListenerData[] Listeners = null;

    public void AddListener(LLogListenerData listener, int maxLogLevel)
    {
        MaxLogLevel = Math.Max(MaxLogLevel, maxLogLevel);
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
                Exact = new LLogScope();
            return Exact;
        }
        if (scope == "*")
            return me;

        string subScope = scope;
        int i = Str.Find(scope, ".", 0);
        if (i >= 0) {
            subScope = scope[0, i];
            scope = scope[i, ];
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

        Children[i] = new LLogScope();
        Children[i].Name = subScope;
        return Children[i].GetScope(scope);
    }
};
