#!/usr/bin/env node

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const prettierHtml = async (html, filepath) => {
  html = prettier.format(html, { parser: "html" });

  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, html);
};

const getFirebaseSnippet = () => {
  return `
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="https://www.gstatic.com/firebasejs/7.13.2/firebase-analytics.js"></script>

    <script>
      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyDWpRDJR-QXfoJpC4owgAjAcAJI1lCo5Fg",
        authDomain: "jacebean-715.firebaseapp.com",
        databaseURL: "https://jacebean-715.firebaseio.com",
        projectId: "jacebean-715",
        storageBucket: "jacebean-715.appspot.com",
        messagingSenderId: "837393448164",
        appId: "1:837393448164:web:0103c5b195fa486799c0f1",
        measurementId: "G-YCNJGDFT77",
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    </script>`;
};

const getChpStyle = () => {
  return `
    <link href="/favicon.ico" rel="icon" type="image/png" />
    <style>
    table {
      font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td, th {
      border: 1px solid #ddd;
      padding: 8px;
    }

    tr:nth-child(even){background-color: #f2f2f2;}

    tr:hover {background-color: #ddd;}

    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #4CAF50;
      color: white;
    }
    </style>`;
};

const writeCaseDetail = async (caseDetail, now) => {
  let html = `
<!DOCTYPE html>
<html lang="zh-Hant" translate="no">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="新型冠狀病毒, 個案, ${
      caseDetail["個案編號"]
    }" />
    <title>新型冠狀病毒個案 - ${caseDetail["個案編號"]}</title>
    <meta property="title" content="新型冠狀病毒個案 - ${
      caseDetail["個案編號"]
    }" />
    <meta property="og:title" content="新型冠狀病毒個案 - ${
      caseDetail["個案編號"]
    }" />
    <meta property="description" content="新型冠狀病毒個案 - ${
      caseDetail["個案編號"]
    }" />
    <meta property="og:description" content="新型冠狀病毒個案 - ${
      caseDetail["個案編號"]
    }" />
    ${getChpStyle()}
  </head>
  <body>
    <table>
      <tr>
        <th>最後更新日期</th>
      </tr>
      <tr>
        <td>${now.toLocaleString()}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>個案編號</th>
        <th>${caseDetail["個案編號"]}</th>
      </tr>`;

  for (let key of [
    "實驗室確診報告日期",
    "發病日期",
    "性別",
    "年齡",
    "入住醫院名稱",
    "住院_出院_死亡",
    "香港_非香港居民",
    "個案分類",
    "確定_懷疑",
  ]) {
    html += `
      <tr>
        <td>${key.replace(/_/g, "/")}</td>
        <td>${caseDetail[key]}</td>
      </tr>`;
  }

  html += `
    </table>
    ${getFirebaseSnippet()}
  </body>
</html>`;

  await prettierHtml(html, `docs/chp/${caseDetail["個案編號"]}.html`);
};

