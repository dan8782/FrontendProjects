import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';

const CreateVacancyForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [englishLevel, setEnglishLevel] = useState('');
    const [grades, setGrades] = useState('');
    const [tags, setTags] = useState([]);

    const handleCreateVacancy = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/vacancies`,
                {
                    title,
                    description,
                    englishLevel,
                    grades,
                    tags,
                },
                {
                    withCredentials: true,
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error('Error creating vacancy:', error);
        }
    };

    const handleTagClick = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    return (
        <Form onSubmit={handleCreateVacancy}>
            <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title:</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description:</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEnglishLevel">
                <Form.Label>English Level:</Form.Label>
                <DropdownButton id="dropdown-english-level" title={englishLevel || 'Select Level'}>
                    <Dropdown.Item onClick={() => setEnglishLevel('Beginner')}>Beginner</Dropdown.Item>
                    <Dropdown.Item onClick={() => setEnglishLevel('Intermediate')}>Intermediate</Dropdown.Item>
                    <Dropdown.Item onClick={() => setEnglishLevel('Advanced')}>Advanced</Dropdown.Item>
                </DropdownButton>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGrades">
                <Form.Label>Grade:</Form.Label>
                <DropdownButton id="dropdown-grades" title={grades || 'Select Grade'}>
                    <Dropdown.Item onClick={() => setGrades('A')}>A</Dropdown.Item>
                    <Dropdown.Item onClick={() => setGrades('B')}>B</Dropdown.Item>
                    <Dropdown.Item onClick={() => setGrades('C')}>C</Dropdown.Item>
                </DropdownButton>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTags">
                <Form.Label>Tags:</Form.Label>
                <DropdownButton id="dropdown-tags" title="Select Tags">
                    <Dropdown.Item onClick={() => handleTagClick('C#')}>C#</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTagClick('Golang')}>Golang</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTagClick('Python')}>Python</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTagClick('JavaScript')}>JavaScript</Dropdown.Item>
                </DropdownButton>
                {tags.length > 0 && (
                    <div>
                        Selected Tags:
                        <ul>
                            {tags.map((tag, index) => (
                                <li key={index}>
                                    {tag}{' '}
                                    <Button variant="link" size="sm" onClick={() => handleRemoveTag(tag)}>
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Form.Group>

            <Button variant="primary" type="submit">
                Create Vacancy
            </Button>
        </Form>
    );
};

export default CreateVacancyForm;
