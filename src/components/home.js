import React, { Fragment } from 'react';
import CreateSessionPanel from '../subcomponents/createSessionPanel';
import JoinPanel from '../subcomponents/joinPanel';

const Home = () => {

    return (
        <Fragment>
            <div className="row">
                <article className="col-xs-12 col-lg-10 col-lg-offset-1">
                    <h2>Scrum Online</h2>
                    <p>
                        Welcome to my open source Planning Poker® web app. Use of this app is free of charge for everyone. As a scrum master just start a named session
                        and invite your team to join you. It is recommended to display the scrum master view on the big screen (TV or projector) and let everyone else
                        join via smartphone. To join a session just enter the id displayed in the heading of the scrum master view or use the QR-Code.
                    </p>
                    <p>
                        Developing, maintaining and hosting this application costs personal time and money. If you would like to support my efforts and help keep the
                        lights on, you can either donate through the button below or <a href="https://scrumpoker.online/sponsors">become an official sponsor</a>.
                    </p>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input type="hidden" name="hosted_button_id" value="ULK4XY7UZRZL8" />
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                        <img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1" />
                    </form>
                </article>
            </div>
            <div className="row">
                <h2 className="col-xs-12 col-lg-10 col-lg-offset-1">Create or join a session</h2>
                <div className="col-xs-12 col-sm-6 col-lg-5 col-lg-offset-1">
                    <CreateSessionPanel />
                </div>

                {/* <!-- Join session panel --> */}
                <div className="col-xs-12 col-sm-6 col-lg-5">
                    <JoinPanel />
                </div>
            </div>
        </Fragment >
    );
};

export default Home;
