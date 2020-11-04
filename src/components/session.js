import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import API from '../api';

const Session = () => {

    const host = window.location.protocol + '//' + window.location.host;
    const { idsession } = useParams();
    const [nameSession, setNameSession] = useState('');
    const [members, setMembers] = useState([]);
    const [votes, setVotes] = useState([]);
    const [teamComplete, setTeamComplete] = useState(false);
    const [consensus, setConsensus] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [pollDescription, setPollDescription] = useState('');
    const [pollTopic, setPollTopic] = useState('');
    const [statisticsView, setStatisticsView] = useState(false);
    const [averageAttemptsValue, setAverageAttemptsValue] = useState('');
    const [discussionTimeValue, setDiscussionTimeValue] = useState('');
    const [estimationProphetValue, setEstimationProphetValue] = useState('');
    const [estimationTimeValue, setEstimationTimeValue] = useState('');
    const [pollCountValue, setPollCountValue] = useState('');
    const [stopwatchElapsed, setStopwatchElapsed] = useState('00:00');
    const history = useHistory();

    const loadTeam = () => {
        API.get(`member/session/${idsession}`)
            .then(res => {
                setVotes(res.data.data);
            });
        setTeamComplete(true);
    }

    const startPoll = async (e) => {
        e.preventDefault();
        clearCounter();
        setFlipped(false);
        console.log('startPoll 1')
        await API.get(`poll/session/${idsession}`)
            .then(res => {
                console.log(res.data)
                const polls = res.data.data;
                polls.forEach(async poll => {
                    if (!poll.endtime) {
                        await API.delete(`poll/${poll.id}`)
                            .then(res => { });
                    }
                });
            });
        console.log('startPoll 2')
        await API.delete(`vote/session/${idsession}`)
            .then(res => { });
        if (!teamComplete) {
            alert('The team is not ready');
            return;
        }
        const poll = {
            idsession,
            topic: pollTopic,
            starttime: new Date(),
            endtime: null,
            result: null,
            consensus: null
        };
        API.post("poll", poll)
            .then(res => {
                if (res.data.data) {
                    stopElapsed = false;
                    setCounter();
                    initVotesFinished();
                };
            });
    }

    const initVotesFinished = () => {
        API.get(`vote/session/${idsession}`)
            .then(res => {
                let teamVotes = [];
                const votes = res.data.data;
                const countTeam = votes.length;
                let countTeamWithVote = 0;
                votes.forEach(vote => {
                    let data = {};
                    data.name = vote.name;
                    data.memberid = vote.memberid;
                    data.value = vote.value;
                    data.placed = false;
                    if (!!vote.value) {
                        data.placed = true;
                        countTeamWithVote++;
                    }
                    teamVotes.push(data);
                });
                setVotes(teamVotes);
                if (countTeamWithVote === countTeam) {
                    finishedVotes(teamVotes);
                } else {
                    setTimeout(initVotesFinished, 1000);
                }
            });
    }

    const finishedVotes = (team) => {
        stopElapsed = true;
        let teamVotes = [];
        let voteMin = 100;
        let voteMax = 0;
        let result = 0;
        let votesCount = 0;
        team.forEach(vote => {
            votesCount++;
            result += vote.value;
            if (vote.value < voteMin) voteMin = vote.value;
            if (vote.value > voteMax) voteMax = vote.value;
        });
        setConsensus(voteMin === voteMax);
        result = result / votesCount;
        team.forEach(vote => {
            let data = {};
            data.name = vote.name;
            data.memberid = vote.memberid;
            data.value = vote.value;
            data.placed = true;
            data.active = (vote.value === voteMin || vote.value === voteMax || false);
            teamVotes.push(data);
        });
        setVotes(teamVotes);
        finishedPolls(result, voteMin === voteMax);
        setFlipped(true);
    }

    const finishedPolls = async (result, votesConsensus) => {
        let idpoll;
        let topicPoll;
        let startPoll;
        await API.get(`poll/session/${idsession}`)
            .then(res => {
                res.data.data.forEach(poll => {
                    if (!poll.endtime) {
                        idpoll = poll.id;
                        topicPoll = poll.topic;
                        startPoll = poll.starttime;
                    }
                });
            });
        const poll = {
            idsession,
            topic: topicPoll,
            starttime: startPoll,
            endtime: new Date(),
            result: result,
            consensus: votesConsensus
        };
        API.put(`poll/${idpoll}`, poll)
            .then(res => {
                calculateStatistics();
            });
    }

    const calculateStatistics = () => {
        API.get(`poll/session/${idsession}`)
            .then(res => {
                const polls = res.data.data;
                let initialTime = new Date();
                let finalitationTime = new Date(1900, 1, 1);
                let starttime;
                let endtime;
                polls.forEach(poll => {
                    starttime = new Date(poll.starttime);
                    endtime = new Date(poll.endtime);
                    if (starttime < initialTime) initialTime = starttime;
                    if (endtime > finalitationTime) finalitationTime = endtime;
                });
                const totalMinutes = Math.ceil(Math.abs(endtime - starttime) / (1000 * 60));
                setStatisticsView(true);
                setAverageAttemptsValue('');
                setDiscussionTimeValue(totalMinutes);
                setEstimationProphetValue('');
                setEstimationTimeValue('');
                setPollCountValue(polls.length);
            });
    }

    const clearCounter = () => {
        count = 0;
    }

    let stopElapsed = true;
    const setCounter = () => {
        setStopwatchElapsed(counterStopwatchElapsed());
        if (!stopElapsed) setTimeout(setCounter, 1000);
    }

    let count = 0;
    const counterStopwatchElapsed = () => {
        count++;
        let seconds = ('0' + (count % 60));
        seconds = seconds.substr((seconds.length - 2), 2);
        let minutes = ('0' + Math.floor(count / 60));
        minutes = minutes.substr((minutes.length - 2), 2);
        //let hours = Math.floor(minutes / 60);
        //minutes %= 60;
        //hours %= 60;

        return minutes + ":" + seconds;
    }

    //const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

    const wipe = useCallback(async (redirect) => {
        await API.delete(`session/${idsession}`)
            .then(res => {
                if (!res.data.data && redirect) history.push('/');
            });
        //await waitFor(5000)
    }, [idsession, history]);

    const removeMember = (idmember) => {
        API.delete(`member/${idmember}`)
            .then(res => {
                if (!res.data.data) loadTeam();
            });
    }

    const loadMembers = useCallback(() => {
        console.log('teamComplete: ' + teamComplete)
        API.get(`member/session/${idsession}`)
            .then(res => {
                setMembers(res.data.data);
            });
        if (!teamComplete) setTimeout(loadMembers, 1000);
    }, [idsession, teamComplete]);

    useEffect(() => {
        if (!nameSession) {
            API.get(`session/${idsession}`)
                .then(res => {
                    console.log(res.data.data)
                    if (res.data.data) setNameSession(res.data.data.name);
                    else history.push('/');
                });
            loadMembers();
        }
        //window.addEventListener("beforeunload", wipe);
        //window.addEventListener("onremoved", wipe);
        //return () => window.removeEventListener("beforeunload", wipe);
    }, [idsession, nameSession, history, loadMembers, wipe]);

    return (
        <Fragment>
            {/* < !--Headline -- > */}
            <div className="row">
                <div className="col-xs-12 col-sm-1">
                    <button className="btn btn-lg btn-danger wipe" onClick={() => wipe(true)}>Wipe</button>
                </div>
                <div className="col-xs-10 col-sm-8 col-md-10">
                    <h1>{nameSession}</h1>
                </div>
                <div className="hidden-xs col-sm-2 col-md-1">
                    <h1>{stopwatchElapsed}</h1>
                </div>
            </div>

            {/* <!--Poll control-- > */}
            <div className="row topic">
                <div className="col-xs-12">
                    <div className="ticketing">
                        <form className="form-inline storysetter">
                            <div className="form-group">
                                <label htmlFor="topic">Story:</label>
                                <input type="text" className="form-control" value={pollTopic} onChange={(e) => setPollTopic(e.target.value)} placeholder="#4711 Create foo" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <input type="text" className="form-control" value={pollDescription} onChange={(e) => setPollDescription(e.target.value)} placeholder="The user can create an awesome foo" />
                            </div>
                            <button className="btn btn-default" onClick={(e) => startPoll(e)}>Start</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* <!--Live poll view and statistics-- > */}
            <div className="row">
                <div className="card-overview">
                    {
                        votes.map((vote, index) => {
                            return (
                                <div key={index} >
                                    <div className="card-container">
                                        <div className="deletable-card">
                                            <div className={"card-flip" + (flipped ? ' flipped' : '')}>
                                                <div className={"card front" + (vote.active ? ' active' : '')}>
                                                    {vote.placed ? <div className="inner"><span className="card-label">?</span></div> : ''}
                                                </div>
                                                <div className={"card back" + (vote.active ? ' active' : '') + (consensus ? ' confirmed' : '')}>
                                                    <div className="inner"><span className="card-label">{vote.value}</span></div>
                                                </div>
                                            </div>
                                            <div className="delete-member remove selectable" onClick={() => removeMember(vote.memberid)}>
                                                <span className="glyphicon glyphicon-remove"></span>
                                            </div>
                                        </div>
                                        <h2>{vote.name}</h2>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* <!--Invite and statistics-- > */}
            <div className="row">
                <div className="hidden-xs hidden-sm col-md-5">
                    <h2>Invite members</h2>
                    <p>Invite members to join your session. Session id: <strong>{idsession}</strong></p>
                    <img src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${host}/join/${idsession}&choe=UTF-8`}
                        alt={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${host}/join/${idsession}&choe=UTF-8`}
                        title={'Join ' + idsession}
                    />
                    <p>Or send them this link: <a href={`${host}/join/${idsession}`}>{host + '/join/' + idsession}</a></p>
                </div>

                {/* <!-- Team list and complete button --> */}
                {
                    !teamComplete ?
                        <div className="col-xs-12 col-md-5">
                            <h2>Team</h2>
                            <ul className="list-group">
                                {/* <!-- Iterate over votes as they represent members as well --> */}
                                {
                                    members.map((member, index) => {
                                        return <li key={index} className="list-group-item">{index + 1}. {member.name}</li>
                                    })
                                }
                            </ul>
                            <button className="btn btn-success" onClick={() => loadTeam()}>Team complete</button>
                        </div>
                        : ''
                }

                {/* <!-- Statistics column --> */}
                {
                    teamComplete ?
                        <div className="col-xs-12 col-md-7">
                            <div className="panel panel-default">
                                <div className="panel-heading">Statistics</div>
                                <div className="panel-body">
                                    {
                                        !statisticsView ?
                                            <p>Statistics will appear as soon as the first poll is concluded!</p>
                                            :
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>AverageAttempts</td>
                                                        <td><span>{averageAttemptsValue}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>DiscussionTime</td>
                                                        <td><span>{discussionTimeValue}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>EstimationProphet</td>
                                                        <td><span>{estimationProphetValue}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>EstimationTime</td>
                                                        <td><span>{estimationTimeValue}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>PollCount</td>
                                                        <td><span>{pollCountValue}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Toxantron/scrumonline/tree/master/src/controllers/statistics">
                                                                Want more?
                                                </a>
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                    }
                                </div>
                            </div>
                        </div>
                        : ''
                }
            </div>
        </Fragment >
    );
};

export default Session;