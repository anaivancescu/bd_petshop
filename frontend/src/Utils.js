
import { Table } from 'react-bootstrap';
import React, { Component } from 'react';

const MODES = {
  VIEW: 'view',
  ADD: 'add',
  EDIT: 'edit',
};


const TYPES = {
  String: 'string',
  Int: 'int',
  Id: 'id',
  Fk: 'fk',
  Date: 'date',
};
const PAGES = {
  animale: {
    table: {
      id_animal: TYPES.Id,
      data_nasterii: TYPES.Date,
      id_furnizor: TYPES.Fk,
      id_rasa: TYPES.Fk,
    },
  },
  furnizori: {
    table: {
      id_furnizor: TYPES.Id,
      nume: TYPES.String,
      adresa: TYPES.String,
      telefon: TYPES.Int,
      email: TYPES.String,
      reprezentant: TYPES.String,
    },
  },
  clinici: {
    table: {
      id_clinica: TYPES.Id,
      nume_clinica: TYPES.String,
      adresa: TYPES.String,
      program_lucru: TYPES.String,
    },
  },
  angajati: {
    table: {
      id_angajat: TYPES.Id,
      nume_angajat: TYPES.String,
      data_angajarii: TYPES.Date,
      adresa: TYPES.String,
      nr_telefon: TYPES.Int,
      id_departament: TYPES.Fk,
    },
  },
  departamente: {
    table: {
      id_departament: TYPES.Id,
      nume_departament: TYPES.String,
      descriere_dep: TYPES.String,
    },
  },
  categorii: {
    table: {
      nume_categorie: TYPES.String,
      dimensiune: TYPES.String,
      regim_alimentar: TYPES.String,
      id_categorie: TYPES.Id,
    },
  },
  rase: {
    table: {
      id_rasa: TYPES.Id,
      nume_rasa: TYPES.String,
      id_categorie: TYPES.Fk,
      specificatii: TYPES.String,
    },
  },
  raport_medical: {
    table: {
      data: TYPES.Date,
      id_animal: TYPES.Fk,
      id_clinica: TYPES.Fk,
    },
  },
  ingrijire: {
    table: {
      id_animal: TYPES.Fk,
      id_angajat: TYPES.Fk,
    },
  },
 /*ceva: {
    table: {
      id_ceva: TYPES.Id,
      nume: TYPES.String,
      prenume: TYPES.String,
      id_departament: TYPES.Fk,
    }
  }*/
};
function toTypeSql(value, type) {
  if (type === TYPES.String) return `'${value}'`;
  if (type === TYPES.Date) return `convert(datetime, '${value}', 5)`;
  return value;
}
Object.keys(PAGES).forEach((key) => {
  PAGES[key].key = key;
});


function Capitalize(string) {
  if (!string) return '';
  return string[0].toUpperCase() + string.slice(1);
}

function SqlNameToPretty(string) {
  // 'nume_departament' -> 'Nume departamente'
  if (!string) return '';
  return Capitalize(string.replace(/_/g, ' '));
}

function renderTable(valori, onClickCallback, onOrderByClick) {
  if (!valori || !valori.length) return null;
  const tableKeys = Object.keys(valori[0]);
  const tableNames = tableKeys.map((key) => (
    <th style={{ cursor: 'pointer' }} onClick={() => {if (onOrderByClick) onOrderByClick(key);}}>
      {SqlNameToPretty(key)}
    </th>
  ));

  const tableValues = valori.map((element) => {
    const lineCallback = () => {
      if (onClickCallback) onClickCallback(element);
    };
    return (
      <tr style={{ cursor: 'pointer' }}>
        {
          Object.keys(element).map((key) => ( // pentru fiecare cheie din fiecare element
            <td onClick={() => (lineCallback())}>
              {element[key] /* valoarea cheii (adica 'carnivor') */}
            </td>
          ))
}
      </tr>
    );
    /*
      exemplu element: (e un json)
        {
          id_categorie: 2,
          nume_categorie: "PISICI",
          dimensiune: "MEDIE",
          regim_alimentar: "CARNIVORE",
        }

      valori luate de 'key':
        id_categorie, nume_categorie, dimensiune, regim_alimentar

      valori luate de element[key]:
        2, pisici, medie, carnivore
      rezultat-ul map-ului va fi un:
        <tr>
          2
        </tr>
        <tr>
          pisici
        </tr>
        <tr>
          medie
        </tr>
        <tr>
          carnivore
        </tr>
    */
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {tableNames}
        </tr>
      </thead>
      <tbody>
        {tableValues}
      </tbody>
    </Table>
  );
}

export {
  PAGES, MODES,
  renderTable,
  TYPES, Capitalize, SqlNameToPretty,
  toTypeSql,
};
