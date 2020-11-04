import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../api';

const CreateSessionPanel = () => {

    const [sessionName, setSessionName] = useState('');
    const [sessionNameError, setSessionNameError] = useState(false);
    let [selectedSet, setSelectedSet] = useState('');
    const [sessionIsPrivate, setSessionIsPrivate] = useState(false);
    const [sessionPassword, setSessionPassword] = useState('');
    const [sessionPasswordError, setSessionPasswordError] = useState(false);
    const [cardSets, setCardSets] = useState([]);
    const history = useHistory();

    useEffect(() => {
        API.get('cardset')
            .then(res => {
                setCardSets(res.data.data);
                setSelectedSet(res.data.data[0].name);
            });
    }, []);

    const createSessionCheck = (e) => {
        setSessionName(e.target.value);
        if (e.target.value !== '') {
            API.get(`session/name/${e.target.value}`)
                .then(res => {
                    if (res.data.data.length > 0) {
                        setSessionNameError(true);
                    } else {
                        setSessionNameError(false);
                    }
                });
        } else {
            setSessionNameError(false);
        }
    }

    const sessionIsPrivateCheck = (e) => {
        setSessionIsPrivate(e.target.checked);
        setSessionPassword('');
    }

    const sessionPasswordCheck = (e) => {
        setSessionPassword(e.target.value);
        if (e.target.value.length <= 3) {
            setSessionPasswordError(true);
        } else {
            setSessionPasswordError(false);
        }
    }

    const validateCreateSession = () => {
        if (sessionName === '' || sessionNameError) {
            alert('Debe completar el nombre de la sesión');
            return false;
        }
        if (sessionIsPrivate && (sessionPassword === '' || sessionPasswordError)) {
            alert('Si la sesión es privada debe completar un password válido');
            return false;
        }
        return true;
    }

    const createSession = (e) => {
        if (!validateCreateSession()) {
            return;
        }
        const data = {
            name: sessionName,
            cardset: selectedSet,
            isprivate: sessionIsPrivate,
            password: sessionPassword
        };
        API.post('session/', data)
            .then(async res => {
                if (res.data.data) {
                    history.push(`/session/${res.data.data._id}`);
                }
            });
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">Create session</div>
            <div className="panel-body">
                <form>
                    <div className={'form-group' + (sessionNameError ? ' has-error' : '')}>
                        <label htmlFor="sessionName">Session name:</label>
                        <div className="has-feedback">
                            <input type="text" className="form-control" name="idsession" onChange={(e) => createSessionCheck(e)} placeholder="My session" />
                            {sessionNameError ? <span className="glyphicon glyphicon-remove form-control-feedback"></span> : ''}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Cards:</label>
                        <div className="dropdown">
                            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                                <span>{selectedSet}</span>
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu">
                                {
                                    cardSets.map((cardSet, index) =>
                                        <li key={index} className={cardSet.name === selectedSet ? 'active' : ''}>
                                            <a href="/#" className="selectable" onClick={() => setSelectedSet(cardSet.name)}>
                                                {
                                                    cardSet.cards.map((card, index) => {
                                                        return (index !== 0 ? ',' : '') + card
                                                    })
                                                }
                                            </a>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="isprivate" onClick={(e) => sessionIsPrivateCheck(e)} /> is private
                                    </label>
                    </div>
                    {
                        sessionIsPrivate ?
                            <div className={'form-group' + (sessionPasswordError ? ' has-error' : '')}>
                                <label htmlFor="password">Password:</label>
                                <div className="has-feedback">
                                    <input type="password" className="form-control" name="password" onChange={(e) => sessionPasswordCheck(e)} />
                                    {
                                        sessionPasswordError ?
                                            <span className="glyphicon glyphicon-remove form-control-feedback"></span>
                                            : ''
                                    }
                                </div>
                            </div>
                            : ''
                    }
                    <input type="button" value="Create" className="btn btn-default" onClick={(e) => createSession(e)} />
                </form>
            </div>
        </div>
    );
};

export default CreateSessionPanel;
