import React, { Component } from 'react';
import Airtable from 'airtable';
import Moment from 'react-moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Tab, Tabs } from 'react-bootstrap';

import Activity from './Activity';

const airTableKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const airTableBase = process.env.REACT_APP_AIRTABLE_BASE;
const base = new Airtable({ apiKey: airTableKey }).base(airTableBase);

export default class Session extends Component {
	
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            session: null,
            persons: [],
            newPerson: '',
            activeTab: props.activeTab || 1
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    inputValue = '';

    async componentDidMount() {
    	this.loadData()
        //this.timer = setInterval(() => this.fetchPersons(), 5000);
    }

    async loadData() {
        await this.fetchSession(this.props.match.params.id)
        await this.fetchPersons()        
    }

  	render() {
		const session = this.state.session
		const persons = this.state.persons

        let sessionInfo
        let personInfo

        if (session != null){
            sessionInfo =
            <Container>
                <Row>
                    <Col><br/>
                        <Card>
                          <Card.Body>
                            <Card.Title>{session.fields.Name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted"><Moment format="LLLL">{session.fields.Start}</Moment></Card.Subtitle>
                            <Card.Text>
                              {session.fields.Notes}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        }
        if (session != null && persons.length > 0) {
            personInfo =
            <Container>
                <Row>
                    <Col>
                        <br/>
                        <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect}>
                            <Tab eventKey={1} title="Register">
                                <br/>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <input value={this.state.newPerson} onChange={this.changeInputHandler} placeholder="New person..." />
                                        <Button variant="primary" size="sm" onClick={this.handleClick}>Add</Button>
                                    </ListGroup.Item>
                                    {persons.map(person => 
                                        <ListGroup.Item key={ person.id }>
                                            <label><input 
                                                type="checkbox" 
                                                defaultChecked={
                                                    //calculate if person is already logged as attending
                                                    (session != null) && session.fields.Attended != null ?  session.fields.Attended.includes(person.id) : false
                                                }
                                                onChange={() => this.handleChange(person.id, this.checked)}
                                            />&nbsp;
                                            { person.fields.Name }</label>
                                        </ListGroup.Item> 
                                    )}
                                    
                                </ListGroup>

                            </Tab>
                            <Tab eventKey={2} title="Activities"><br/>
                                <Row>
                                    {session.fields.Activities.map(activityId =>
                                        <Col xs={6} key={ activityId } >
                                            <Activity activityId={ activityId }></Activity><br/>
                                        </Col>
                                    )}
                                </Row>
                            </Tab>
                        </Tabs>

                        <br/>

                    </Col>
                </Row>
            </Container>
        }

    	return (
        	<div>
          		<div>{sessionInfo}</div>
                <div>{personInfo}</div>
                <p>{this.state.isFetching ? 'Fetching data...' : ''}</p>
        	</div>
    	);
  	}

    handleSelect(selectedTab) {
        // The active tab must be set into the state so that
        // the Tabs component knows about the change and re-renders.
        this.setState({
            activeTab: selectedTab
        });
    }

  	async fetchSession(Id) {
		var self = this;
		await base('Session').find(Id, function(err, record) {
		    if (err) { console.error(err); return; }
		    self.setState({ isFetching: false, session: record })
		});
  	}

    async fetchPersons() {
        try {
	    	this.setState({isFetching: true})
		    await base('Person').select({ sort: [{field: "Name", direction: "asc"}], view: 'Grid view'})
		    .eachPage(
		      (persons, fetchNextPage) => {
		        this.setState({
		          isFetching: false,
		          persons
		        });
		        fetchNextPage();
		      }
		    );
        } catch (e) {
            this.setState({...this.state, isFetching: false});
        }
    }

    handleChange(id, attended) {
        const session = this.state.session
        var array = []
        if (session.fields.Attended != null){
            array = session.fields.Attended
        }       
        var index = array.indexOf(id)
        if (index >= 0) {
            //yep - needs removing
            array.splice(index, 1)
        }
        else {
            //nope - needs adding
            array = array.concat(id)
        }
        session.fields.Attended = array
        this.setState({[session]: session})
        this.updateSession(session.id, array)
    }

    changeInputHandler = event => {
        this.inputValue = event.target.value
        this.setState({ newPerson: this.inputValue })
    };

    handleClick = event =>  {
        this.createPerson(this.inputValue)
        this.setState({ newPerson: '' })
        this.loadData()
    }    

    createPerson(personName) {
        base('Person').create({
          "Name": personName,

        }, function(err, record) {
          if (err) {
            console.error(err);
            return;
          }
        });
    }

	updateSession (sessionId, attended) {
		base('Session').update(sessionId, {
	    	Attended: attended
	    	}, function(err, record) {
	    	if (err) {
	      		console.error(err);
	      		return;
	    	}
	  	});
	  	
	}

}	