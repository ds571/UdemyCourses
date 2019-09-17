import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header, Icon, Image, List } from 'semantic-ui-react'

class App extends Component {
  state = {
    values: []
  }

  // lifecycle method
  // Wait until component has  mounted
  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
      .then((response) => {
        //console.log(response);
        this.setState({
          values: response.data
        });
      });

  }

  render() {

    return (
    <div>
    <Header as='h2'>
      <Icon name='users' circular />
      <Header.Content>Reactivities</Header.Content>
    </Header>
    <List>
      {this.state.values.map((value: any) => (
        <List.Item key={value.id}>{value.name}</List.Item>
      ))}
    </List>

    </div>);
  }
}

export default App;