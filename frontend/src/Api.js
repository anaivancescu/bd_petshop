import axios from 'axios';

async function getCollection(collectionName, sortedBy) {
  try {
    const result = await axios.post('http://localhost:80/sql_request', {
      request: `select * from ${collectionName}${sortedBy ? ` order by ${sortedBy}` : ''}`,
    });
    const res = result.data;

    const sanitized = [];

    // din ID_FURNIZOR in id_furnizor
    res.forEach((elem) => {
      const sanitizedObj = {};
      Object.keys(elem).forEach((key) => {
        sanitizedObj[key.toLowerCase()] = elem[key];
      });
      sanitized.push(sanitizedObj);
    });
    return sanitized;
  } catch (e) {
    console.error(e);
    return {};
  }
}

async function insert(collectionName, valueTypes, values) {
  try {
    const result = await axios.post('http://localhost:80/sql_request', {
      request: `insert into ${collectionName} ${valueTypes} values ${values}`,
    });
    return result.data;
  } catch (e) {
    console.error(e);
    return {};
  }
}


async function deleteById(collectionName, key, value) {
  try {
    const result = await axios.post('http://localhost:80/sql_request', {
      request: `delete from ${collectionName} where ${key}=${value}`,
    });
    return result.data;
  } catch (e) {
    console.error(e);
    return {};
  }
}

async function update(collectionName, newData, key, value) {
  try {
    const result = await axios.post('http://localhost:80/sql_request', {
      request: `update ${collectionName} set ${newData} where ${key}=${value}`,
    });
    return result.data;
  } catch (e) {
    console.error(e);
    return {};
  }
}


async function cerere(collectionName, newData, key, value) {
  try {
    const result = await axios.post('http://localhost:80/sql_request', {
      request: `SELECT r.nume_rasa, r.specificatii, c.nume_categorie, c.dimensiune, a.data_nasterii 
      FROM animale a
      LEFT JOIN rase r ON a.id_rasa = r.id_rasa
      LEFT JOIN categorii c ON r.id_categorie = c.id_categorie`,
    });
    return result.data;
  } catch (e) {
    console.error(e);
    return {};
  }
}


export {
  getCollection, insert, deleteById, update,cerere
};
