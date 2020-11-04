import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import API from '../api';

const JoinPanel = () => {

    const { idsession } = useParams();
    const [joinId, setJoinId] = useState('');
    const [joinIdError, setJoinIdError] = useState(false);
    const [joinName, setJoinName] = useState('');
    const [joinNameError, setJoinNameError] = useState(false);
    const [joinRequiresPassword, setJoinRequiresPassword] = useState(false);
    const [joinPassword, setJoinPassword] = useState(false);
    const [joinPasswordError, setJoinPasswordError] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (idsession) {
            setJoinId(idsession);
            joinSessionCheck(idsession);
        }
    }, [idsession]);

    const joinSessionCheck = (id) => {
        setJoinId(id);
        if (id === '') {
            setJoinRequiresPassword(false);
        } else {
            API.get(`session/${id}`)
                .then(res => {
                    if (res.data.data) {
                        setJoinIdError(false);
                        setJoinRequiresPassword(res.data.data.isprivate);
                    } else {
                        setJoinIdError(true);
                        setJoinRequiresPassword(false);
                    }
                });
        }
    }

    const joinNameCheck = (name) => {
        setJoinName(name);
        if (joinId === '') {
            alert('Tenés que elegir una sesión primero');
            setJoinName('');
            return;
        }
        if (name !== '') {
            API.get(`member/session/${joinId}/name/${name}`)
                .then(res => {
                    if (res.data.data.length > 0) {
                        setJoinNameError(true);
                    } else {
                        setJoinNameError(false);
                    }
                });
        } else {
            setJoinNameError(false);
        }
    }

    const joinPasswordCheck = (pwd) => {
        setJoinPassword(pwd);
        if (pwd === '') return;
        console.log(pwd)
        API.get(`session/${joinId}/password/${pwd}`)
            .then(res => {
                console.log(res.data)
                if (res.data.data.length > 0) {
                    setJoinPasswordError(false);
                } else {
                    setJoinPasswordError(true);
                }
            });
    }

    const validateJoinSession = () => {
        if (joinId === '' || joinIdError) {
            alert('Debe completar el id de una sesión válida');
            return false;
        }
        if (joinName === '' || joinNameError) {
            alert('Debe completar un nombre válido');
            return false;
        }
        if (joinRequiresPassword && (joinPassword === '' || joinPasswordError)) {
            alert('Si la sesión es privada debe completar un password válido');
            return false;
        }
        return true;
    }

    const joinSession = (e) => {
        if (!validateJoinSession()) {
            return;
        }
        const data = {
            id: Math.random().toString(20).substr(2, 18),
            idsession: joinId,
            name: joinName
        };
        API.post('member/', data)
            .then(res => {
                history.push(`/member/${res.data.data.idsession}/${res.data.data._id}`);
            });
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">Join session</div>
            <div className="panel-body">
                <form>
                    <div className={'form-group' + (joinIdError ? ' has-error' : '')}>
                        <label>Session id:</label>
                        <div className="has-feedback">
                            <input type="text"
                                className="form-control"
                                name="idsession"
                                onChange={(e) => joinSessionCheck(e.target.value)}
                                placeholder="4711"
                                value={joinId}
                            />
                            {
                                joinIdError ?
                                    <span className="glyphicon glyphicon-remove form-control-feedback"></span>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className={'form-group' + (joinNameError ? ' has-error' : '')}>
                        <label>Your name:</label>
                        <div className="has-feedback">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="John"
                                onChange={(e) => joinNameCheck(e.target.value)}
                                value={joinName}
                            />
                            {joinNameError ? <span className="glyphicon glyphicon-remove form-control-feedback"></span> : ''}
                        </div>
                    </div>
                    {
                        joinRequiresPassword ?
                            <div className={'form-group' + (joinPasswordError ? ' has-error' : '')}>
                                <label>Password:</label>
                                <div className="has-feedback">
                                    <input type="password" className="form-control" name="joinPassword" onChange={(e) => joinPasswordCheck(e.target.value)} />
                                    {joinPasswordError ? <span className="glyphicon glyphicon-remove form-control-feedback"></span> : ''}
                                </div>
                            </div>
                            : ''
                    }
                    <input type="button" className="btn btn-default" value="Join" onClick={(e) => joinSession(e)} />
                </form>
            </div>
        </div>
    );
};

export default JoinPanel;
