import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class CommMenu extends React.Component {
    render() {
        let offers = this.props.appState.getOffersList();

        return (
            <DropdownButton bsStyle="primary" title="Communicate" id="comm-dropdown">
                <MenuItem
                    onClick={() =>
                        this.props.appState.email(
                            this.props.getSelected().map(offer => offers.get(offer).get('email'))
                        )}>
                    Email
                </MenuItem>

                <MenuItem onClick={() => null}>Nag</MenuItem>
            </DropdownButton>
        );
    }
}

export { CommMenu };
