import React, { useState, useEffect } from 'react';
import { VacancyCard } from './OpenVacancies';
import axios from 'axios';

const ActiveVacancies = ({ onVacancyClick }) => {
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        const fetchMyVacancies = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/my-vacancies`, { withCredentials: true });
                setVacancies(response.data);
            } catch (error) {
                console.error('Error fetching employer vacancies:', error);
            }
        };
        fetchMyVacancies();
    }, []);

    return (
        <div>
            <h1>Open Vacancies</h1>
            {vacancies.map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} onVacancyClick={() => onVacancyClick(vacancy)} isActive={true}/>
            ))}
        </div>
    );
};

export default ActiveVacancies;
