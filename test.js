const { getEmbedUrl } = require('./index');

const shortUrl = 'https://maps.app.goo.gl/DLjNeKAkKsrJsvao7';

console.log(`Testing with URL: ${shortUrl}`);

getEmbedUrl(shortUrl).then(result => {
    console.log("--- RESULT ---");
    console.log(JSON.stringify(result, null, 2));

    if (result.embed && result.embed.includes("output=embed")) {
        console.log("\nSUCCESS: Generated valid embed URL format.");
    } else {
        console.log("\nFAILURE: Could not generate embed URL.");
    }
});
