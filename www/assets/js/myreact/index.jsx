
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

const objItem = {
	id: uid(),
	isDone: false,
	text: 'some default text.'
};

const listDummyTodos = List([objItem]);

// ##############################################################################
// REDUCER   - ( manages state updates )
const todoListReducer = function(todos = listDummyTodos, action) {
	//todos = (typeof todos!==undefined)?todos:listDummyTodos;
	switch(action.type) {
		case 'add': 
			var newItem = Map(objItem).merge({
				id: uid(), 
				text: action.text
			}).toObject();

			return todos.push(newItem); 

		default:
			return todos;
	}
}

const todoStore = createStore(todoListReducer);

// ################################################################################
// HTML COMPONENT

var XmlToDoList = React.createClass({
	_handleKeyDown: function (event){// handle ENTER KEY.....
		const isEnterKey = (event.which == 13);
		if(isEnterKey) {
			var val =  '' + event.target.value;		
			event.target.value = '';// reset

			// 1) update data
			todoStore.dispatch({type:'add', text: val });
		}
	},		
	render:function () {    
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
});

// ################################################################################
// SUBSCRIBE HTML COMPONENT TO STATE UPDATES

const ToDoListSubscriber = connect(
	// This is like assigning state to todos, as follows: <ToDoListSubscriber todos={state}/> 
  function mapStateToProps(state) {
    return { todos: state };
  }
)(XmlToDoList);


class App extends React.Component {
  render () {
    return (     
	    <Provider store={todoStore}>
    		<ToDoListSubscriber/> 
  		</Provider>
    );
  }
}

render(<App pagename="first component" />, document.getElementById('app'));

