import React, { useState, useEffect } from 'react';
import api from '../api';  // This is your Axios or Fetch API instance for making requests
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';  // Import Bootstrap components
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

function UpdatePassClassification() {
    const { t } = useTranslation(); //Initialize the translation function
    const [passList, setPassList] = useState([]);  // Holds the list of pass_name/main pairs
    const [selectedPass, setSelectedPass] = useState(null);  // Holds the selected pass_name/main pair
    const [mainValue, setMainValue] = useState('');  // Holds the main value to be updated

    //Fetch the list of pass_name/main pairs on component mount
    useEffect(() => {
        api.get('/pass-name-main')
            .then(response => {
                setPassList(response.data);  //Store the pass list
            })
            .catch(error => {
                console.error("Error fetching pass list", error);
            });
    }, []);

    //Handle when a pass is selected from the dropdown
    const handlePassChange = (event) => {
        const selectedPassName = event.target.value;
        const pass = passList.find(p => p.pass_name === selectedPassName);
        setSelectedPass(pass);  //Store the selected pass
        setMainValue(pass ? pass.main : '');  //Set the main value in the text field, or empty if nothing is selected
    };

    //Handle form submission to update the main value
    const handleSubmit = (event) => {
        event.preventDefault();

        if (selectedPass) {
            const passId = selectedPass.id;
            api.put(`/update-pass-category/${passId}`, { main: mainValue })
                .then(response => {
                    alert("Pass category updated successfully!");
                    setPassList((prevPassList) => {
                        return prevPassList.map((pass) =>
                            pass.id === passId ? { ...pass, main: mainValue } : pass
                        );
                    });
                })
                .catch(error => {
                    console.error("Error updating pass category", error);
                });
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    {/* Bootstrap Card wrapping the entire form */}
                    <Card className="shadow-sm">
                        <Card.Header as="h5">{t('card.updatePassCategory')}</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/* Dropdown to select a pass */}
                                <Form.Group controlId="formPassSelect">
                                    <Form.Label>{t('card.passSelect')}:</Form.Label>
                                    <Form.Select onChange={handlePassChange}>
                                        <option value="">{t('card.select')}</option>
                                        {passList.map((pass) => (
                                            <option key={pass.id} value={pass.pass_name}>
                                                {`${pass.id} - ${pass.pass_name} - ${pass.main}`}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {/* Input field to update the main value */}
                                <Form.Group controlId="formMainInput" className="mt-3">
                                    <Form.Label>{t('card.updateCategory')}:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={mainValue}
                                        placeholder={t('card.noSelection')}
                                        onChange={(e) => setMainValue(e.target.value)}
                                    />
                                </Form.Group>

                                {/* Submit button */}
                                <Button variant="primary" type="submit" className="mt-3" disabled={!selectedPass}>
                                    {t('card.update')}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default UpdatePassClassification;
