import React from 'react';
import { Card, Badge, Row, Col, Button } from 'react-bootstrap';

const StokKarti = ({ stok, onEdit, onDelete }) => {
  const getStokDurumu = (miktar, kritikSeviye) => {
    if (miktar <= 0) return { text: 'Tükendi', variant: 'danger' };
    if (miktar <= kritikSeviye) return { text: 'Kritik', variant: 'warning' };
    if (miktar <= kritikSeviye * 2) return { text: 'Düşük', variant: 'info' };
    return { text: 'Normal', variant: 'success' };
  };

  const durum = getStokDurumu(stok.miktar, stok.kritikSeviye);

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <strong>{stok.urunKodu}</strong>
          <Badge bg={durum.variant} className="ms-2">
            {durum.text}
          </Badge>
        </div>
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-1"
            onClick={() => onEdit(stok)}
          >
            ✏️
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(stok.id)}
          >
            🗑️
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <h6 className="card-title">{stok.urunAdi}</h6>
        <p className="text-muted small mb-2">{stok.kategori}</p>
        
        <Row className="mb-2">
          <Col xs={6}>
            <small className="text-muted">Miktar:</small>
            <div><strong>{stok.miktar} {stok.birim}</strong></div>
          </Col>
          <Col xs={6}>
            <small className="text-muted">Fiyat:</small>
            <div><strong>{stok.fiyat} ₺</strong></div>
          </Col>
        </Row>
        
        <Row>
          <Col xs={6}>
            <small className="text-muted">Kritik Seviye:</small>
            <div><strong>{stok.kritikSeviye} {stok.birim}</strong></div>
          </Col>
          <Col xs={6}>
            <small className="text-muted">Toplam Değer:</small>
            <div><strong>{(stok.miktar * stok.fiyat).toFixed(2)} ₺</strong></div>
          </Col>
        </Row>
        
        {stok.aciklama && (
          <div className="mt-2">
            <small className="text-muted">Açıklama:</small>
            <p className="small mb-0">{stok.aciklama}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default StokKarti;
