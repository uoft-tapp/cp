import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class CommMenu extends React.Component {
    render() {
        return (
            <DropdownButton bsStyle="primary" title="Communicate" id="comm-dropdown">
                <MenuItem
                    onClick={() => null}>
                    Email
                </MenuItem>

                <MenuItem
                    onClick={() => null}>
                    Nag
                </MenuItem>
            </DropdownButton>
        );        
    }
}

export { CommMenu };
