async function clickLink(linkXPath, page) {
    const [link] = await page.$x(linkXPath);
    if (link) {
        await link.click();
    } else {
        throw new Error(`Cannot find link "${link}"`);
    }
}

async function loginUser(username, password, page) {
    await page
    .goto("http://localhost:3000/login", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});
  
    await clickLink('//*[@id="root"]/div/header/div/div[2]/a', page);
    //await clickLink('//*[@id="root"]/div/header/div/a[2]', page);

    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);

    await clickLink('//*[@id="root"]/div/main/div/div/button', page);
}

module.exports = { clickLink, loginUser };