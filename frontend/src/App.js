import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { getCollection, cerere } from './Api';

import Tabel from './Tabel';

import { PAGES, Capitalize, TYPES, renderTable } from './Utils';


const CurrentPage = styled.section`
justifyContent: 'center';
alignItems: 'center';
width: 80%;
padding: 50px 0px 0px 0px;
margin-left: auto;
margin-right: auto;
`;

const Header = styled.section`
padding: 10;
display: 'flex';
justifyContent: 'center';
alignItems: 'center';
width: 50%;
padding: 10px;
margin-left: auto;
margin-right: auto;
`;

const Main = styled.section`
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: PAGES.categorii.key,
      sqlData: {
        
      },
      orderBy: {

      },
      rezultateCerere: [],
    };

    this.refreshData();
  }

  async refreshData() {
    const mockDataTypes = Object.keys(PAGES);
    // mock data
    for (let i = 0; i < mockDataTypes.length; i += 1) {
      const elem = mockDataTypes[i];
      const data = await getCollection(elem, this.state.orderBy[elem]);
      this.setState((prevState) => ({
        ...prevState,
        sqlData: {
          ...prevState.sqlData,
          [elem]: data,
        },
      }));
    }
    const rezultateCerere = await cerere();
    this.setState({
      rezultateCerere,
    })
  }

  changeOrderBy(key) {
    const { page } = this.state;
    this.setState({
      orderBy: {
        [page]: key,
      },
    });
    this.refreshData();
  }

  renderSubPage() {
    return (<Tabel {...this.state} changeOrderBy={(key) => this.changeOrderBy(key)} refreshData={() => this.refreshData()} />);
  }

  render() {
    console.log('APP.state: ', this.state);
    const pageKeys = Object.keys(PAGES);
    const pages = pageKeys.map((key) => (
      <ListGroup.Item action variant="primary" onClick={() => { this.setState({ page: key }); }}>
        {Capitalize(key)}
      </ListGroup.Item>
    ));
    pages.unshift(    
      
        <ListGroup.Item action variant="primary" onClick={() => { this.setState({ page: 'cereri' }); }}>
          Cereri
        </ListGroup.Item>
    )
    return (
      <Main>
        <Header>
          <ListGroup horizontal>
            {pages}
          </ListGroup>
        </Header>
          <CurrentPage>
           {this.state.page === 'cereri' ? renderTable(this.state.rezultateCerere) : 
            this.renderSubPage()
            }

          </CurrentPage>
      </Main>
    );
  }
}

export default App;
