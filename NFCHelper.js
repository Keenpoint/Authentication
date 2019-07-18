import NfcManager, { Ndef } from "react-native-nfc-manager";

const decodeNdefRecord = record => {
    if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return ["text", Ndef.text.decodePayload(record.payload)];
    }
    if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
        return ["uri", Ndef.uri.decodePayload(record.payload)];
    }

    return ["unknown", "---"];
};

const registerTagEvent = (callback = null) => {
    NfcManager.registerTagEvent(tag => {
        console.log('Tag Discovered', tag);
        let parsed = null;
        if (tag.ndefMessage && tag.ndefMessage.length > 0) {
            const ndefRecords = tag.ndefMessage;
            parsed = ndefRecords.map(decodeNdefRecord);
        }
        if (callback) {
            console.log('Parsed tag', parsed)
            callback({tag, tagValue: parsed && parsed[0][1] });
        }
    });
};

const unregisterTagEvent = () => {
    NfcManager.unregisterTagEvent();
};

const startNFCManager = async () =>
    NfcManager.start()
        .then(result => ({
            Success: `Success ${result}`
        }))
        .catch(error => ({ Error: error }));

const stopNFCManager = () => {
    NfcManager.stop();
};

export const isNFCSupported = async () => NfcManager.isSupported();

export const startNFC = async (callback, hasStartedNFC) => {
    const isSupported = await isNFCSupported();

    if (isSupported) {
        const startResult = await startNFCManager();

        if (startResult.Success) {
            registerTagEvent(callback);
            hasStartedNFC(true)
            return true;
        }
        return callback({
            Error: {
                Title: "An error occurred while starting NFC Manager",
                Message: startResult.Error
            }
        });
    }
    return callback({
        Error: {
            Title: "Device does not have support for NFC",
            Message: "Your device does not support NFC tag reading. Try another device..."
        }
    });
};

export const stopNFC = hasStartedNFC => {
    if (hasStartedNFC) {
        unregisterTagEvent();
        stopNFCManager();
        hasStartedNFC(false)
    }
};
