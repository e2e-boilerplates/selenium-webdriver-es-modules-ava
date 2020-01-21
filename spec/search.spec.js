import test from "ava";
import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

require("chromedriver");

const baseOptions = new chrome.Options();
const chromeOptions = process.env.GITHUB_ACTIONS
  ? baseOptions.headless()
  : baseOptions;

let browser;

test.before(async () => {
  browser = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();
  browser.get("https://www.google.com");
});

test.after(async () => {
  browser.quit();
});

test("should be on google search page", async t => {
  const searchBox = await browser.findElement(By.name("q"));
  await browser.wait(until.elementIsVisible(searchBox), 5000);

  const title = await browser.getTitle();
  t.is(title, "Google");
});

test("should search for Cheese!", async t => {
  const searchBox = await browser.findElement(By.name("q"));
  t.true(await searchBox.isDisplayed());
  searchBox.sendKeys("Cheese!", Key.ENTER);
});

test('the page title should start with "Cheese!"', async t => {
  await browser.wait(until.urlContains("search"), 5000);

  const title = await browser.getTitle();
  const words = title.split(" ");
  t.is(words[0], "Cheese!");
});
