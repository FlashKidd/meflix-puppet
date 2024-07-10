const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const bodyParser = require('body-parser');



const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/process', async (req, res) => {
    const { $cardNumber } = req.body
    console.log($cardNumber);

    let [$cc, $mes, $ano, $cvv] = $cardNumber.split("|");
    //$cc = $cc.toString();
    $expiry = `${$mes}${$ano}`;

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
            //const tempMail = 'mendlalfiauyen@gmail.com';
            const tempMail = generateRandomGmail();
            const name = generateRandomPerson();
            const password = '001100';

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
            await page.type("#\\:ra\\:", $cc);
            await sleep(2000)
            await page.type("#\\:rd\\:", $expiry);
            await sleep(1000)
            await page.type("#\\:rg\\:", $cvv);
            await sleep(1000)

            // await page.waitForSelector('input[name="name"]');
            // await sleep(5000)
            // const nameField = await page.$('input[name="name"]');
            await Promise.race([
                page.waitForSelector('input[name="name"]'),
                page.waitForSelector('input[name="firstName"]')
              ]);

            await sleep(5000);

            const nameField = await page.$('input[name="name"]') || await page.$('input[name="firstName"]');


            // Focus on the password field
            await nameField.focus();
            for (const char of name) {
                await sleep(300);
                await page.keyboard.press(char);
            }

            // Agreement
            await Promise.race([
                page.waitForSelector('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div > div:nth-child(5) > div.tou--container.remove-container-spacing > div > div > label'),
                page.waitForSelector('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div.paymentFormContainer > div.fieldContainer > div > div.tou--container > div > div > label')
              ]);

            const agreement = await page.$('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div > div:nth-child(5) > div.tou--container.remove-container-spacing > div > div > label') || await page.$('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div.paymentFormContainer > div.fieldContainer > div > div.tou--container > div > div > label');
            agreement.click();
            await sleep(1000)
            // Payment

            await Promise.race([
                page.waitForSelector('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div.submitBtnContainer > button'),
                page.waitForSelector('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div > button')
              ]);

            const submit = await page.$('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div.submitBtnContainer > button') || await page.$('#appMountPoint > div > div > div > div.simpleContainer > div > div > form > div > button');

            submit.click();

            await sleep(10000);


            // Evalute, check the url
            const changedURL = await page.evaluate(() => {
                return window.location.href;;
            });

            if (changedURL.includes('simpleSetup') || changedURL.includes('orderFinal')) {
              console.log("Fail: %s", $cardNumber);
              res.status(200).send(`Dead: ${$cardNumber}`);
            } else {
                console.log('Success: %s', $cardNumber);
                res.status(200).send(`Success: ${$cardNumber}`);
            }

            //await sleep(25000)
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


            page.close();

        } catch (e) {
            // Show where the error occurred
            console.error("Error", e);
            res.status(500).send(`Error: Kak Crashed!`);
        }
    })();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});



// const submitButton = document.getElementById('submitButton');



// document.getElementById('ccForm').addEventListener('submit', async function(event) {
//     event.preventDefault();
//     const form = event.target;
//     const formData = new FormData(form);
//     const data = {};
//     formData.forEach((value, key) => (data[key] = value));
//     fetch(form.action, {
//         method: form.method,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.text())
//     .then(responseText => {
//         if (responseText.includes('Dead')) {
//             document.getElementById('status').innerText = responseText;
//             document.getElementById('status').classList = 'response--danger';
//         }
//         else {
//             document.getElementById('status').innerText = responseText;
//             document.getElementById('status').classList = 'response--success';
//         }
//     })
//     .catch(error => {
//         document.getElementById('status').innerText = `Contact 't.me/Boki_Skrufel'`;
//         document.getElementById('status').classList = 'response--warning';
//     });
// });

// document.getElementById('darkModeToggle').addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');
//     document.body.classList.remove('deep-dark-mode');
//     document.body.classList.remove('light-mode');
// });

// document.getElementById('deepDarkModeToggle').addEventListener('click', () => {
//     document.body.classList.toggle('deep-dark-mode');
//     document.body.classList.remove('dark-mode');
//     document.body.classList.remove('light-mode');
// });
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomName() {
    const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Katie"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Davis"];

    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];

    return `${firstName}${lastName}${getRandomInt(1000, 9999)}`;
  }

  function generateRandomGmail() {
    const randomName = generateRandomName();
    return `${randomName}@gmail.com`;
  }

  function generateRandomPerson() {
    const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Katie"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Davis"];

    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];

    return `${firstName} ${lastName}`;
  }
