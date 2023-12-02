import React, { useState, useEffect } from 'react';
import { VacancyCard } from './OpenVacancies';
import axios from 'axios';

const MyVacancies = ({ onVacancyClick, userId }) => {
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        const fetchMyVacancies = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/applied-vacancies`, { withCredentials: true });
            setVacancies(response.data);
          } catch (error) {
            console.error('Error fetching vacancies:', error);
          }
        };
    
        fetchMyVacancies();
      }, []);

    return (
        <div>
            <h1>Open Vacancies</h1>
            {vacancies.map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} onVacancyClick={() => onVacancyClick(vacancy)} />
            ))}
        </div>
    );
};

export default MyVacancies;
