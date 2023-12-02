import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalPass({show,handleClose}) {
    return (
        < Modal
    show = { show }
    onHide = { handleClose }
    backdrop = "static"
    keyboard = { false}
        >
        <Modal.Header closeButton>
            <Modal.Title>Неправильный email или пароль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Вы ввели неправильный email или пароль.
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Закрыть
            </Button>
            <Button variant="primary" onClick={handleClose}>Ok</Button>
        </Modal.Footer>
    </Modal >
    )
}

export default ModalPass