const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules.js/replaceTemplate");
// const text=fs.readFileSync('./txt/input.txt','utf-8');
// const txt=` bla bla bla: ${text} .\n Created On ${Date.now()}`;
// console.log(txt);

// fs.writeFileSync('./txt/output.txt',txt);
// console.log('file written in output.txt');

// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         if(err)
//         throw err;

//         console.log(data2);
//     });

// });
// console.log('will read file');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);
const slugs=dataObj.map(el => slugify(el.productName,{lower:true}));

console.log(slugs);
//server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  console.log(url.parse(req.url));

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.end(output);
  } else if (pathname === "/product") {
    console.log(query);
    const product1 = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product1);

    res.end(output);
  } else if (pathname === "/api") {
    res.end(data);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>Page not found! </h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
