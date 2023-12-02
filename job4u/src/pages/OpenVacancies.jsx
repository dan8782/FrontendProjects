import { useSelector } from 'react-redux/es/hooks/useSelector';
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const VacancyList = ({ onVacancyClick }) => {
    const [openVacancies, setOpenVacancies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/vacancies`);
                setOpenVacancies(response.data);
            } catch (error) {
                console.error('Error fetching open vacancies:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1 className='text-align-center'>Open Vacancies</h1>
            {openVacancies.map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} onVacancyClick={() => onVacancyClick(vacancy)} />
            ))}
        </div>
    );
};

export const VacancyCard = ({ vacancy, onVacancyClick, isActive }) => {
    const [hasApplied, setHasApplied] = useState(false);
    const [applicantsCount, setApplicantsCount] = useState(0);

    const userRole = useSelector((state) => state.auth.userRole);
    const userId = useSelector((state) => state.auth.userId);

    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/vacancies`);
                const vacancies = response.data;
                const currentVacancy = vacancies.find((v) => v.id === vacancy.id);
                const applicants = currentVacancy.applicants || [];
                setHasApplied(applicants.includes(userId));
                setApplicantsCount(applicants.length);
            } catch (error) {
                console.error('Error checking application status:', error);
            }
        };

        checkApplicationStatus();
    }, [userId, vacancy.id]);

    const handleCardClick = () => {
        if (onVacancyClick) {
            onVacancyClick();
        }
    };

    const handleApplyClick = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/vacancies/${vacancy.id}`, {
                applicantProfileId: userId,
            });
            console.log(response.data);
            setHasApplied(!hasApplied);
        } catch (error) {
            console.error('Error applying to/canceling vacancy:', error);
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/vacancies/${vacancy.id}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error deleting vacancy:', error);
        }
    };

    return (
        <Card style={{ border: '1px solid #ddd', borderRadius: '8px', margin: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} onClick={handleCardClick}>
            <Card.Header>
                {vacancy.title}
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    {vacancy.description || 'No description available'}
                </Card.Text>
                {vacancy.companyName && <Card.Text>Имя компании: {vacancy.companyName}</Card.Text>}
                {userRole === 'applicant' && (
                    <Button variant="primary" onClick={handleApplyClick} className='otlkik'>
                        {hasApplied ? 'Откликнуто' : 'Откликнуться'}
                    </Button>
                )}
                {isActive && (
                    <Button variant="danger" onClick={handleDeleteClick} className='delete-button'>
                        Удалить вакансию
                    </Button>
                )}
            </Card.Body>
            <Card.Footer className="text-muted">
                Количество откликнувшихся: {applicantsCount}
            </Card.Footer>
        </Card>
    );
};

export default VacancyList;
