import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const StokFormu = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    itemCode: '',
    name: '',
    quantity: '',
    birim: '',
    price: '',
    criticalAmount: '',
    description: '',
    cap: '',
    boy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        itemCode: item.itemCode || '',
        name: item.name || '',
        quantity: item.quantity || '',
        birim: item.birim || '',
        price: item.price || '',
        criticalAmount: item.criticalAmount || '',
        description: item.description || '',
        cap: item.cap || '',
        boy: item.boy || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend'in beklediği formata çeviriyoruz
      const submitData = {
        ...formData,
        quantity: parseFloat(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        criticalAmount: parseInt(formData.criticalAmount) || 0,
        cap: parseFloat(formData.cap) || 0,
        boy: parseFloat(formData.boy) || 0
      };

      await onSave(submitData);
    } catch (error) {
      setError(error.message || 'Kaydetme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const birimler = [
    'Adet',
    'Kg',
    'Litre',
    'Metre',
    'Paket',
    'Kutu',
    'Çift',
    'Gram',
    'Ton'
  ];

  return (
    <Card>
      <Card.Header>
        <h5>{item ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ürün Kodu *</Form.Label>
                <Form.Control
                  type="text"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  placeholder="Örn: PRD001"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ürün Adı *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ürün adını girin"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Miktar *</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Birim *</Form.Label>
                <Form.Select
                  name="birim"
                  value={formData.birim}
                  onChange={handleChange}
                  required
                >
                  <option value="">Birim seçin</option>
                  {birimler.map(birim => (
                    <option key={birim} value={birim}>
                      {birim}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Fiyat (₺) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Kritik Miktar *</Form.Label>
                <Form.Control
                  type="number"
                  name="criticalAmount"
                  value={formData.criticalAmount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Kap (Boyut)</Form.Label>
                <Form.Control
                  type="number"
                  name="cap"
                  value={formData.cap}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Boy (Boyut)</Form.Label>
                <Form.Control
                  type="number"
                  name="boy"
                  value={formData.boy}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ürün hakkında açıklama..."
              rows="3"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onCancel}>
              İptal
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor...' : (item ? 'Güncelle' : 'Kaydet')}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default StokFormu;
