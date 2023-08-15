const fs = require('fs')
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const process = require("process");
const { Console } = require('console');

dotenv.config({ path : "./.env" });

const url = "https://www.maybank2u.com.my/home/m2u/common/login.do";

const 马来亚银行用户名 = process.env.MAYBANK_ID;
const 马来亚银行密码 = process.env.MAYBANK_PASS;

const main = async () => { 
    const 浏览器 = await puppeteer.launch({ headless: "new", defaultViewport: null });
    const 页 = await 浏览器.newPage();
    const 模式 = process.argv[2];

    // Navigate to the Maybank2U website
    const 马来亚银行 = await 页.goto(url);

    if (马来亚银行.status() == 200) {

        // Auto insert Username from .env
        await 页.type("#username", 马来亚银行用户名);

        // Auto click on [Login] button
        await 页.click("#root > div > div.login---loginContainer---216o2.login---freeze---C65sE.row > div:nth-child(2) > div.Header---container---kBsDt > div.col-md-12 > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(3) > button");

        setTimeout(async () => {
            // Auto click on [YES] button
            await 页.click("#root > div > div.login---loginContainer---216o2.login---freeze---C65sE.row > div:nth-child(2) > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div.col-lg-6.col-md-6.col-sm-6.col-xs-12.SecurityPhrase---right-btn-container---32k8- > button");

            // Auto insert Password from .env
            await 页.type("#my-password-input", 马来亚银行密码).then(async (_) => {
                // Auto click on [Login] button
                await 页.click("#root > div > div.login---loginContainer---216o2.login---freeze---C65sE.row > div:nth-child(2) > div.Header---container---kBsDt > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div.modal-footer > div > div > button");

                const element = await 页.waitForSelector("#scrollToDashboard > div.Dashboard---container---2yC4Z > div.Dashboard---contentContainer---1JCRb.Dashboard---noAccumulatedBal---3hN9T > div:nth-child(3) > div.Dashboard---backgroundTile---LJ_N1 > div > div:nth-child(1) > div > div:nth-child(2) > div.col-lg-5.col-md-5.col-sm-6.col-xs-12.CardsContainer---odd---1gS0f > div > div > div > div.Card---cardSummary---1Cw3s > div.Card---accountSummary---1S7jK > span.Card---accountName---1H0r1");
                const account_name = await element.evaluate(el => el.textContent);

                const element_two = await 页.waitForSelector("#scrollToDashboard > div.Dashboard---container---2yC4Z > div.Dashboard---contentContainer---1JCRb.Dashboard---noAccumulatedBal---3hN9T > div:nth-child(3) > div.Dashboard---backgroundTile---LJ_N1 > div > div:nth-child(1) > div > div:nth-child(2) > div.col-lg-5.col-md-5.col-sm-6.col-xs-12.CardsContainer---odd---1gS0f > div > div > div > div.Card---cardSummary---1Cw3s > div.Card---accountSummary---1S7jK > span:nth-child(2)");
                const account_number = await element_two.evaluate(el => el.textContent);

                const element_three = await 页.waitForSelector("#scrollToDashboard > div.Dashboard---container---2yC4Z > div.Dashboard---contentContainer---1JCRb.Dashboard---noAccumulatedBal---3hN9T > div:nth-child(3) > div.Dashboard---backgroundTile---LJ_N1 > div > div:nth-child(1) > div > div:nth-child(2) > div.col-lg-5.col-md-5.col-sm-6.col-xs-12.CardsContainer---odd---1gS0f > div > div > div > div.well > div > div > div > div > div > span:nth-child(2)");
                const balance = await element_three.evaluate(el => el.textContent);

                const cny = await 货币(balance);

                console.log("\n\n");
                console.log("********************************");
                console.log("*           马来亚银行           *");
                console.log("********************************");
                console.log(`帐户类型: ${account_name}`);
                console.log(`账号号码: ${account_number}`);
                console.log(`账户结余: ${balance}马币 (${cny}人民币)`);
                console.log(`银行出纳员: ${message(balance)}`);
                console.log("********************************");
                console.log("\n\n");

                // Close browser
                if(浏览器) await 浏览器.close();
            });

        }, 5000);
    }
};

const 货币 = async (myr) => { 
    const url = `https://themoneyconverter.com/MYR/CNY`;
    const 浏览器 = await puppeteer.launch({ headless: "new", defaultViewport: null });
    const 页 = await 浏览器.newPage();

    await 页.goto(url);

    await 页.focus("#ta-input");
    await 页.keyboard.type(myr.toString());

    const element = await 页.waitForSelector("#cc-rate");
    const cny = await element.evaluate(el => el.textContent);
    const rmb = parseFloat(cny.replace("CNY/MYR = ", ""));

    if(浏览器) await 浏览器.close();

    return (myr * rmb).toPrecision(2);
};

const message = (value) => { 
    if (value < 100) return "可怜～🥺 太穷了～! 我建议你啊，\n你就再BOSS份好工作吧👇 \nhttps://www.zhipin.com ";
    if (value > 15000) return "卧槽！有钱人呀💰, 大哥/大姐 发点钱给我吧👇 \nhttps://tinyurl.com/y7su9ar9";

    return "\"蛮不错的\"";
};



if (fs.existsSync(".env")) {
    main();
} else { 
    console.error("《.env 文件不存在》");
}