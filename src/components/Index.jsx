import React, { Component } from 'react';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from "react-bootstrap/ListGroup";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { compose } from "redux";
import { connect } from 'react-redux';
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
import Form from 'react-bootstrap/Form'

class Index extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
        isOpen: false,
        listView: true,
        isLoading: true,
        selectedIndex: 0,
        activeProviders: null,
        languages: []
    };
    this.switchView = this.switchView.bind(this);

  }

    handleFilterChange = (event) => {
        this.setState({filterValue: event.target.value});
    }

    // Remove async later
    handleInputChange = async (e) => {
      this.setState({
        activeProviders: this.props.providers
      })

      const filterName = e.target.name
      const filterVal = e.target.value
      
      if (e.target.type === "checkbox" && e.target.checked) {
        await this.setState({
          [filterName]: [...this.state[filterName], filterVal]
        })
          
      } else if(e.target.type === "checkbox" && !e.target.checked){

        await this.setState({
          [filterName]: this.state[filterName].filter(function(filter) {
            return filter !== filterVal
          })
        })
      }

      this.filterActiveProviders(filterName)
    };

    // Remove async later
    filterActiveProviders = async (filterName) => {
      await this.setState({
        activeProviders: this.state.activeProviders.filter((filter) => {

          return filter[filterName].filter( (elem) => {
          return this.state[filterName].indexOf(elem) > -1;
          }).length == this.state[filterName].length
        })
      })
    }


    filterFirestore = async () => {
      console.log(this.props.providers)
        let firestore = this.props.firestore
        await firestore.get({collection: 'providers', where: ['languages', 'array-contains', this.state.filterValue]}).then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id)
            });
        })
        this.setState({ activeProviders: this.props.providers })
    };

    // creates map and firebase
    async componentDidMount() {
        const { firestore, providers } = this.props;
        if (!isLoaded(providers)) {
            await firestore.get('providers');
        }
        this.setState({ activeProviders: this.props.providers })
        this.setState({ isLoading: false });
        window.initMap = () => this.initMap(this.refs.map);
        // Asynchronously load the Google Maps script, passing in the callback reference
        // API from Penn team: AIzaSyCdmgfV3yrYNIJ8p77YEPCT8BbRQU82lJI
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCdmgfV3yrYNIJ8p77YEPCT8BbRQU82lJI&callback=initMap')

    }

    initMap(mapDOMNode) {
      var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(39.9526, -75.1652),
        mapTypeId: 'roadmap',
        styles: [
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      }; // styles from https://mapstyle.withgoogle.com
        var map = new google.maps.Map(mapDOMNode, mapOptions);
        var geocoder = new google.maps.Geocoder();
        // TODO: add locations from firebase: DS can obvs change but rn its [string, lat, long]
        var locations = [
          ['<div id="content"><h1>Bethanna</h1><h3>Service Type</h3><p>Outpatient Services; Behavioral Health Rehabilitation Services (BHRS); Autism Spectrum Disorders (ASDs) Assessment and Services</p><h3>Types of Therapy</h3><p>"Trauma-Focused Cognitive Behavioral Therapy (TF-CBT); Individual and Family Therapy; Ecosystem Family Therapy (ESFT); Parent-Child Interaction (PCIT); Art, Play and other Creative Therapies; Group Therapy"<p><h3>Languages</h3><p>English; Spanish</p><h3>Specializations</h3><p>Autism Spectrum Disorder</p><h3>Insurance Type Accepted</h3><p>Medicaid</p><h3>EPIC Designation</h3><p>X</p><h3>Childcare Availability</h3><p>N/A</p><h3>Hours of Operation</h3><p>Monday-Friday 8AM-10PM <br>Weekend Hours: Saturday 8AM-7PM; Sunday Closed</p></div>', 39.935362, -75.186162],
          ['can just make this a string', 40.018002, -75.094173],
          ['html works here', 39.957149, -75.201862]
        ];
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        for (i = 0; i < locations.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
    }

    switchView() {
      this.setState({ listView: !this.state.listView });
    }

    expandForModal(index) {
      this.setState({ selectedIndex: index });
    }

    render() {
      const { isLoading, data, selectedIndex } = this.state;
      const providers = this.state.activeProviders;

      if (isLoading && !isLoaded(providers))
        return <div style={{ width: '100%' }}>
          <div className="spinner" />
      </div>;
      return (
        <div>
          <NavBar/>
            <style>
            {`
                .container-fluid {
                    overflow: hidden;
                    width: 95%;
                    height:calc(100vh - 56px);
                    height:-moz-calc(100vh - 56px);
                    height:-webkit-calc(100vh - 56px);
                    padding-left: 15px;
                    padding-right: 15px;
                }
            `}
            </style>
            <Container fluid="True">
            {/* toggle switch button */}
            <Button variant="primary" onClick={this.switchView} style={{
                marginTop:"15px",
                marginLeft:"15px",
                marginRight:"15px",
                marginBottom:"15px",
            }}>
                {this.state.listView ? "Hide Map" : "Show Map"}
            </Button>
                <DropdownButton id="dropdown-basic-button" title="Languages">
                    <Form.Check
                        name="languages"
                        onChange={this.handleInputChange}
                        type="checkbox"
                        value="English"
                        label="English" />
                    <Form.Check
                        name="languages"
                        onChange={this.handleInputChange}
                        type="checkbox"
                        value="Spanish"
                        label="Spanish" />

                </DropdownButton>
              <Row className="mh-100" style = {{
                  height: "85%",
                  marginLeft: "0px",
                  marginRight: "0px",
              }}>
                {/* List View*/}
                <Col>
                <ListGroup variant="flush">
                  {
                    !isEmpty(providers) &&
                    providers.map((item, index) =>
                      <ListGroup.Item
                        href={item.id}
                        onClick={(index) => this.expandForModal(index)}
                        active={selectedIndex === index}>
                        <h5>{item.id}</h5>
                        <p style={{marginBottom:"0"}}>{item.address}</p>
                      </ListGroup.Item>
                    )
                  }
                </ListGroup>
                    <input type="text" name="name" value={this.state.value} onChange={this.handleFilterChange}/>
                    <Button block onClick={this.filterFirestore}>Test Filter Provider</Button>
                </Col>

                {/* Map View */}
                <Collapse appear={true} in={this.state.listView}>
                <Col>
                  <div ref="map" id="map" style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}></div>
                </Col>
                </Collapse>

              </Row>

            </Container>
        </div>
      )
    }

}

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

export default compose(
  withFirestore,
  connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase
  })))(Index)
