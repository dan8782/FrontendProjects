import { Col, Card, Button } from 'react-bootstrap';

function VacancyDetailsCard({ selectedVacancy, handleCloseDetails }) {
    return (
        <>
            {selectedVacancy && (
                <Col sm={5} className='pt-5 mt-3'>
                    <Card>
                        <Card.Header>{selectedVacancy.title}</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <Card.Text>Status: {selectedVacancy.status}</Card.Text>
                            </Card.Title>
                            <Card.Text>
                                {selectedVacancy.description || 'No description available'}
                            </Card.Text>
                            <Card.Text>English Level: {selectedVacancy.englishLevel || 'Not specified'}</Card.Text>
                            <Card.Text>Grades: {selectedVacancy.grades || 'Not specified'}</Card.Text>
                            <Card.Text>
                                Tags: {selectedVacancy.tags ? selectedVacancy.tags.join(', ') : 'Not specified'}
                            </Card.Text>
                            <Card.Link>
                                <Button variant="link" onClick={handleCloseDetails}>
                                    Закрыть
                                </Button>
                            </Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            )}
        </>
    );
}

export default VacancyDetailsCard;