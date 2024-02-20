export class WebStorageService {

    async set(key, value) {
        return window.localStorage.setItem(key, value);
    }

    async get(key) {
        return window.localStorage.getItem(key);
    }

    async remove(key) {
        return window.localStorage.removeItem(key);
    }

}