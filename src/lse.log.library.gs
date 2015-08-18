
include "library.gs"

include "lse.log.gs"
include "lse.log.loglistener.gs"
include "lse.log.logrecord.gs"


class LLogLibrary isclass Library {

    public void Init(Asset asset) {
        inherited(asset);
    }
};
