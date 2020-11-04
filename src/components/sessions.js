import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../api';

const Sessions = () => {

    const [sessions, setSessions] = useState([]);
    const [passwordError, setPasswordError] = useState(false);
    const [joinPassword, setJoinPassword] = useState('');
    const history = useHistory();

    useEffect(() => {
        API.get('session')
            .then(res => {
                const sess = res.data.data.map(dat => {
                    dat.expanded = false;
                    return dat;
                });
                setSessions(sess);
            });
    }, []);

    const openSession = (sessionid, isprivate) => {
        setJoinPassword('');
        setPasswordError(false);
        if (isprivate) {
            const sess = sessions.map(session => {
                session.expanded = false;
                if (session._id === sessionid) {
                    session.expanded = true;
                }
                return session;
            });
            setSessions(sess);
        } else {
            history.push(`/session/${sessionid}`);
        }
    }

    const joinSession = (sessionid) => {
        history.push(`/join/${sessionid}`);
    }

    const continueToSession = (sessionid) => {
        if (joinPassword === '' || passwordError) {
            alert('Debe completar una password válida');
        } else {
            history.push(`/session/${sessionid}`);
        }
    }

    const joinPasswordCheck = (pwd, joinId) => {
        setJoinPassword(pwd);
        if (pwd === '') return;
        API.get(`session/${joinId}/password/${pwd}`)
            .then(res => {
                if (res.data.data.length > 0) {
                    setPasswordError(false);
                } else {
                    setPasswordError(true);
                }
            });
    }

    const cancelJoinSession = () => {
        setJoinPassword('');
        setPasswordError(false);
        const sess = sessions.map(sess => {
            sess.expanded = false;
            return sess;
        });
        setSessions(sess);
        setPasswordError(false);
        setJoinPassword(false);
    }

    return (
        <div className="row">
            <div className="col-xs-12 col-md-8 col-md-offset-2">
                <span className="session-private">
                    <strong className="hidden-xs">Private</strong>
                </span>
                <span className="session-list left">
                    <strong>Name</strong>
                </span>
                <span className="session-list center">
                    <strong>Members</strong>
                </span>
                <span className="session-list right">
                    <strong>Options</strong>
                </span>
                <div className="list-group">
                    {
                        sessions.map((session, index) =>
                            <div className="list-group-item slim" key={index}>
                                <div>
                                    <span className="session-private">
                                        {session.isprivate ? <span className="glyphicon glyphicon-lock"></span> : ''}
                                    </span>
                                    <span className="session-list left">
                                        <strong>{session.name}</strong>
                                    </span>
                                    <span className="session-list center">
                                        <strong>{session.members}</strong>
                                    </span>
                                    <span className="session-list right">
                                        <button type="button" className="btn btn-default" onClick={() => openSession(session._id, session.isprivate)}>Open</button>
                                        <button type="button" className="btn btn-default" onClick={() => joinSession(session._id)}>Join</button>
                                    </span>
                                </div>
                                {
                                    session.isprivate && session.expanded ?
                                        <div>
                                            <form className="form-inline">
                                                <div className={"form-group has-feedback" + (passwordError ? " has-error" : '')}>
                                                    <label htmlFor="topic">Password:</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        onChange={(e) => joinPasswordCheck(e.target.value, session._id)}
                                                        value={joinPassword}
                                                    />
                                                    {passwordError ? <span className="glyphicon glyphicon-remove form-control-feedback"></span> : ''}
                                                </div>
                                                <button type="button" className="btn btn-default" onClick={() => continueToSession(session._id)}>Continue</button>
                                                <button type="button" className="btn btn-default" onClick={() => cancelJoinSession()}>Cancel</button>
                                            </form>
                                        </div>
                                        : ''
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Sessions;
