import {Capacitor} from "@capacitor/core";
import {Platform} from "../../enums/Platform.jsx";

export class PlatformProviderService {
    getPlatform() {
        // Check if is running on desktop
        if (typeof NL_DESKTOP !== 'undefined') return Platform.DESKTOP;

        const platform = Capacitor.getPlatform();
        switch (platform) {
            case Platform.ANDROID.description:
                return Platform.ANDROID;
            case Platform.IOS.description:
                return Platform.IOS;
            case Platform.WEB.description:
                return Platform.WEB;
            default:
                return Platform.DESKTOP;
        }
    }
}