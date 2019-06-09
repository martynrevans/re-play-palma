import React, { Component } from 'react';
import Airtable from 'airtable';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

import Theme from './Theme'

const airTableKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const airTableBase = process.env.REACT_APP_AIRTABLE_BASE;
const base = new Airtable({ apiKey: airTableKey }).base(airTableBase);

class Activity extends Component {
	
	constructor(props) {
		super(props)
		this.state = { 
			activity: null
		}
	}

	async componentDidMount() {
		//fetch the activity data here
		await this.fetchActivity(this.props.activityId)
	}

	render () {
		const activity = this.state.activity

		if (activity == null) {return null}
		const themes = (activity.fields.Themes) ? activity.fields.Themes : null
		const image = (activity.fields.Image) ? activity.fields.Image[0].url : null

		return <Accordion defaultActiveKey="0">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0">
	        		{ activity.fields.Name }
	      		</Accordion.Toggle>
	      		<Accordion.Collapse eventKey="0">
					<Card.Body>
						{ (image != null) ? <Card.Img variant="top" src={ image } /> : null}
						<Card.Text>{ activity.fields.Notes }</Card.Text>
					</Card.Body>
				</Accordion.Collapse>
			</Card>
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="1">
	        		Themes
	      		</Accordion.Toggle>
	      		<Accordion.Collapse eventKey="1">
		      		<ListGroup variant="flush">
						{(themes != null) ? activity.fields.Themes.map(themeId => <Theme key={ themeId } themeId={ themeId }></Theme>) : null }
					</ListGroup>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	}

	async fetchActivity(Id) {
		var self = this;
		await base('Activity').find(Id, function(err, record) {
			if (err) { console.error(err); return; }
			self.setState({ activity: record })
			
		});
	}

}

export default Activity;