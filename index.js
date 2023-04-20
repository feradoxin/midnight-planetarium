const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");

require('dotenv').config();

console.log(crypto.randomUUID());