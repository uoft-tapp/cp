import React from 'react';
import { fromJS } from 'immutable';

import * as fetch from './fetch.js';

const initialState = {
    role: 'admin', // one of { 'admin', 'inst', 'student' }
    user: 'user',

    // navbar component
    nav: {
        selectedTab: null,

        // list of unread notifications (string can contain HTML, but be careful because it is not sanitized!)
        notifications: [],
    },

    // list of UI alerts (string can contain HTML, but be careful because it is not sanitized!)
    alerts: [],

    // admin view
    adminView: {
        // will be populated with selected sort and filter fields
        selectedSortFields: [],
        selectedFilters: {},
    },

    /** DB data **/
    offers: { fetching: 0, list: null },

    importing: 0,
};

class AppState {
    constructor() {
        // container for application state
        var _data = fromJS(initialState);

        // list of change listeners
        this._listeners = [];
        // notify listeners of change
        var notifyListeners = () => this._listeners.forEach(listener => listener());

        // parses a property path into a list, as expected by Immutable
        var parsePath = path =>
            path
                .split(/(\[.*?\])|\./) // split on brackets and dots
                .filter(key => key) // removed undefined elements
                .map(key => {
                    let ind = key.match(/\[(.*)\]/); // check whether the element is in brackets
                    if (ind) {
                        return eval(ind[1]);
                    }
                    return key;
                });

        // getter for appState object
        this.get = function(property) {
            return _data.getIn(parsePath(property));
        };

        // setter for appState object
        this.set = function(property, value) {
            // as per the Backbone Model set() syntax, we accept a property and value pair, or
            // an object with property and value pairs as keys
            if (arguments.length == 1) {
                _data = _data.withMutations(map => {
                    Object.entries(property).reduce(
                        (result, [prop, val]) => result.setIn(parsePath(prop), val),
                        map
                    );
                });
            } else {
                _data = _data.setIn(parsePath(property), value);
            }

            // notify listener(s) of change
            notifyListeners();
        };
    }

    // subscribe listener to change events on this model
    subscribe(listener) {
        this._listeners.push(listener);
    }

    /************************************
     ** view state getters and setters **
     ************************************/

    // apply a sort to the offers table
    // note that we do not allow multiple sorts on the same field (incl. in different directions)
    addSort(field) {
        let sorts = this.get('adminView.selectedSortFields');

        if (!sorts.some(val => val.get(0) == field)) {
            this.set('adminView.selectedSortFields', sorts.push(fromJS([field, 1])));
        } else {
            this.alert('<b>Applicant Table</b>&ensp;Cannot apply the same sort more than once.');
        }
    }

    // add an alert to the list of active alerts
    alert(text) {
        let alerts = this.get('alerts');
        // give it an id that is 1 larger than the largest id in the array, or 0 if the array is empty
        this.set(
            'alerts',
            alerts.unshift(
                fromJS({
                    id: alerts.size > 0 ? alerts.last().get('id') + 1 : 0,
                    text: text,
                })
            )
        );
    }

    // check whether any of the given filters in the category are selected on the offers table
    anyFilterSelected(field) {
        return this.get('adminView.selectedFilters').has(field);
    }

    // remove all selected filters on the offers table
    clearFilters() {
        this.set('adminView.selectedFilters', fromJS({}));
    }

    dismissAlert(id) {
        let alerts = this.get('alerts');
        let i = alerts.findIndex(alert => alert.get('id') == id);

        if (i != -1) {
            this.set('alerts', alerts.delete(i));
        }
    }

    getAlerts() {
        return this.get('alerts');
    }

    getCurrentUserName() {
        return this.get('user');
    }

    getCurrentUserRole() {
        return this.get('role');
    }

    getFilters() {
        return this.get('adminView.selectedFilters');
    }

    getSelectedNavTab() {
        return this.get('nav.selectedTab');
    }

    getSorts() {
        return this.get('adminView.selectedSortFields');
    }

    getUnreadNotifications() {
        return this.get('nav.notifications');
    }

