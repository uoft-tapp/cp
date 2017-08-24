/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import '../app-styles';

import React from 'react';
import ReactDOM from 'react-dom';

import { appState } from '../app/appState.js';
import { fetchAll } from '../app/fetch.js';

import { Navbar } from '../app/components/navbar.js';
import { ControlPanel } from '../app/components/controlPanel.js';

/*** Main app component ***/

class App extends React.Component {
    constructor(props) {
        super(props);

        // start fetching data
        fetchAll();
    }

    componentDidMount() {
        appState.subscribe(this.forceUpdate.bind(this, null));
    }

    render() {
        return <RouterInst appState={appState} />;
    }
}

/*** Router ***/
// temporary logout "view"
const Bye = props =>
    <div className="container-fluid" style={{ paddingTop: '70px' }}>
        <h1>Bye!</h1>
    </div>;

const RouterInst = props => {
    let role = props.appState.getCurrentUserRole();
    
    return (
        <div>
            <Navbar {...props} />

            {role == 'admin' && <ControlPanel navKey={routeConfig.admin.id} {...props} />}
            {role == 'hris' && null}
            {role == 'inst' && null}
            {role == 'student' && null}
	
            <div className="container-fluid" id="alert-container">
                {props.appState
                    .getAlerts()
                    .map(alert =>
                        <div
                            key={'alert-' + alert.get('id')}
                            className="alert alert-danger"
                            onClick={() => props.appState.dismissAlert(alert.get('id'))}
                            onAnimationEnd={() => props.appState.dismissAlert(alert.get('id'))}
                            dangerouslySetInnerHTML={{ __html: alert.get('text') }}
                        />
                    )}
            </div>
        </div>
    );

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
});
