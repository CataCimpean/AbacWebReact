import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Planet from '../planet/Planet';
import { basicFetch } from '../../utils';
import { ENDPOINTS } from '../../constants';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      role: '',
      planets: [],
      showSpinner: false
    };
  }
  async componentDidMount() {
    this.setState({
      showSpinner: true
    });
    const randomRoleInt = Number(Math.random() >= 0.5);
    const roleArray = ['User', 'Admin'];
    const randomRole = roleArray[randomRoleInt];
    const body = JSON.stringify({ username: randomRole, password: randomRole.toLowerCase() });

    // get auth, TODO: extract in separate function
    const authenticateOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors',
      body: body
    };
    let authenticateRes = await basicFetch(ENDPOINTS.AUTHENTICATE, authenticateOptions);
    let authenticateData = await authenticateRes.json();

    this.setState({
      token: authenticateData.token,
      role: authenticateData.roles[0]
    });

    // get planets, TODO: extract in separate function
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${this.state.token}`);

    const planetsOptions = {
      method: 'GET',
      mode: 'cors',
      headers
    };
    let planetsRes = await basicFetch(ENDPOINTS.GET_PLANETS, planetsOptions);
    let planetsData = await planetsRes.json();
    this.setState({
      planets: planetsData,
      showSpinner: false
    });
  }

  render() {
    const { token, role, planets, showSpinner } = this.state;

    return (
      <Container className="wrap-container" fluid>
        <Row className="top-header">
          <Col>
            <h1>Planets</h1>
            <h5>
              Role: <b>{` ${role}`}</b>
            </h5>
          </Col>
        </Row>
        <Row className="planet-wrapper">
          {showSpinner ? (
            <h2 className="spinner">Loading...</h2>
          ) : (
            <Col>
              {planets &&
                planets.map(planet => (
                  <Planet role={role} token={token} planet={planet} key={`planet-${planet.planetId}`} />
                ))}
            </Col>
          )}
        </Row>
      </Container>
    );
  }
}

export default App;
