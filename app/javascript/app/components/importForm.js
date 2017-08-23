import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, ButtonToolbar, Button } from 'react-bootstrap';

// form for importing data from a file and persisting it to the database
class ImportForm extends React.Component {
    uploadFile() {
        let fileInput = document.getElementById('file-input');
        let files = fileInput.files;

        if (files.length > 0) {
            // uploading a CHASS offers file
            if (files[0].type != 'application/json') {
                this.props.appState.alert('<b>Error:</b> The file you selected is not a JSON.');
                return;
            }

            if (
                confirm(
                    'Are you sure you want to import "' + files[0].name + '" into the database?'
                )
            ) {
                let importFunc = data => {
                    try {
                        data = JSON.parse(data);
                        this.props.appState.importOffers(data);
                    } catch (err) {
                        this.props.appState.alert('<b>Error:</b> ' + err);
                    }
                };

                let reader = new FileReader();
                reader.onload = event => importFunc(event.target.result);
                reader.readAsText(files[0]);
            }

            fileInput.value = '';
        }
    }

    render() {
        return (
            <ButtonToolbar id="import-buttons">
                <Button
                    bsStyle="success"
                    onClick={() => document.getElementById('file-input').click()}>
                    {this.props.appState.importing() &&
                        <i
                            className="fa fa-spinner fa-spin"
                            style={{ fontSize: '20px', color: 'blue' }}
                        />}
                    Import offers from file
                </Button>

                <input
                    id="file-input"
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    onChange={() => this.uploadFile()}
                />

                <Button
                    bsStyle="success"
                    onClick={() => {
                        if (
                            confirm(
                                'Are you sure you want to import the current set of locked assignments into the database?'
                            )
                        ) {
                            this.props.appState.importAssignments();
                        }
                    }}>
                    {this.props.appState.importing() &&
                        <i
                            className="fa fa-spinner fa-spin"
                            style={{ fontSize: '20px', color: 'blue' }}
                        />}
                    Import locked assignments
                </Button>
            </ButtonToolbar>
        );
    }
}

export { ImportForm };
