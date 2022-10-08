import fs from 'fs';

const readJsonFile = async (file: string, dataToAlter: Array<object>, jsonData: Array<string>): Promise<void> => {
  fs.readFile(file, 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err)
    } else {
      try {
        jsonData = JSON.parse(jsonString);
        for (let publisher of jsonData) {
          dataToAlter.push({name: publisher});
        }
      } catch (err) {
        console.log(err);
      }
    }
  })
}

export { readJsonFile }