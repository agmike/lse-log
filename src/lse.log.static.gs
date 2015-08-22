
include "lse.log.library.gs"


static class LLogLibraryStatic
{
    // Gets LLogLibrary instance.
    public LLogLibrary GetInstance();

    // Returns whether scope matches given pattern.
    // If pattern ends with *, scope matches if it has prefix equal to pattern (without *)
    // Otherwise scope must be equal to pattern.
    public bool ScopeMatches(string scope, string pattern);

    // ****************************************************
    //
    //    I M P L E M E N T A T I O N
    //
    // ****************************************************

    KUID GetKuid()
    {
        Soup sp = Constructors.NewSoup();
        sp.SetNamedTag("kuid", "<kuid:298469:1000006>");
        return sp.GetNamedTagAsKUID("kuid");
    }

    KUID libraryKuid = GetKuid();
    LLogLibrary library = null;

    public LLogLibrary GetInstance()
    {
        if (library)
            return library;
        library = cast <LLogLibrary> World.GetLibrary(libraryKuid);
        if (!library) {
            Interface.Exception("Unable to load `LLogLibrary`, " + libraryKuid.GetLogString());
            return null;
        }
        return library;
    }

    public bool ScopeMatches(string scope, string pattern)
    {
        // Glob pattern: match if pattern matches prefix (without * itself)
        if (pattern[pattern.size() - 1] == '*') {
            return Str.Find(scope, pattern, 0) == 0;
        }
        // Exact match: scope must be same as pattern
        return scope == pattern;
    }
};
