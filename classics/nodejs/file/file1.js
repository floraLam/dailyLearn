var fs = require('fs');

function copy(src, dst) {//从源路径读取文件内容
	fs.createReadStream(src).pipe(fs.createWriteStream(dst));
    //fs.writeFileSync(dst, fs.readFileSync(src));
    //将文件内容写入目标文件
}
//将test1的内容写入test2中
copy('test1.txt', 'test2.txt');




/*大文件拷贝，上述方法一次性将所有文件内容读取到
内存后再一次性写入磁盘的方式不适合拷贝大文件*/



/*function copy_large(src, dst) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main_large(argv) {
    copy(argv[0], argv[1]);
}*/
