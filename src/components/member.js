import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import API from '../api';

const Member = () => {

    const { idsession, idmember } = useParams();
    const [member, setMember] = useState({});
    const [cardSet, setCardSet] = useState([]);
    const history = useHistory();

    const loadCardSet = (nameCardSet) => {
        API.get(`cardset/${nameCardSet}`)
            .then(res => {
                const cards = res.data.data.map(card => {
                    card.active = false;
                    card.confirmed = false;
                    return card;
                });
                setCardSet(cards);
            });
    };

    const leave = useCallback((redirect) => {
        API.delete(`member/${idmember}`)
            .then(res => {
                if (redirect) history.push('/');
            });
    }, [idmember, history]);

    const selectCard = async (cardValue) => {
        console.log('selectCard')
        await API.patch(`member/${idmember}/delete/vote`)
            .then(res => { console.log(res) });
        console.log('pasa')
        API.get(`poll/session/${idsession}`)
            .then(res => {
                console.log('/poll/session /')
                if (!res.data.data) return;
                let go = false;
                const polls = res.data.data;
                polls.forEach(poll => {
                    if (!poll.endtime) go = true;
                });
                if (go) {
                    const cardsActive = cardSet.map(card => {
                        card.active = false;
                        card.confirmed = false;
                        if (card.value === cardValue) {
                            card.active = true;
                            card.confirmed = false;
                        }
                        return card;
                    });
                    setCardSet(cardsActive);
                    const vote = { idmember, value: cardValue };
                    API.post("vote", vote)
                        .then(res => {
                            console.log('vote')
                            if (res.data.data) {
                                const cardsConfirmed = cardSet.map(card => {
                                    card.active = false;
                                    card.confirmed = false;
                                    if (card.value === cardValue) {
                                        card.active = false;
                                        card.confirmed = true;
                                    }
                                    return card;
                                });
                                setCardSet(cardsConfirmed);
                                reloadCardSet();
                            }
                        });
                }
            });
    };

    const reloadCardSet = useCallback(() => {
        API.get(`poll/session/${idsession}`)
            .then(res => {
                let go = true;
                const polls = res.data.data;
                polls.forEach(poll => {
                    if (!poll.endtime) go = false;
                });
                if (go) {
                    const cardsDeactive = cardSet.map(card => {
                        card.active = false;
                        card.confirmed = false;
                        return card;
                    });
                    setCardSet(cardsDeactive);
                } else {
                    setTimeout(reloadCardSet, 1000);
                }
            });
    }, [idsession, cardSet]);

    useEffect(() => {
        if (cardSet.length === 0)
            API.get(`session/${idsession}`)
                .then(res => {
                    if (!res.data.data) history.push('/');
                    loadCardSet(res.data.data.cardset);
                });
        if (!member._id) {
            API.get(`member/${idmember}`)
                .then(res => {
                    if (!res.data.data) history.push('/');
                    setMember(res.data.data);
                });
        }
        //return () => { leave(false); }
    }, [idsession, idmember, cardSet, member, history, leave]);

    //window.onbeforeunload = leave(false);

    return (
        <Fragment>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <div className="row">
                        <a href="{{member.topicUrl}}" target="_blank">
                            <h2 className="col-xs-10">topic</h2>
                        </a>
                        <div className="col-xs-2">
                            <div className="leave remove selectable" onClick={() => leave(true)}>
                                <span className="glyphicon glyphicon-remove"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel-body white-space">
                    <div>{member.name}</div>
                </div>
            </div>
            <div className="row">
                {
                    cardSet.map((card, index) => {
                        return (
                            <div key={index} className="col-lg-2 col-md-3 col-xs-4">
                                <div className="card-container">
                                    <div onClick={() => selectCard(card.value)} className={"card selectable" + (card.active ? " active" : '') + (card.confirmed ? " confirmed" : '')}>
                                        <div className="inner">
                                            <span className="card-label">{card.value}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className="row">
                <h2 className="col-xs-12">How to:</h2>
                <p className="col-xs-12">
                    Votes can only be placed during an active poll.That means as long as the master has not started a poll or all votes have been placed, you can not vote!
                    When you select a card it is highlighted in red, meaning that you vote is processed by the server. If it was placed successfully the card is highlighted
                    green as feedback. Until everyone has placed their vote you can still change it. When the last person votes the poll is closed.
            </p>
            </div>
        </Fragment>
    );
};

export default Member;