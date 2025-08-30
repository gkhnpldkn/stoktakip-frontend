import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { productionAPI } from '../../services/api';

const ProductionModal = ({ show, onHide, itemCode, onSuccess }) => {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWarnings([]);

    try {
      const response = await productionAPI.produceItem(itemCode, count);
      setWarnings(response.data);
      
      if (response.data.length === 0) {
        onSuccess();
        onHide();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Üretim sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCount(1);
    setError('');
    setWarnings([]);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Üretim Yap</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {warnings.length > 0 && (
          <Alert variant="warning" className="mb-3">
            <h6>Uyarılar:</h6>
            <ul className="mb-0">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Ürün Kodu</Form.Label>
                <Form.Control
                  type="text"
                  value={itemCode}
                  disabled
                  className="bg-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Üretim Miktarı *</Form.Label>
                <Form.Control
                  type="number"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              İptal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Üretiliyor...' : 'Üretim Yap'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductionModal; 