import React from 'react';
import { fromJS } from 'immutable';
import { appState } from './appState.js';

/* General helpers */

function defaultFailure(response) {
    appState.notify('<b>Action Failed:</b> ' + response.statusText);
    return Promise.reject(response);
}

function fetchHelper(URL, init, success, failure = defaultFailure) {
    return fetch(URL, init)
        .then(function(response) {
            if (response.ok) {
                // parse the body of the response as JSON
                if (['GET', 'POST'].includes(init.method)) {
                    return response.json().then(resp => success(resp));
                }

                return success(response);
            }

            return failure(response);
        })
        .catch(function(error) {
            appState.notify('<b>Error:</b> ' + URL + ' ' + error.message);
            return Promise.reject(error);
        });
}

function getHelper(URL, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
    };

    return fetchHelper(URL, init, success, failure);
}

function postHelper(URL, body, success, failure) {
    let init = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

function deleteHelper(URL, success, failure) {
    return fetchHelper(URL, { method: 'DELETE' }, success, failure);
}

function putHelper(URL, body, success, failure) {
    let init = {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(body),
    };

    return fetchHelper(URL, init, success, failure);
}

/* Resource GETters */

const getOffers = () => getHelper('/offers', onFetchOffersSuccess);

/* Success callbacks for resource GETters */

function onFetchOffersSuccess(resp) {
    let offers = {};

    resp.forEach(offer => {
        offers[offer.id] = {
            applicant_id: offer.applicant_id,
            first_name: offer.applicant.first_name,
            last_name: offer.applicant.last_name,
            student_number: offer.applicant.student_number,
            email: offer.applicant.email,
            contract_details: {
                position: offer.position,
                sessional_year: offer.session.year,
                sessional_semester: offer.session.semester,
                hours: offer.hours,
                start_date: offer.session.start_date,
                end_date: offer.session.end_date,
                pay: offer.session.pay,
                link: offer.link,
                signature: offer.signature,
            },
            contract_statuses: {
                nag_count: offer.nag_count,
                status: offer.status,
                hr_status: offer.hr_status,
                ddah_status: offer.ddah_status,
                sent_at: offer.send_date,
                printed_at: offer.print_time,
            },
        };
    });

    return offers;
}

/* Function to GET all resources */

function fetchAll() {
    appState.setFetchingOffersList(true);

    let offersPromise = getOffers();

    // when offers are successfully fetched, update the offers list; set fetching flag to false either way
    offersPromise
        .then(offers => {
            appState.setOffersList(fromJS(offers));
            appState.setFetchingOffersList(false, true);
        })
        .catch(() => appState.setFetchingOffersList(false));
}

export { fetchAll };
