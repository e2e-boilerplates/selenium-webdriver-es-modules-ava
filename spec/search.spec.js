import test from "ava";
import { Builder, By, Capabilities, Key, until } from "selenium-webdriver";
import isCI from "is-ci";

const chromeCapabilities = Capabilities.chrome();

require("chromedriver");

let browser;

chromeCapabilities.set("goog:chromeOptions", {
  args: ["--headless", "--no-sandbox", "--disable-gpu"]
});

test.before(async () => {
  browser = isCI
    ? await new Builder()
        .forBrowser("chrome")
        .withCapabilities(chromeCapabilities)
        .build()
    : await new Builder().forBrowser("chrome").build();
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
