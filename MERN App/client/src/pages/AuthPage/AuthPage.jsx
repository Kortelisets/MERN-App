import React, { useState, useContext } from "react";
import { BrowserRouter, Switch, Route, Link, useHistory } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

import "./AuthPage.scss";

const AuthPage = () => {
    const history = useHistory();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const { login } = useContext(AuthContext);

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value});
        console.log(form);
    }

    const signinHandler = async () => {
        try {
            await axios.post('api/auth/signin', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            history.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    const loginHandler = async () => {
        try {
            await axios.post('api/auth/login', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                login(response.data.token, response.data.userId)
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <BrowserRouter>
            <Switch>
                <React.Fragment>
                    <div className='container'>
                        <div className='auth-page'>

                            <Route path="/login">
                                <h3>Авторизация</h3>
                                <form className=' form form-login' onSubmit={e => e.preventDefault()}>
                                    <div className='row'>
                                        <div className='input-field col s12'>
                                            <input type='text' name='email' className='validate' onChange={changeHandler} />
                                            <label htmlFor='email'>Email</label>
                                        </div>
                                        <div className='input-field col s12'>
                                            <input
                                                type='password'
                                                name='password'
                                                className='validate'
                                                onChange={changeHandler}
                                            />
                                            <label htmlFor='password'>Password</label>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <button className='wawes-effect wawes-light btn btn orange'
                                                onClick = {loginHandler}>
                                            
                                            Войти
                                        </button>
                                        <Link to='/signin' className='btn-outline btn-req'>
                                            Нет аккаунта?
                                        </Link>
                                    </div>
                                </form>
                            </Route>



                            <Route path="/signin">
                                <h3>Регистрация</h3>
                                <form className=' form form-login' onSubmit={e => e.preventDefault()}>
                                    <div className='row'>
                                        <div className='input-field col s12'>
                                            <input type='text' name='email' className='validate' onChange={changeHandler} />
                                            <label htmlFor='email'>Email</label>
                                        </div>
                                        <div className='input-field col s12'>
                                            <input
                                                type='password'
                                                name='password'
                                                className='validate'
                                                onChange={changeHandler}
                                            />
                                            <label htmlFor='password'>Password</label>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <button 
                                            className='wawes-effect wawes-light btn orange'
                                            onClick={signinHandler}
                                        >
                                            Регистрация
                                        </button>
                                        <Link to='/login' className='btn-outline btn-req'>
                                            Уже есть аккаунт?
                                        </Link>
                                    </div>
                                </form>
                            </Route>
                        </div>
                    </div>
                </React.Fragment>
            </Switch>
        </BrowserRouter>
    );
};

export default AuthPage;