    // check whether a filter is selected on the offers table
    isFilterSelected(field, category) {
        let filters = this.get('adminView.selectedFilters');

        return filters.has(field) && filters.get(field).includes(category);
    }

    // add a notification to the list of unread notifications
    notify(text) {
        let notifications = this.get('nav.notifications');
        this.set('nav.notifications', notifications.push(text));
    }

    // clear the list of unread notifications
    readNotifications() {
        this.set('nav.notifications', fromJS([]));
    }

    // remove a sort from the offers table
    removeSort(field) {
        let sorts = this.get('adminView.selectedSortFields');
        let i = sorts.findIndex(f => f.get(0) == field);

        this.set('adminView.selectedSortFields', sorts.delete(i));
    }

    // select a navbar tab
    selectNavTab(eventKey) {
        this.set('nav.selectedTab', eventKey);
    }

    setCurrentUserName(user) {
        return this.set('user', user);
    }

    setCurrentUserRole(role) {
        return this.set('role', role);
    }

    // toggle a filter on the offers table
    toggleFilter(field, category) {
        let filters = this.get('adminView.selectedFilters');

        if (filters.has(field)) {
            let filter = filters.get(field);
            let i = filter.indexOf(category);

            if (i == -1) {
                // filter on this category is not already applied
                this.set('adminView.selectedFilters[' + field + ']', filter.push(category));
            } else if (filter.size > 1) {
                // filter on this category is already applied, along with other categories
                this.set('adminView.selectedFilters[' + field + ']', filter.delete(i));
            } else {
                // filter is only applied on this category
                this.set('adminView.selectedFilters', filters.remove(field));
            }
        } else {
            this.set('adminView.selectedFilters[' + field + ']', fromJS([category]));
        }
    }

    // toggle the sort direction of the sort currently applied to the offers table
    toggleSortDir(field) {
        let sortFields = this.get('adminView.selectedSortFields');
        let i = sortFields.findIndex(f => f.get(0) == field);

        if (i != -1) {
            this.set('adminView.selectedSortFields[' + i + '][1]', -sortFields.get(i).get(1));
        }
    }

    /******************************
     ** data getters and setters **
     ******************************/

    // check if offers are being fetched
    fetchingOffers() {
        return this.get('offers.fetching') > 0;
    }

    getOffersList() {
        return this.get('offers.list');
    }

    // get a sorted list of the positions in the current offers list as a JS array
    getPositions() {
        let offers = this.getOffersList();
        
        if (offers) {
            return offers
                .map(offer => offer.get('contract_details').get('position'))
                .flip()
                .keySeq()
                .toJS();
        }
        return [];
    }

    importAssignments() {
        fetch.importAssignments();
    }
    
    importOffers(data) {
        fetch.importOffers(data);
    }

    importing() {
        return this.get('importing') > 0;
    }

    isOffersListNull() {
        return this.get('offers.list') == null;
    }

    setFetchingOffersList(fetching, success) {
        let init = this.get('offers.fetching'),
            notifications = this.get('nav.notifications');
        if (fetching) {
            this.set({
                'offers.fetching': init + 1,
                'nav.notifications': notifications.push('<i>Fetching offers...</i>'),
            });
        } else if (success) {
            this.set({
                'offers.fetching': init - 1,
                'nav.notifications': notifications.push('Successfully fetched offers.'),
            });
        } else {
            this.set('offers.fetching', init - 1);
        }
    }

    setImporting(importing, success) {
        let init = this.get('importing'),
            notifications = this.get('nav.notifications');
        if (importing) {
            this.set({
                importing: init + 1,
                'nav.notifications': notifications.push('<i>Import in progress...</i>'),
            });
        } else if (success) {
            this.set({
                importing: init - 1,
                'nav.notifications': notifications.push('Import completed successfully.'),
            });
        } else {
            this.set('importing', init - 1);
        }
    }

    setOffersList(list) {
        this.set('offers.list', list);
    }
}

let appState = new AppState();
export { appState };
