import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class OffersMenu extends React.Component {
    render() {
        return (
            <DropdownButton bsStyle="primary" title="Update offers" id="offers-dropdown">
                <MenuItem
                    onClick={() => null}>
                    Send contract(s)
                </MenuItem>

                <MenuItem
                    onClick={() => null}>
                    Withdraw offer(s)
                </MenuItem>
            
                <MenuItem
                    onClick={() => null}>
                    Set DDAH processed
                </MenuItem>

                <MenuItem
                    onClick={() => null}>
                    Set HR processed
                </MenuItem>
            </DropdownButton>
        );        
    }
}

export { OffersMenu };
