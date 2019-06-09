import React, { Component } from 'react';
import Airtable from 'airtable';
import { Link } from 'react-router-dom';

const airTableKey = process.env.REACT_APP_AIRTABLE_API_KEY;
const airTableBase = process.env.REACT_APP_AIRTABLE_BASE;
const base = new Airtable({ apiKey: airTableKey }).base(airTableBase);

class Persons extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            persons: []
        };
    }

    render() {
        return (
            <div>
            	<h2>Person</h2>
            	<ul>
            		{this.state.persons.map(person => 
            			<li key={ person.id }>
            				<input 
				        		type="checkbox" 
				        		defaultChecked={person.fields.Signed}
				        		onChange={() => this.handleChange(person.id)}
			        		/>
            				<Link to={'/person/' + person.id }>{ person.fields.Name }</Link>
            			</li> 

            		)}
                </ul>
                <p>{this.state.isFetching ? 'Fetching persons...' : ''}</p>
            </div>
        )
    }

    componentDidMount() {
        this.fetchPersons();
        //this.timer = setInterval(() => this.fetchPersons(), 5000);
    }

    componentWillUnmount() {
        //clearInterval(this.timer);
        //this.timer = null;
    }

    handleChange(id) {
  		this.setState(prevState => {
      		const updatedPersons = prevState.persons.map(person => {
          	if (person.id === id) {
              	person.fields.Signed = !person.fields.Signed;
              	this.updatePerson(id, person.fields.Signed);
          	}
          	return person
	      		})
	      	return {
	          persons: updatedPersons
	      	}
  		})
	}

    async fetchPersons() {
        try {
	    	this.setState({isFetching: true})
		    base('Person').select({
		    	view: 'Grid view',
		    	filterByFormula: 'SEARCH("Coach", {Roles})'

		    })
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
    };

	updatePerson (personId, personSigned) {

	  	base('Person').update(personId, {
	    	"Signed": personSigned
	    	}, function(err, record) {
	    	if (err) {
	      		console.error(err);
	      		return;
	    	}
	  	});
	}


}

export default Persons;