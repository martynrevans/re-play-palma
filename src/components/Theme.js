import React, { Component } from 'react';
import Airtable from 'airtable';
import ListGroup from 'react-bootstrap/ListGroup';

const airTableKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const airTableBase = process.env.REACT_APP_AIRTABLE_BASE;
const base = new Airtable({ apiKey: airTableKey }).base(airTableBase);

class Theme extends Component {
	
	constructor(props) {
		super(props)
		this.state = { 
			theme: null
		}
	}

	async componentDidMount() {
		//fetch the theme data here
		await this.fetchTheme(this.props.themeId)
	}

	render () {
		const theme = this.state.theme
		if (theme == null) { return null }
		return <ListGroup.Item>{ theme.fields.Name }</ListGroup.Item>
	}


	async fetchTheme(Id) {
		var self = this;
		await base('Theme').find(Id, function(err, record) {
			if (err) { console.error(err); return; }
			self.setState({ theme: record })
			
		});
	}

}

export default Theme;