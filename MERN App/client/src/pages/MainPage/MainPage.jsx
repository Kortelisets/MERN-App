import React, { useState, useContext, useCallback} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';

import './MainPage.scss';

const MainPage = () => {
    const [text, setText] = useState('');
    const {userId} = useContext(AuthContext);
    const {todos, setTodos} = useState([]);

    const getTodo = useCallback(async() => {
        try {
            await axios.get('/api/todo', {
                headers: {
                    'Content-Type': 'application/json'
                }, 
                params: {userId}
            })
            .then((response) => setTodos(response.data))
        } catch (error) {
            console.log(error);
        }
    }, [userId, setTodos])

    const createTodo = useCallback(async () => {
        if(!text) return null;

        try {
            await axios.post('/api/todo/add', {text, userId}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setTodos([...todos], response.data)
                setText('')
                getTodo()
            });
        } catch (error) {
            console.log(error);
        } 
    }, [text, userId, todos, setTodos, getTodo]);


    const removeTodos = useCallback(async (id) => {
        try {
            await axios.delete(`/api/todo/delete/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(() => getTodo())
        } catch (error) {
            console.log(error)
        }
    }, [getTodo])

    
    const completedTodo = useCallback(async(id) => {
        try {
            await axios.put(`/api/todo/complete/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}, 
            })
            .then(response =>  {
                setTodos([...todos], response.data)
                getTodo()
            })
        } catch (error) {
            console.log(error);
        }
    }, [setTodos, todos, getTodo])

    const importantTodo = useCallback(async(id) => {
        try {
            await axios.put(`/api/todo/important/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}, 
            })
            .then(response =>  {
                setTodos([...todos], response.data)
                getTodo()
            })
        } catch (error) {
            console.log(error);
        }
    }, [setTodos, todos, getTodo])

    return (
        <div className='container'>
            <div className='main-page'>
                <h4>Add task</h4>
                <form className="form form-login" onSubmit={e => e.preventDefault()}>
                    <div className='row'>
                        <div className="input-field col s12">
                            <input
                                type="text"
                                id='text'
                                name="input"
                                className="validate"
                                value={text}
                                onChange={e => setText(e.target.value)}
                            />
                            <label htmlFor='input'>Task</label>
                        </div>
                    </div>
                    <div className="row">
                        <button 
                        className="wawes-effect wawes-light btn orange"
                        onClick={createTodo}
                        >Add</button>
                    </div>
                </form>

                <h4>Active Tasks:</h4>
                <div className="todos">
                    {
                        todos && todos.map((todo, index) => {
                            let cls = ['row flex todos-item']
                            if(todo.completed) {
                                cls.push('completed')
                            }
                            if(todo.important) {
                                cls.push('important')
                            }
                            
                            return (
                                <div className={cls.join(' ')} key={index}>
                                    <div className="col todos-num">{index+1}</div>
                                    <div className="col todos-text">{todo.text}</div>
                                    <div className="col todos-buttons">
                                        <i className="material-icons blue-text" onClick={() => completedTodo(todo._id)}>check</i>
                                        <i className="material-icons orange-text" onClick={() => importantTodo(todo._id)}>warning</i>
                                        <i className="material-icons red-text" onClick={() => removeTodos(todo._id)}>Delete</i>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default MainPage;
