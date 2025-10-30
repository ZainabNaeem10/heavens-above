// __tests__/iridium.test.js
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const utils = require("../utils");
const { getTable } = require("../<your-file-name>"); // replace with actual filename

jest.mock("fs");
jest.mock("request");
jest.mock("../utils");

// Mock HTML pages
const mockMainPage = `
  <form>
    <table class="standardTable">
      <tbody>
        <tr>
          <td><a href="flare?id=123&type=V"></a></td>
          <td>brightness</td><td>alt</td><td>az</td>
          <td>satellite</td><td>distance</td><td>flare</td>
        </tr>
      </tbody>
    </table>
    <input name="ctl00$cph1$btnNext" value="nextpage">
  </form>
`;

const mockDetailPage = `
  <form>
    <table class="standardTable">
      <tbody>
        <tr><td>data</td><td>value0</td></tr>
        <tr><td>data</td><td>value1</td></tr>
        <tr><td>data</td><td>value2</td></tr>
        <tr><td>data</td><td>value3</td></tr>
        <tr><td>data</td><td>value4</td></tr>
        <tr><td>data</td><td>value5</td></tr>
        <tr><td>data</td><td>value6</td></tr>
      </tbody>
    </table>
    <img id="ctl00_cph1_imgSkyChart" src="image.png" />
  </form>
`;

describe("getTable()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should create directory if not exists and process first page", (done) => {
    // Mock utility functions
    utils.get_options.mockReturnValue({ url: "https://mock-url.com" });
    utils.iridium_options.mockReturnValue({ url: "https://mock-detail.com" });
    utils.image_options.mockReturnValue({ url: "https://mock-image.com" });
    utils.md5.mockReturnValue("mocked-md5");

    // Mock fs
    fs.existsSync.mockReturnValue(false);
    fs.mkdir.mockImplementation((_, cb) => cb(null));
    fs.appendFile.mockImplementation((_, __, cb) => cb(null));
    fs.createWriteStream.mockReturnValue({ on: jest.fn().mockReturnThis(), pipe: jest.fn() });

    // Mock request behavior
    request.mockImplementation((options, cb) => {
      if (options.url.includes("mock-url")) cb(null, { statusCode: 200 }, mockMainPage);
      else if (options.url.includes("mock-detail")) cb(null, { statusCode: 200 }, mockDetailPage);
    });
    request.get = jest.fn(() => ({ pipe: jest.fn().mockReturnThis(), on: jest.fn() }));

    const config = {
      root: "./",
      pages: 0,
      database: [],
      counter: 0,
      count: 1
    };

    getTable(config);

    // Delay check to allow async behavior
    setTimeout(() => {
      expect(fs.mkdir).toHaveBeenCalled();
      expect(request).toHaveBeenCalled();
      expect(fs.appendFile).toHaveBeenCalled();
      expect(utils.md5).toHaveBeenCalled();
      done();
    }, 300);
  });

  test("should skip processing when request fails", (done) => {
    utils.get_options.mockReturnValue({ url: "https://mock-url.com" });
    fs.existsSync.mockReturnValue(true);
    request.mockImplementation((_, cb) => cb(new Error("Network error"), {}, null));

    const config = {
      root: "./",
      pages: 0,
      database: [],
      counter: 0
    };

    getTable(config);

    setTimeout(() => {
      expect(request).toHaveBeenCalled();
      done();
    }, 200);
  });
});
