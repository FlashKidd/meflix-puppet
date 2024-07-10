const puppeteer = require('puppeteer');

(async () => {

    // Try to establish a connection to the browser using the websocket endpoint.
    try {
        // Create a connection to a live browser session.
        // const wsChromeEndpointurl = "ws://localhost:9222/devtools/browser/e69d115c-43e3-4cdc-84c2-32bf945c43a9";
        // const browser = await puppeteer.connect({
        //     browserWSEndpoint: wsChromeEndpointurl,
        // });

        const browser = await puppeteer.launch({headless: false});

        // ################################
        const tempMail = 'jabulaninguyen@gmail.com';
        const name = 'Jabulani Makeba';
        const password = '001100';
        const cc = '4737024055951893';
        const expiry = '0426';
        const cvv = '247';

        // NAVIGATE to a new tab -> netflix link
        const page = await browser.newPage();

        // Get the screen dimensions
        const dimensions = await page.evaluate(() => {
            return {
            width: window.screen.width,
            height: window.screen.height
            };
        });

        // Set the viewport to the full screen dimensions
        await page.setViewport({
            width: dimensions.width,
            height: dimensions.height
        });



        await page.goto("https://netflix.com");

        await sleep(6000);

        // Type in the email fieldawait
        await page.type("#\\:r0\\:", tempMail);
        await page.locator('#appMountPoint > div > div > div > div:nth-child(2) > div.default-ltr-cache-142hwrm.e9eyrqp6 > div.default-ltr-cache-d4qcmr.e9eyrqp1 > div.default-ltr-cache-1dvfrvc.e9eyrqp5 > div > div.default-ltr-cache-inkrn.e1w590cc2 > form > div > button').click();

        await sleep(5000);
        //Click next
        await page.locator('#appMountPoint > div > div > div > div.simpleContainer > div > div.submitBtnContainer > button').click();
        await sleep(3000);
        //await page.waitForSelector('input[name="password"]');
        //const passwordField = await page.$('input[name="password"]');
        //await passwordField.focus();
        //await page.evaluate(() => document.querySelector('input[name="password"]').value = '000000' )
        // await page.type("#\\:r3\\:", "000000");
        // await page.keyboard.type("000000");
        // await page.keyboard.press('0');

        await page.waitForSelector('input[name="password"]');
        const passwordField = await page.$('input[name="password"]');

        // Focus on the password field
        await passwordField.focus();

        // Type the password '000000' one character at a time
        for (const char of password) {
            await sleep(300);
            await page.keyboard.press(char);
        }


        await sleep(2000);
        await page.locator('#appMountPoint > div > div > div > div.simpleContainer > div > form > div > div.submitBtnContainer > button').click();
        await sleep(2000)
        await page.locator('#appMountPoint > div > div > div > div.simpleContainer > div > div.submitBtnContainer > button').click();

        // Plans Next
        await page.locator('#appMountPoint > div > div > div > div.simpleContainer > div > div > div.default-ltr-cache-0 > div > button').click();
        await sleep(2000)

        // Select Credit card
        await page.locator('#creditOrDebitCardDisplayStringId').click();
        await sleep(3000)
        // CC number
        await page.type("#\\:ra\\:", cc);
        await sleep(2000)
        await page.type("#\\:rd\\:", expiry);
        await sleep(1000)
        await page.type("#\\:rg\\:", cvv);
        await sleep(1000)

        await page.waitForSelector('input[name="name"]');
        await sleep(5000)
        const nameField = await page.$('input[name="name"]');

        // Focus on the password field
        await nameField.focus();
        for (const char of name) {
            await sleep(300);
            await page.keyboard.press(char);
        }

        // Agreement
        await page.locator('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div > div:nth-child(5) > div.tou--container.remove-container-spacing > div > div.ui-binary-input > label').click();
        await sleep(1000)
        // Payment
        try {
            await page.locator('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div > button').click();
            await page.waitForSelector('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div > div.messageContainer');
            console.log("Fail: %s|%s|%s", cc, expiry, cvv);
            await sleep(25000)
        } catch (e) {
            console.log('Success: %s|%s|%s', cc, expiry, cvv);
            lista = `${cc}|${expiry}|${cvv}`
            await sleep(25000)
            // fetch('api', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(lista),
            // })
            // .then(response => response.text())
            // .then(responseText => {
            //     console.log(responseText);
            // })
            // .catch(error => {
            //     console.log(error.message);
            // });
        }

        // clear cookies
        // Get all cookies
        const cookies = await page.cookies();

        // Delete each cookie
        for (let cookie of cookies) {
        await page.deleteCookie(cookie);
        }
        page.close();



    } catch (e) {
        // Show where the error occurred
        console.error("Error", e);
    }

})();

// <___________________ Functions________________?________________

// LET'S Sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
