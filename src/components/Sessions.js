import React, { Component } from 'react';
import Airtable from 'airtable';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

const airTableKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const airTableBase = process.env.REACT_APP_AIRTABLE_BASE;
const base = new Airtable({ apiKey: airTableKey }).base(airTableBase);


class Sessions extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            sessions: []
        };
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                    	<h2>Sessions</h2>
                        <ListGroup>
                    		{this.state.sessions.map(session => <ListGroup.Item key={ session.id }><Link to={'/session/' + session.id }>{ session.fields.Name }</Link></ListGroup.Item> )}
                        </ListGroup>
                        <p>{this.state.isFetching ? 'Fetching sessions...' : ''}</p>
                    </Col>
                </Row>
            </Container>
        )
    }

    componentDidMount() {
        this.fetchSessions();
        //this.timer = setInterval(() => this.fetchSessions(), 5000);
    }

    componentWillUnmount() {
        //clearInterval(this.timer);
        //this.timer = null;
    }

    async fetchSessionsAsync() {
        try {
	    	this.setState({isFetching: true})
		    base('Session').select({view: 'Grid view'})
		    .eachPage(
		      (sessions, fetchNextPage) => {
		        this.setState({
		          isFetching: false,
		          sessions
		        });
		        fetchNextPage();
		      }
		    );
        } catch (e) {
            console.log(e);
            this.setState({...this.state, isFetching: false});
        }
    };

    fetchSessions = this.fetchSessionsAsync;

}

export default Sessions;