const chp = async () => {
  try {
    const now = new Date();

    const baseUrl =
      "https://services8.arcgis.com/PXQv9PaDJHzt8rp0/arcgis/rest/services";
    const urlSuffix =
      "FeatureServer/0/query?f=json&where=Status%3D%27Existing%27&outFields=*";

    const buildings = await axios.get(
      `${baseUrl}/StayBuildingWithHistory_0227_View/${urlSuffix}`
    );

    const cases = await axios.get(
      `${baseUrl}/Merge_Display_0227_View/${urlSuffix}`
    );

    const districts = [
      {
        name: "中西區",
        district: "Central & Western",
        filename: "centralwestern.html",
      },
      {
        name: "東區",
        district: "Eastern",
        filename: "eastern.html",
      },
      {
        name: "離島",
        district: "Islands",
        filename: "islands.html",
      },
      {
        name: "九龍城",
        district: "Kowloon City",
        filename: "kowlooncity.html",
      },
      {
        name: "葵青",
        district: "Kwai Tsing",
        filename: "kwaitsing.html",
      },
      {
        name: "觀塘",
        district: "Kwun Tong",
        filename: "kwuntong.html",
      },
      {
        name: "北區",
        district: "North",
        filename: "north.html",
      },
      {
        name: "西貢",
        district: "Sai Kung",
        filename: "saikung.html",
      },
      {
        name: "沙田",
        district: "Sha Tin",
        filename: "shatin.html",
      },
      {
        name: "深水埗",
        district: "Sham Shui Po",
        filename: "shamshuipo.html",
      },
      {
        name: "南區",
        district: "Southern",
        filename: "southern.html",
      },

      {
        name: "大埔",
        district: "Tai Po",
        filename: "taipo.html",
      },
      {
        name: "荃灣",
        district: "Tsuen Wan",
        filename: "tsuenwan.html",
      },
      {
        name: "屯門",
        district: "Tuen Mun",
        filename: "tuenmun.html",
      },
      {
        name: "灣仔",
        district: "Wan Chai",
        filename: "wanchai.html",
      },
      {
        name: "黃大仙",
        district: "Wong Tai Sin",
        filename: "wongtaisin.html",
      },
      {
        name: "油尖旺",
        district: "Yau Tsim Mong",
        filename: "yautsimmong.html",
      },
      {
        name: "元朗",
        district: "Yuen Long",
        filename: "yuenlong.html",
      },
    ];

    for (let feature of buildings.data.features) {
      for (let district of districts) {
        if (feature.attributes.District === district.district) {
          feature.attributes.Related_confirmed_cases = feature.attributes.Related_confirmed_cases.match(
            /\d+/g
          );

          for (let buildingCase of feature.attributes.Related_confirmed_cases) {
            const caseDetail = cases.data.features.find(
              (c) => c.attributes.Case_no_ === parseInt(buildingCase)
            );

            await writeCaseDetail(caseDetail.attributes, now);

            if (!feature.attributes.caseDetails)
              feature.attributes.caseDetails = [];
            feature.attributes.caseDetails.push(caseDetail.attributes);
          }

          if (feature.attributes.DateoftheLastCase) {
            if (!district.nonResidential) district.nonResidential = [];
            district.nonResidential.push(feature.attributes);
          } else {
            if (!district.residential) district.residential = [];
            district.residential.push(feature.attributes);
          }
        }
      }
    }

    districts.sort((a, b) => {
      return (
        b.residential.length +
        b.nonResidential.length -
        (a.residential.length + a.nonResidential.length)
      );
    });

    let html = `
<!DOCTYPE html>
<html lang="zh-Hant" translate="no">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="新型冠狀病毒, 個案, 大廈名單" />
    <title>新型冠狀病毒個案大廈名單</title>
    <meta property="title" content="新型冠狀病毒個案大廈名單" />
    <meta property="og:title" content="新型冠狀病毒個案大廈名單" />
    <meta property="description" content="新型冠狀病毒個案大廈名單" />
    <meta property="og:description" content="新型冠狀病毒個案大廈名單" />
    ${getChpStyle()}
  </head>
  <body>
    <table>
      <tr>
        <th>最後更新日期</th>
      </tr>
      <tr>
        <td>${now.toLocaleString()}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>地區</th>
        <th>總數 (${districts.reduce(
          (a, b) => a + b.residential.length + b.nonResidential.length,
          0
        )})</th>
      </tr>`;

    for (let district of districts) {
      html += `
      <tr>
        <td><a target="_blank" href="/chp/${district.filename}">${
        district.name
      }</a></td>
        <td>${district.residential.length + district.nonResidential.length}</td>
      </tr>`;
    }

    html += `
    </table>
    ${getFirebaseSnippet()}
  </body>
</html>`;

    await prettierHtml(html, `docs/chp/index.html`);

    for (let district of districts) {
      let html = `
<!DOCTYPE html>
<html lang="zh-Hant" translate="no">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="新型冠狀病毒, 個案, 大廈名單, ${
      district.name
    }" />
    <title>新型冠狀病毒個案大廈名單 - ${district.name}</title>
    <meta property="title" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    <meta property="og:title" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    <meta property="description" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    <meta property="og:description" content="新型冠狀病毒個案大廈名單 - ${
      district.name
    }" />
    ${getChpStyle()}
  </head>
  <body>
    <table>
      <tr>
        <th>最後更新日期</th>
      </tr>
      <tr>
        <td>${now.toLocaleString()}</td>
      </tr>
    </table>
    <table>
      <tr>
        <th>${district.name} (曾有確診或疑似個案居住過的住宅大廈名單)</th>
        <th>相關確診/疑似個案編號</th>
      </tr>`;

      district.residential.sort((a, b) => {
        return a["大廈名單"].localeCompare(b["大廈名單"]);
      });

      for (let building of district.residential) {
        html += `
      <tr>
        <td><a target="_blank" href="https://www.google.com/maps?q=${
          district.name
        }+${building["大廈名單"].replace(/ /g, "+")}">${
          building["大廈名單"]
        }</a></td>
        <td>${building.caseDetails
          .map(
            (c) =>
              `<a target="_blank" href="/chp/${c.Case_no_}.html">${c.Case_no_}</a>`
          )
          .join(",<br />")}</td>
      </tr>`;
      }

      html += `
    </table>
    <table>
      <tr>
        <th>${district.name} (曾有確診或疑似個案在自出現病徵前兩天起到訪過的大廈或兩宗或以上確診或疑似個案在潛伏期內到訪過的大廈名單)</th>
        <th>報告日期/曾有涉及個案最後到訪的日期</th>
        <th>相關確診/疑似個案編號</th>
      </tr>`;

      district.nonResidential.sort((a, b) => {
        return a["大廈名單"].localeCompare(b["大廈名單"]);
      });

      for (let building of district.nonResidential) {
        const date = new Date(building.DateoftheLastCase);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        html += `
      <tr>
        <td><a target="_blank" href="https://www.google.com/maps?q=${
          district.name
        }+${building["大廈名單"].replace(/ /g, "+")}">${
          building["大廈名單"]
        }</a></td>
        <td>${year}-${month}-${day}</td>
        <td>${building.caseDetails
          .map(
            (c) =>
              `<a target="_blank" href="/chp/${c.Case_no_}.html">${c.Case_no_}</a>`
          )
          .join(",<br />")}</td>
      </tr>`;
      }

      html += `
    </table>
    ${getFirebaseSnippet()}
  </body>
</html>`;

      await prettierHtml(html, `docs/chp/${district.filename}`);
    }

    fs.copyFileSync("docs/chp/index.html", "docs/index.html");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const itunes = async () => {
  try {
    const countries = [
      { code: "gb", name: "United Kingdom" },
      { code: "hk", name: "Hong Kong" },
      { code: "jp", name: "Japan" },
      { code: "tw", name: "Taiwan" },
      { code: "us", name: "United States" },
    ];

    for (let country of countries) {
      const res = await axios.get(
        `https://rss.itunes.apple.com/api/v1/${country.code}/movies/top-movies/all/100/explicit.json`
      );

      const top10 = res.data.feed.results
        .slice(0, 10)
        .map((m) => m.name)
        .join(", ");

      let html = `
<!DOCTYPE html>
<html lang="en" translate="no">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="itunes, movie, ${top10}" />
    <title>Top 100 Movies - ${country.name}</title>
    <meta property="title" content="Top 100 Movies - ${country.name}" />
    <meta property="og:title" content="Top 100 Movies - ${country.name}" />
    <meta property="description" content="${top10}" />
    <meta property="og:description" content="${top10}" />
    <link href="/favicon.ico" rel="icon" type="image/png" />
    <style>
      div.container {
        margin: 0 auto;
        text-align: center;
      }
      div.movie {
        display: inline-block;
        width: 180px;
        height: 280px;
        overflow: hidden;
        text-align: center;
      }
      a {
        text-decoration: none;
        color: black;
      }
      a:hover {
        color: red;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="chart">`;

      for (let movie of res.data.feed.results) {
        html += `
        <div class="movie">
          <a
            href="${movie.url}?at=1000lHjy"
            ><img
              loading="lazy"
              alt="${movie.name.replace(/"/g, "&quot;")}"
              src="${movie.artworkUrl100}"
            /><br />${movie.name.replace(/"/g, "&quot;")}<br />${
          movie.releaseDate
        }</a
          >
        </div>`;
      }

      html += `
      </div>
    </div>
    ${getFirebaseSnippet()}
  </body>
</html>`;

      await prettierHtml(html, `docs/itunes/${country.code}/index.html`);
    }

    fs.copyFileSync("docs/itunes/hk/index.html", "docs/itunes/index.html");
  } catch (e) {
    console.error(e);
    process.exit(2);
  }
};

const run = async () => {
  try {
    await chp();
    await itunes();
  } catch (e) {
    console.error(e);
    process.exit(3);
  }
};

run();
