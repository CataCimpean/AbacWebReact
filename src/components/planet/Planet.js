import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { applyStatusClass, validateInput, basicFetch } from '../../utils';
import { ENDPOINTS } from '../../constants';
import './Planet.scss';

export default class Planet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: {
        [props.planet.planetId]: {
          value: props.planet.status,
          err: null,
          styleClass: applyStatusClass(props.planet.status)
        }
      },
      description: {
        [props.planet.planetId]: { value: props.planet.planetDescription || 'No description yet :/', err: null }
      }
    };
  }
  handleStatusInputChange = (event, planet) => {
    let inputValue = event.target.value;
    let { errMsg } = validateInput(inputValue);

    this.setState(prevState => ({
      status: {
        [planet.planetId]: {
          ...prevState.status[planet.planetId],
          value: inputValue,
          err: errMsg
        }
      }
    }));
  };
  handleDescriptionInputChange = (event, planet) => {
    let inputValue = event.target.value;

    this.setState(prevState => ({
      ...prevState,
      description: {
        [planet.planetId]: {
          ...prevState.status[planet.planetId],
          value: inputValue
        }
      }
    }));
  };
  handleSubmit = async (event, planet) => {
    event.preventDefault();
    const status = this.state.status[planet.planetId];
    const description = this.state.description[planet.planetId];
    if (status.err || description.err) return;

    // update planet, TODO: extract in separate function
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.props.token}`);
    headers.append('Content-Type', 'application/json');

    let body = JSON.stringify({
      Id: planet.planetId,
      Status: status.value,
      Description: description.value,
      ImageLink: planet.planetImageUrl,
      Name: planet.planetName
    });
    const planetsOptions = {
      method: 'PUT',
      mode: 'cors',
      headers,
      body
    };

    const planetUpdateRes = await basicFetch(ENDPOINTS.UPDATE_PLANET, planetsOptions);
    if (planetUpdateRes.status === 200) {
      alert(`Planet ${planet.planetName} was updated successfully by captain ${planet.captainName}!`);
    }
    const planetUpdateData = await planetUpdateRes.json();

    this.setState(prevState => ({
      ...prevState,
      status: {
        [planet.planetId]: {
          ...prevState.status[planet.planetId],
          styleClass: applyStatusClass(planetUpdateData.status)
        }
      }
    }));
  };
  handleTextareaKeyPress = (event, planet) => {
    if (event.keyCode === 13) {
      this.handleSubmit(event, planet);
    }
  };

  render() {
    const { planet, role } = this.props;
    const { status, description } = this.state;
    const isAdmin = role === 'Admin';
    if (!planet) return null;

    return (
      <Row className="planet-row">
        <form
          className="planet-form"
          onSubmit={event => {
            this.handleSubmit(event, planet);
          }}>
          <Col>
            <img className="planet-img" src={planet.planetImageUrl} alt={`img of ${planet.planetName}`} />
            <h4 className="planet-name">{planet.planetName}</h4>
          </Col>
          <Col className="planet-description" xs={7} sm={7} md={8} lg={8} xl={8}>
            <Row>
              {/* extract description field in a separate component */}
              <Col>
                <textarea
                  className="description"
                  disabled={!isAdmin}
                  value={description[planet.planetId].value}
                  onChange={event => {
                    this.handleDescriptionInputChange(event, planet);
                  }}
                  onKeyDown={event => {
                    this.handleTextareaKeyPress(event, planet);
                  }}
                  name="description"
                  id="description"
                  cols="30"
                  rows="3"></textarea>
              </Col>
              <Col className="planet-captain">
                <span>
                  <b>by captain: {` `}</b>
                </span>
                <u>{` ${planet.captainName}`}</u>
              </Col>
              <Col className="planet-robots">
                <b>Robbots:{` `}</b>
                {planet.robots &&
                  planet.robots.map((robot, index) => (
                    <span key={`robots-${index}`}>{index + 1 === planet.robots.length ? robot : `${robot}, `}</span>
                  ))}
              </Col>
            </Row>
          </Col>
          {/* extract status field in a separate component */}
          <Col className="planet-status">
            <input
              disabled={!isAdmin}
              className={`status-input ${status.styleClass} ${status[planet.planetId].styleClass}`}
              onChange={event => {
                this.handleStatusInputChange(event, planet);
              }}
              value={status[planet.planetId].value}
              type="text"
            />
            {status[planet.planetId].err && <span className="input-error-msg">{status[planet.planetId].err}</span>}
          </Col>
        </form>
      </Row>
    );
  }
}
