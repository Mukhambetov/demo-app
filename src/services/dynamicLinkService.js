/*
const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK
// Замените 'path/to/your-service-account-key.json' на путь к вашему ключу JSON для аутентификации
const serviceAccount = require('path/to/your-service-account-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const SITE_URL = 'https://yourapp.example.com';
const domainUriPrefix = 'https://yourapp.page.link';
const iosBundleId = 'com.example.yourapp'
const androidPackageName = 'com.example.yourapp'

async function createFirebaseDynamicLinkWithReferralCode(referralCode) {
    const deepLinkUrl = `${SITE_URL}/referral?code=${referralCode}`;
    const link = await admin.dynamicLinks().createShortDynamicLink({
        dynamicLinkInfo: {
            domainUriPrefix, // Замените на свой домен Dynamic Links
            link: deepLinkUrl,
            iosInfo: {
                iosBundleId,
            },
            androidInfo: {
                androidPackageName,
            }
        },
        suffix: {
            option: 'SHORT'
        }
    });

    return link.shortLink;
}

module.exports = {
    createFirebaseDynamicLinkWithReferralCode
}
*/
