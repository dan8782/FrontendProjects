import { useState, useCallback } from "react";

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = useCallback(() => {
        onSearch(searchTerm);
        setSearchTerm('');
    }, [onSearch, searchTerm]);


    return (
        <center>
            <InputGroup className="w-50">
                <Form.Control
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch} variant="outline-secondary" className='bg-white' id="button-addon1">
                    Поиск
                </Button>
            </InputGroup>
        </center>
    )
}

export default SearchBar;