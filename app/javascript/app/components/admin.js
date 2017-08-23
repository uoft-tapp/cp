import React from 'react';
import { Grid, ButtonToolbar, Button } from 'react-bootstrap';

import { TableMenu } from './tableMenu.js';
import { Table } from './table.js';
import { ImportMenu } from './importMenu.js';
import { OffersMenu } from './offersMenu.js';
import { CommMenu } from './commMenu.js';

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.config = [
            {
                header: '',
                data: p => <input type="checkbox" defaultChecked={false} />,

                style: { width: 0.02, textAlign: 'center' },
            },
            {
                header: 'Last Name',
                data: p => p.get('last_name'),
                sortData: p => p.get('last_name'),

                style: { width: 0.1 },
            },
            {
                header: 'First Name',
                data: p => p.get('first_name'),
                sortData: p => p.get('first_name'),

                style: { width: 0.08 },
            },
            {
                header: 'Email',
                data: p => p.get('email'),
                sortData: p => p.get('email'),

                style: { width: 0.12 },
            },
            {
                header: 'Student Number',
                data: p => p.get('student_number'),
                sortData: p => p.get('student_number'),

                style: { width: 0.06 },
            },
            {
                header: 'Position',
                data: p => p.getIn(['contract_details', 'position']),
                sortData: p => p.getIn(['contract_details', 'position']),

                filterLabel: 'Position',
                filterCategories: [], //props.appState.getPositions(),
                // filter out offers not to that position
                filterFuncs: [] /*props.appState.getPositions().map(
                    position => p.getIn(['contract_details','position']) == position
                ),*/,

                style: { width: 0.1 },
            },
            {
                header: 'Hours',
                data: p => p.getIn(['contract_details', 'hours']),
                sortData: p => p.getIn(['contract_details', 'hours']),

                style: { width: 0.03 },
            },
            {
                header: 'Status',
                data: p => p.getIn(['contract_statuses', 'status']),
                sortData: p => p.getIn(['contract_statuses', 'status']),

                filterLabel: 'Status',
                filterCategories: ['Unsent', 'Pending', 'Accepted', 'Rejected', 'Withdrawn'],
                filterFuncs: [
                    'Unsent',
                    'Pending',
                    'Accepted',
                    'Rejected',
                    'Withdrawn',
                ].map(status => p => p.getIn(['contract_statuses', 'status']) == status),

                style: { width: 0.04 },
            },
            {
                header: 'Contract Send Date',
                data: p =>
                    p.getIn(['contract_statuses', 'sent_at'])
                        ? new Date(p.getIn(['contract_statuses', 'sent_at'])).toLocaleString()
                        : '',
                sortData: p => p.getIn(['contract_statuses', 'sent_at']),

                style: { width: 0.07 },
            },
            {
                header: 'Nag Count',
                data: p =>
                    p.getIn(['contract_statuses', 'nag_count'])
                        ? p.getIn(['contract_statuses', 'nag_count'])
                        : '',
                sortData: p => p.getIn(['contract_statuses', 'nag_count']),

                style: { width: 0.04 },
            },
            {
                header: 'HRIS Status',
                data: p =>
                    p.getIn(['contract_statuses', 'hr_status']) == undefined
                        ? '-'
                        : p.getIn(['contract_statuses', 'hr_status']),
                sortData: p =>
                    p.getIn(['contract_statuses', 'hr_status']) == undefined
                        ? ''
                        : p.getIn(['contract_statuses', 'hr_status']),

                filterLabel: 'HRIS Status',
                filterCategories: ['-', 'Processed', 'Printed'],
                filterFuncs: [p => p.getIn(['contract_statuses', 'hr_status']) == undefined].concat(
                    ['Processed', 'Printed'].map(status => p =>
                        p.getIn(['contract_statuses', 'hr_status']) == status
                    )
                ),

                style: { width: 0.04 },
            },
            {
                header: 'Printed Date',
                data: p =>
                    p.getIn(['contract_statuses', 'printed_at'])
                        ? new Date(p.getIn(['contract_statuses', 'printed_at'])).toLocaleString()
                        : '',
                sortData: p => p.getIn(['contract_statuses', 'printed_at']),

                style: { width: 0.07 },
            },
            {
                header: 'DDAH Status',
                data: p =>
                    p.getIn(['contract_statuses', 'ddah_status']) == undefined
                        ? '-'
                        : p.getIn(['contract_statuses', 'ddah_status']),
                sortData: p =>
                    p.getIn(['contract_statuses', 'ddah_status']) == undefined
                        ? ''
                        : p.getIn(['contract_statuses', 'ddah_status']),

                filterLabel: 'DDAH Status',
                filterCategories: ['-', 'Accepted', 'Pending', 'Signed'],
                filterFuncs: [
                    p => p.getIn(['contract_statuses', 'ddah_status']) == undefined,
                ].concat(
                    ['Accepted', 'Pending', 'Signed'].map(status => p =>
                        p.getIn(['contract_statuses', 'ddah_status']) == status
                    )
                ),

                style: { width: 0.05 },
            },
        ];
    }

    render() {
        let nullCheck = this.props.appState.isOffersListNull();
        if (nullCheck) {
            return <div id="loader" />;
        }

        let fetchCheck = this.props.appState.fetchingOffers();
        let cursorStyle = { cursor: fetchCheck ? 'progress' : 'auto' };

        return (
            <Grid fluid id="offers-grid">
                <ButtonToolbar id="dropdown-menu">
                    <ImportMenu {...this.props} />
                    <OffersMenu {...this.props} />
                    <CommMenu {...this.props} />
                    <Button bsStyle="primary">Print contracts</Button>
                </ButtonToolbar>

                <TableMenu
                    config={this.config}
                    getSelectedSortFields={() => this.props.appState.getSorts()}
                    anyFilterSelected={field => this.props.appState.anyFilterSelected(field)}
                    isFilterSelected={(field, category) =>
                        this.props.appState.isFilterSelected(field, category)}
                    toggleFilter={(field, category) =>
                        this.props.appState.toggleFilter(field, category)}
                    clearFilters={() => this.props.appState.clearFilters()}
                    addSort={field => this.props.appState.addSort(field)}
                    removeSort={field => this.props.appState.removeSort(field)}
                    toggleSortDir={field => this.props.appState.toggleSortDir(field)}
                />

                <Table
                    config={this.config}
                    getOffers={() => this.props.appState.getOffersList()}
                    getSelectedSortFields={() => this.props.appState.getSorts()}
                    getSelectedFilters={() => this.props.appState.getFilters()}
                />
            </Grid>
        );
    }

    selectThisTab() {
        if (this.props.appState.getSelectedNavTab() != this.props.navKey) {
            this.props.appState.selectNavTab(this.props.navKey);
        }
    }

    componentWillMount() {
        this.selectThisTab();
    }

    componentWillUpdate() {
        this.selectThisTab();
    }
}

export { Admin };
