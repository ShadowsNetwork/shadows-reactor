function onTransactionCompleted(setTransactionStatus, transactionHash) {
    setTransactionStatus({
        hash: transactionHash,
        error: null,
        exception: null,
        success: true,
        inProgress: false,
        toBeConfirmed: false,
        closed: false
    });
}
function onTransactionFailed(setTransactionStatus, error) {
    setTransactionStatus({
        hash: error.transactionHash,
        error: error,
        exception: null,
        success: false,
        inProgress: false,
        toBeConfirmed: false,
        closed: false
    });
}
function onTransactionConfirmed(setTransactionStatus, result) {
    const { hash, wait } = result;
    setTransactionStatus({
        hash,
        error: null,
        exception: null,
        success: false,
        inProgress: true,
        toBeConfirmed: false,
        closed: false
    });
    wait()
        .then(confirmation => {
        const { transactionHash } = confirmation;
        onTransactionCompleted(setTransactionStatus, transactionHash);
        // fetchInitData()
    })
        .catch((error) => {
        onTransactionFailed(setTransactionStatus, error);
    });
}
function onTransactionException(setTransactionStatus, exception) {
    setTransactionStatus({
        hash: null,
        error: null,
        exception,
        success: false,
        inProgress: false,
        toBeConfirmed: false,
        closed: false
    });
}
function initTransaction(setTransactionStatus) {
    setTransactionStatus({
        hash: null,
        error: null,
        exception: null,
        success: false,
        inProgress: false,
        toBeConfirmed: true,
        closed: false
    });
}
export { onTransactionCompleted, onTransactionFailed, onTransactionException, initTransaction, onTransactionConfirmed };
//# sourceMappingURL=event.js.map