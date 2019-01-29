var fs = require('fs');
var path = require('path');

//get args
var args = process.argv.splice(2)
var inPath = args[0];
if(!inPath){
    inPath = "";
}

try{
    var data = fs.readFileSync(path.join(__dirname,path.sep + 'config.json'), 'utf8');
}catch{
    console.log("Can't read file 'config.json'");
}
if(!data) return;
var json = JSON.parse(data);

let originFilePath = path.join(__dirname,inPath,json.fileName);
let newFilePath = path.join(__dirname,inPath,json.fileName + ".new");
let bakFilePath = path.join(__dirname,inPath,json.fileName + ".bak");

console.log(originFilePath);

replaceFileHEXsToFile(originFilePath,newFilePath,json.replaceList,function(){
    fs.renameSync(originFilePath, bakFilePath);
    fs.renameSync(newFilePath, originFilePath);
});

function replaceHEXInBuffer(buffer,targetValue,newValue){
    var part;
    for(var i = 0 ; i <= buffer.byteLength - 4; i++){
        part = buffer.readUIntBE(i,4);
        if(part.toString(16) == targetValue){
            
            buffer.writeUIntBE('0x' + newValue,i,4);
            break;
        }
    }
}

function replaceFileHEXsToFile(originFilePath,newFilePath,options,completation){
    fs.readFile(originFilePath, (err, data) => {
        if (err) throw err;
        var buffer = data;

        for(var index in options){

            var option = options[index];
            var targetValue = option.target_value;
            var newValue = option.new_value;

            replaceHEXInBuffer(buffer,targetValue,newValue);

            console.log("Replaced " + targetValue + " -> " + newValue);
        }

        fs.writeFileSync(newFilePath, buffer);

        completation();
        
      });
}

