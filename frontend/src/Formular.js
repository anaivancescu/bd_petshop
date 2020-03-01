import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { insert, deleteById, update } from './Api';
import {
  TYPES, MODES, PAGES, SqlNameToPretty, toTypeSql,
} from './Utils';


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Formular extends Component {
  constructor(props) {
    super(props);
  }

  getTypeKeys() {
    const { page } = this.props;
    const type = PAGES[page].table;
    return Object.keys(type) || [];
  }

  getTypes() {
    const { page } = this.props;
    return PAGES[page].table;
  }


  getValuesAndTypes() {
    const toAdd = {};
    const typeKeys = this.getTypeKeys();
    typeKeys.forEach((key) => {
      toAdd[key] = this[key].value;
    });
    let valueTypes = '(';
    let values = '(';
    const { page } = this.props;
    Object.keys(toAdd).forEach((key) => {
      valueTypes += `${key},`;

      const type = PAGES[page].table[key];
      values += `${toTypeSql(toAdd[key], type)},`;
    });
    // remove last ,
    values = values.slice(0, -1);
    valueTypes = valueTypes.slice(0, -1);
    values += ')';
    valueTypes += ')';
    return {
      values, valueTypes,
    };
  }

  async onDelete() {
    const { refreshData, finishedFormular, page } = this.props;
    const typeKeys = this.getTypeKeys();
    const types = this.getTypes();
    typeKeys.forEach(async (key) => {
      if (types[key] === TYPES.Id) {
        await deleteById(page, key, this[key].value);
      }
    });
    await refreshData();
    finishedFormular();
  }

  async handleSubmit(event) {
    const { mode, page } = this.props;

    event.preventDefault();
    event.stopPropagation();
    const { refreshData, finishedFormular } = this.props;
    const { values, valueTypes } = this.getValuesAndTypes();
    if (mode === MODES.ADD) {
      await insert(page, valueTypes, values);
    } else {
      // mode is edit

      const typeKeys = this.getTypeKeys();
      const types = this.getTypes();
      const { page } = this.props;

      let idKey;
      let idValue;
      let newData = '';
      typeKeys.forEach((key) => {
        if (types[key] === TYPES.Id) {
          idKey = key;
          idValue = this[key].value;
          return;
        }
        const type = PAGES[page].table[key];
        if (newData.length > 0) { // mai are valori inainte?
          newData += ', ';
        }
        newData += `${key}=`;
        newData += toTypeSql(this[key].value, type);
      });
      await update(page, newData, idKey, idValue);
    }
    await refreshData();
    finishedFormular();
  }


  render() {
    const typeKeys = this.getTypeKeys();
    const types = this.getTypes();
    const { editElement } = this.props;
    const defaultValues = this.props.editElement || {};
    if (!editElement) {
      typeKeys.forEach((key) => {
        if (types[key] === TYPES.Id) {
          defaultValues[key] = getRandomInt(100000); // un id random pre-completat pt elementele noi
        }
        if (types[key] === TYPES.Date) {
          defaultValues[key] = '18-06-14 10:34:09 PM';
        }
      });
    }
    const fields = typeKeys.map((key) => (
      <Form.Group controlId="key">
        <Form.Label>{SqlNameToPretty(key)}</Form.Label>
        <Form.Control
          type="text"
          placeholder={SqlNameToPretty(key)}
          defaultValue={defaultValues[key]}
          ref={(ref) => { this[key] = ref; }}
        />
      </Form.Group>
    ));

    return (
      <Form onSubmit={(event) => this.handleSubmit(event)}>
        {fields}
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {editElement
          ? (
            <Button
              style={{ 'margin-left': '30px' }}
              variant="danger"
              type="submit"
              onClick={() => this.onDelete()}
            >
            Delete
            </Button>
          ) : null}
      </Form>
    );
  }
}
export default Formular;
