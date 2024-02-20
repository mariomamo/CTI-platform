# CTI

## Run on android device
Edit `capacitor.config.js` file and add your computer ip in `server.url` property
```json
{
  ...
  "server": {
    "url": "http://<your_ip_here>:5173",
    "cleartext": true
  },
  ...
}
```

## Sign apk
Generate keys
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```

Sign
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore my_application.apk alias_name
```