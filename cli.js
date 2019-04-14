#!/usr/bin/env node

const mdnsResolver = require('mdns-resolver');

if (process.argv.length < 3) {
    console.error('Usage: mdns-resolver <hostname>')
    process.exit(1)
  }

  var hostname = process.argv[2];
  hostname = hostname.toLowerCase();
  if(!hostname.endsWith(".local")){
    hostname+= ".local"
  }

console.log(`searching for ${hostname}`);
mdnsResolver.resolve4(hostname)
  .then((r)=>{
      console.log(`Found at: ${r}`);
      process.exit(0);
  })
  .catch((e)=>{
      console.log(e);
      process.exit(1);
  });

  setTimeout(function () {
    console.error('Hostname not found before timeout')
    process.exit(1)
  }, 3500)
