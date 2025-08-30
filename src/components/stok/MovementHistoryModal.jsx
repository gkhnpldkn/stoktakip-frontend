import React, { useState, useEffect } from 'react';
import { Modal, Table, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { movementAPI } from '../../services/api';

const MovementHistoryModal = ({ show, onHide, itemCode, itemName }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    from: '',
    to: ''
  });

  useEffect(() => {
    if (show && itemCode) {
      fetchMovements();
    }
  }, [show, itemCode]);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const response = await movementAPI.getMovements(itemCode, filters);
      setMovements(response.data);
    } catch (error) {
      setError('Hareket geçmişi yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchMovements();
  };

  const getMovementTypeBadge = (type) => {
    const variants = {
      'CREATE': 'success',
      'UPDATE': 'info',
      'DELETE': 'danger',
      'INBOUND': 'primary',
      'OUTBOUND': 'warning',
      'PRODUCE': 'success',
      'CONSUME': 'danger'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Hareket Geçmişi - {itemName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleFilterSubmit} className="mb-3">
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Hareket Tipi</Form.Label>
                <Form.Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">Tümü</option>
                  <option value="CREATE">Oluşturma</option>
                  <option value="UPDATE">Güncelleme</option>
                  <option value="DELETE">Silme</option>
                  <option value="INBOUND">Giriş</option>
                  <option value="OUTBOUND">Çıkış</option>
                  <option value="PRODUCE">Üretim</option>
                  <option value="CONSUME">Tüketim</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Başlangıç Tarihi</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Bitiş Tarihi</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Yükleniyor...' : 'Filtrele'}
              </Button>
            </Col>
          </Row>
        </Form>

        {loading ? (
          <div className="text-center p-4">Yükleniyor...</div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Hareket Tipi</th>
                <th>Önceki Miktar</th>
                <th>Değişim</th>
                <th>Yeni Miktar</th>
                <th>Sebep</th>
                <th>Referans</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Hareket bulunamadı
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{formatDate(movement.createdAt)}</td>
                    <td>{getMovementTypeBadge(movement.movementType)}</td>
                    <td>{movement.previousQuantity}</td>
                    <td className={movement.quantityChange > 0 ? 'text-success' : 'text-danger'}>
                      {movement.quantityChange > 0 ? '+' : ''}{movement.quantityChange}
                    </td>
                    <td>{movement.newQuantity}</td>
                    <td>{movement.reason}</td>
                    <td>{movement.reference}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MovementHistoryModal; 