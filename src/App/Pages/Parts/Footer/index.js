import React from 'react';
import {Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Event, BRAND} from "../../../../Helper";

export default class Footer extends React.Component {
    
   help = () => {
        Event.emit('show_help');
    }

    verify = () => {
        Event.emit('show_verify');
    }

    render(){
        return(
            <>
                <footer className="bgame-footer font-light bg-footer dtw">
                    <div className="links">
                        <Link to="/">Home</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">User Agreement</Link>
                        {/* <Link to="/affiliate">Affiliate</Link> */}
                        <Link to="#" onClick={this.verify}>Verify Result</Link>
                        <Link to="#" onClick={this.help}>Help</Link>
                    </div>
                    <Row>
                        <Col sm={12} md={12} className="text-center">
                            <span className="ml-5 my-2 d-block text-upper">{BRAND} - All rights reserved</span>
                        </Col>
                    </Row>
                </footer>
            </>
        );
    }
}