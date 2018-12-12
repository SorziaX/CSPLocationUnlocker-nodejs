var fs = require('fs');
fs.readFile('a.txt', (err, data) => {
    if (err) throw err;
    var buf = data;

    console.log(buf);

    var part;
    for(var i = 0 ; i <= buf.byteLength - 4; i++){
        part = buf.readUIntBE(i,4);
        console.log(part.toString(16));
        if(part.toString(16) == '44454647'){
            
            console.log("YES");
            buf.writeUIntBE('0x44444444',i,4);
            console.log(buf);
            fs.writeFileSync('b.txt', buf);
            break;
        }
    }
  });