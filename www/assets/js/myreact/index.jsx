
require('../../sass/main.scss');

// essential for hot module replacement! ie, when re-saving jsx file, the webpage doesn't refresh, but the component does update!
if (module.hot){
  module.hot.accept();
}

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux'; // https://egghead.io/lessons/javascript-redux-passing-the-store-down-with-provider-from-react-redux
import { List, Map } from 'immutable';


// ##############################################################################
// INITIAL DATA ( using immutable.js to initiate)
const uid = function(){ return Math.random().toString(34).slice(2)}; // hack to create a passable unique id
var objEach = {
	id: uid(),
	isDone: false,
	text: 'some default text.'
};
const listDummyTodos = List([objEach]);

// ##############################################################################
// REDUCER 
const todoListReducer = function(todos = listDummyTodos, action) {
	//todos = (typeof todos!==undefined)?todos:listDummyTodos;
	switch(action.type) {
		case 'add':    	     
			var objNew = Map(objEach);
			objNew.text = action.text;	
			objNew.id = uid();
			return todos.push(objNew); 

		default:
			return todos;
	}
}
const store = createStore(todoListReducer);


// ################################################################################
// HTML COMPONENT
class ToDoList extends React.Component { 
	constructor() {
		super();
		this._handleKeyDown = this._handleKeyDown.bind(this);
	}

	_handleKeyDown (event){// handle ENTER KEY.....
		const isEnterKey = (event.which == 13);
		if(isEnterKey) {
			var val =  '' + event.target.value;		
			event.target.value = '';// reset
			store.dispatch({type:'add', text: val });
		}
	} 		
	render () {    
		return (
			<div className='todo'>
				<input type='text'
				className='todo__entry'
				placeholder='Add todo'
				onKeyDown={this._handleKeyDown} />

				<ul className='todoList'>
					{this.props.todos.map(k => (
						<li key={k.id} className='todoItem'>                
							{k.isDone ? <strike>{k.text}</strike>: <span>{k.text}</span>}    			
						</li>
					))}
				</ul>
			</div>
    	)
  	}
 	
}

// connect state to props 
const TodoListConnectingStateUpdates = connect(
  function mapStateToProps(state) {
    return { todos: state };
  }
)(ToDoList);


class App extends React.Component {
  render () {
    return (     
	    <Provider store={store}>
    		<TodoListConnectingStateUpdates/> 
  		</Provider>
    );
  }
}

render(<App pagename="first component" />, document.getElementById('app'));

