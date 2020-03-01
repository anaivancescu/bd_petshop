/* eslint-disable linebreak-style */

const sql = require('mssql/msnodesqlv8');
const express = require('express');
const bodyParser = require('body-parser');
const Logger = require('tracer').console();
const cors = require('cors');


const pool = new sql.ConnectionPool({
  database: 'master',
  server: 'localhost',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 60000,
  },
});

async function makeRequest(stringRequest) {
  try {
    const request = new sql.Request(pool);
    const res = await request.query(stringRequest);
    return res.recordset;
  } catch (e) {
    Logger.error(e);
    return 'ERROR';
  }
}

async function connect() {
  await pool.connect();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function uninit() {
  await makeRequest(`
  drop table if exists ceva;`)
  await makeRequest(`
  drop table if exists ingrijire;
  drop table if exists angajati;
  drop table if exists departamente;
  drop table if exists raport_medical;
  drop table if exists animale;
  drop table if exists rase;
  drop table if exists categorii;
  drop table if exists clinici;
  drop table if exists furnizori;
  `);
}

async function init() {
  await uninit();

  await makeRequest(`
  create table
  DEPARTAMENTE ( 
  
  id_departament int constraint dep_pk primary key,
  nume_departament varchar (15) not null,
  descriere_dep varchar (100));

  insert into departamente
  values (01 , 'ADMINISTATOR', 'administreaza petshop-ul');
  insert into departamente
  values (02 , 'FINANCIAR', 'se ocupa cu analiza venitului si stabilirea bugetului departamentelor');
  insert into departamente
  values (03 , 'MARKETING', 'se ocupa cu vanzarea animalelor');
  insert into departamente
  values (04 , 'SPECIALISTI', 'se ocupa de intretinerea animalelor cat si dresarea acestora');
  insert into departamente
  values (05 , 'MENTENANTA', 'reprezintă un ansamblu de activitati tehnico-organizatorice ce ajuta la mentinerea petshop-ului');
   
  create table 
  ANGAJATI ( 

  id_angajat int constraint angajat_pk primary key,
  nume_angajat varchar(15) unique,
  data_angajarii date,
  adresa varchar (150),
  nr_telefon bigint,
  id_departament int not null);
  
  alter table  ANGAJATI
  add constraint fk_id_departament foreign key(id_departament)
  references departamente(id_departament) on delete cascade;

  Insert into ANGAJATI
  values (1,'Ionescu',convert(datetime,'18-06-14 10:34:09 PM',5),'str,Cuza-Voda,bl30, scD',723454234,1);
  
  Insert into ANGAJATI
  values (2,'Popescu',convert(datetime,'18-05-15 10:34:09 PM',5),'str,Preciziei,bl31, scA',723234234,2);
  
  Insert into ANGAJATI
  values (3,'Chivescu',convert(datetime,'18-03-20 10:34:09 PM',5),'str,Primaverii,bl10, scC',733454234,2);

`);

/*
  await makeRequest(`
  create table ceva(
    id_ceva int constraint ceva_pk primary key,
    nume varchar(15) not null,
    prenume varchar(15) not null,
    id_departament int not null);
    
      
    alter table  ceva
    add constraint fk_id_2_departament foreign key(id_departament)
    references departamente(id_departament) on delete cascade;
  
  `)*/
  await makeRequest(`
  create table
  CATEGORII ( 

  id_categorie int constraint categ_pk primary key,
  nume_categorie VARCHAR (15) not null,
  dimensiune VARCHAR (5) not null,
  regim_alimentar varchar(100) not null);

  insert into categorii
  values (01 , 'CAINI', 'MARE','OMNIVORI');
  insert into CATEGORII
  values (02 , 'PISICI', 'MEDIE','CARNIVORE');
  insert into CATEGORII
  values (03 , 'PASARI', 'MICA','SEMINTE');
  insert into CATEGORII
  values (04 , 'ROZATOARE', 'MICA','ERBIVORE');
  insert into CATEGORII
  values (05 , 'PESTI', 'MICA','FULGI');

`);
  await makeRequest(`
  create table
  RASE ( 
  id_rasa int constraint rasa_pk primary key,
  nume_rasa VARCHAR(15) unique,
  specificatii varchar(200),
  id_categorie int not null);

  alter table RASE
  add constraint fk_id_categorie foreign key(id_categorie)
  references categorii(id_categorie);
  
  INSERT INTO RASE 
  VALUES(1,'BICHON','JUCAUS',1);
  INSERT INTO RASE 
  VALUES(2,'LUP','CAINE DOMESTIC',1);
  INSERT INTO RASE 
  VALUES(3,'OGAR','CAINE DE VANATOARE',1);
  INSERT INTO RASE 
  VALUES(4,'Persana','Pisica cu par lung, solida cap masiv',2);
  INSERT INTO RASE 
  VALUES(5,'Bengaleza','Ochii albastri-azurii',2);
  INSERT INTO RASE 
  VALUES(6,'Siberiana','Pisica de casa, blanita pufoasa',2);

  create table
  CLINICI ( 

  id_clinica INT constraint clinica_pk primary key,
  nume_clinica VARCHAR(20) not null,
  adresa VARCHAR(100) not null,
  program_lucru varchar(100));

  insert into clinici
  values (01 , 'CENTROVET', 'Strada Aristide Pascal 52','NONSTOP');
  insert into clinici
  values (02 , 'YOGO_VET', 'Șoseaua Ștefan cel Mare Nr. 39','9AM-8PM');
  insert into clinici
  values (03 , 'CRYSTAL_VET', 'Șoseaua Iancului 118','NONSTOP');
  insert into clinici
  values (04 , 'MDP_VET', 'Calea Vitan 104','9AM-4PM');

    `);
  await makeRequest(`
  create table
  RAPORT_MEDICAL(
    
  DATA_CONSULATIE DATE ,
  ID_ANIMAL INT NOT NULL,
  ID_CLINICA INT NOT NULL,
  CONSTRAINT PK_RAPORT_MEDICAL PRIMARY KEY (DATA_CONSULATIE,ID_ANIMAL,ID_CLINICA));


  `);
  await makeRequest(`
  CREATE TABLE 
  FURNIZORI(
  ID_FURNIZOR INT constraint FURNIZOR_pk primary key,
  NUME VARCHAR(15) unique,
  ADRESA VARCHAR(15) not null,
  TELEFON INT not null,
  EMAIL VARCHAR(20) not null,
  REPREZENTANT VARCHAR(10) unique) ;

  INSERT INTO FURNIZORI
  VALUES( 10,'Link_Vet SRL','Str. Ganesii 25',0742558516,'lupuvlad@gmail.com','Lupu Vlad');

  
  CREATE TABLE 
  ANIMALE(

  ID_ANIMAL int constraint ANIMALE_pk primary key,
  DATA_NASTERII DATE not null,
  ID_FURNIZOR int NOT NULL,
  ID_RASA int NOT NULL);

  ALTER TABLE ANIMALE
  ADD CONSTRAINT FK_FURNIZOR FOREIGN KEY(ID_FURNIZOR)
  REFERENCES FURNIZORI(ID_FURNIZOR);

  ALTER TABLE ANIMALE
  ADD CONSTRAINT FK_RASA FOREIGN KEY(ID_RASA)
  REFERENCES RASE(ID_RASA);

  INSERT INTO ANIMALE 
  values 
  (11,convert(datetime,'18-06-14 10:34:09 PM',5),10,1);
  INSERT INTO ANIMALE 
  values
  (12,convert(datetime, '22-02-18 10:34:09 PM',3),10,1);
  INSERT INTO ANIMALE 
  values
  (13,convert(datetime, '23-09-19 10:34:09 PM',5),10,1);
    
  `
  
  
  );
  await makeRequest(`
  CREATE TABLE INGRIJIRE(
  ID_ANIMAL int NOT NULL,
  ID_ANGAJAT int NOT NULL,
  CONSTRAINT PK_INGRIJIRE PRIMARY KEY (ID_ANIMAL,ID_ANGAJAT));
    
  ALTER TABLE INGRIJIRE
  ADD CONSTRAINT FK_INGRIJIRE FOREIGN KEY(ID_ANGAJAT)
  REFERENCES ANGAJATI(ID_ANGAJAT);
      
  ALTER TABLE INGRIJIRE
  ADD CONSTRAINT FK_ANIMAL FOREIGN KEY(ID_ANIMAL)
  REFERENCES ANIMALE(ID_ANIMAL);

  insert into ingrijire 
  values(12,1);

  `);


  await makeRequest(`
  ALTER TABLE RAPORT_MEDICAL
  add constraint fk_id_clinica foreign key(id_clinica)
  references clinici(id_clinica);

  ALTER TABLE RAPORT_MEDICAL
  add constraint fk_id_ANIMAL foreign key(id_animal)
  references animale(id_animal);
   insert into raport_medical
   values(convert(datetime,'18-06-14 10:34:09 PM',5),11,1);
`);
}

async function test() {
  await connect();
  await init();

  return;
  for (let i = 5; i < 15; i += 1) {
    await makeRequest(`insert into numere values(${i})`);
  }

  const res = await makeRequest('select * from numere');
  Logger.log(res);
  await uninit();

  Logger.log('terminat requesturi');
}

async function startHttpServer() {
  await connect();
  await init();
  const app = express();
  app.use(cors({ credentials: true, origin: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.post('/sql_request', async (req, res) => {
    const { request } = req.body;
    Logger.log(request);
    const result = await makeRequest(request);
    res.status(200).send(result);
  });

  app.listen(80, '0.0.0.0', () => {
    Logger.log('Started on PORT 80');
  });
}


startHttpServer();
