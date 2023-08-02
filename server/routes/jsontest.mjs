import fs from 'fs';


const jsontest = () => {

  const projects = [];

  // fs.writeFile('data/media.json', JSON.stringify(data), (err) => {
  //   if (err) throw err;
  //   console.log('Data written to the file');
  // })


  const directoryPath = './media'; // replace with your directory path

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    // listing all files using forEach
    files.forEach((file) => {
      projects.push({"mediaPath": file});
    });
    console.log(JSON.stringify(projects));
  });
}

export default jsontest;


