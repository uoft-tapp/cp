import React from 'react';
import { Grid } from 'react-bootstrap';

import { TableMenu } from './tableMenu.js';
import { Table } from './table.js';

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

                style: { width: 0.1 },
            },
            {
                header: 'Email',
                data: p => p.get('email'),
                sortData: p => p.get('email'),

                style: { width: 0.2 },
            },
            {
                header: 'Student Number',
                data: p => p.get('student_number'),
                sortData: p => p.get('student_number'),

                style: { width: 0.08 },
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

                style: { width: 0.15 },
            },
            {
                header: 'Hours',
                data: p => p.getIn(['contract_details', 'hours']),
                sortData: p => p.getIn(['contract_details', 'hours']),

                style: { width: 0.04 },
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

                style: { width: 0.07 },
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

                style: { width: 0.07 },
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
