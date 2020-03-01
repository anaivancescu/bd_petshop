import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { renderTable, MODES } from './Utils';
import Formular from './Formular';


const Page = styled.section`
`;
const ButtonStyle = styled.section`
padding: 0px 0px 20px 0px;
`;
class Clasa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: MODES.VIEW,
    };
  }

  onClickEdit(elem) {
    this.setState({
      mode: MODES.EDIT,
      editElement: elem,
    });
  }

  render() {
    const { mode } = this.state;
    const { page } = this.props;
    const tableData = this.props.sqlData[page];
    return (
      <Page>
        <ButtonStyle>
          <Button
            onClick={() => this.setState({
              mode: mode === MODES.VIEW ? MODES.ADD : MODES.VIEW,
              editElement: null,
            })}
            variant={mode === MODES.VIEW ? 'dark' : 'primary'}
          >
            {mode === MODES.VIEW ? MODES.ADD : MODES.VIEW}
          </Button>
        </ButtonStyle>
        {mode === MODES.VIEW ? renderTable(tableData, (elem) => (this.onClickEdit(elem)), (key) => (this.props.changeOrderBy(key))) : (
          <Formular
            refreshData={() => this.props.refreshData()}
            page={page}
            mode={mode}
            editElement={this.state.editElement}
            finishedFormular={() => this.setState({ mode: MODES.VIEW })}
          />
        )}
      </Page>
    );
  }
}

export default Clasa;
