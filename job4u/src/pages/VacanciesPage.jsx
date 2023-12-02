import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import VacancyList from './OpenVacancies';
import CreateVacancyForm from './CreateVacancies';
import ActiveVacancies from './ActiveVacancies';
import MyVacancies from './MyVacancies';
import VacancyDetailsCard from './VacancyDetail';
import { useState } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector';

import 'bootstrap/dist/css/bootstrap.min.css';
import './vacancies.css'

function NavPage() {
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const userRole = useSelector((state) => state.auth.userRole);
    const userId = useSelector((state) => state.auth.userId);

    const isEmployer = userRole === 'employer'; // работодатель
    const isApplicant = userRole === 'applicant'; // соискатель

    const handleVacancyClick = (vacancy) => {
        setSelectedVacancy(vacancy);
    };

    const handleCloseDetails = () => {
        setSelectedVacancy(null);
    };

    const colSmValue = selectedVacancy ? 4 : 9;

    return (
        <div className='container bg-dark p-2'>
            <Tab.Container defaultActiveKey="allVacancies">
                <Container className='mt-1'>
                    <Row className='vh-100'>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="allVacancies">Вакансии</Nav.Link>
                                </Nav.Item>
                                {
                                    isApplicant && (
                                        <Nav.Item>
                                            <Nav.Link eventKey="myVacancies">Мои вакансии</Nav.Link>
                                        </Nav.Item>
                                    )
                                }
                                {
                                    isEmployer && (
                                        <Nav.Item>
                                            <Nav.Link eventKey="activeVacancies">Активные вакансии</Nav.Link>
                                        </Nav.Item>
                                    )
                                }
                                {
                                    isEmployer && (
                                        <Nav.Item>
                                            <Nav.Link eventKey="createVacancies">Создать вакансию</Nav.Link>
                                        </Nav.Item>
                                    )
                                }
                                <Nav.Item>
                                    <Nav.Link href='/logout'>Выйти</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={colSmValue} style={{ height: '100%', overflowY: 'scroll' }}>
                            <Tab.Content>
                                <Tab.Pane eventKey="allVacancies">
                                    <VacancyList onVacancyClick={handleVacancyClick} userId={userId}></VacancyList>
                                </Tab.Pane>
                                <Tab.Pane eventKey="myVacancies">
                                    <MyVacancies onVacancyClick={handleVacancyClick}></MyVacancies>
                                </Tab.Pane>
                                <Tab.Pane eventKey="activeVacancies">
                                    <ActiveVacancies onVacancyClick={handleVacancyClick} userId={userId}></ActiveVacancies>
                                </Tab.Pane>
                                <Tab.Pane eventKey="createVacancies">
                                    <CreateVacancyForm></CreateVacancyForm>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                        <VacancyDetailsCard
                            selectedVacancy={selectedVacancy}
                            handleCloseDetails={handleCloseDetails}
                        ></VacancyDetailsCard>
                    </Row>
                </Container>
            </Tab.Container>
        </div>
    )
}
export default NavPage;