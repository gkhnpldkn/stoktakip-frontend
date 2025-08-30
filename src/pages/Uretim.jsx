import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Form, InputGroup } from 'react-bootstrap';
import Header from '../components/lsyout/Header';
import Sidebar from '../components/lsyout/Sidebar';
import { stockAPI, productionAPI } from '../services/api';
import ProductionModal from '../components/stok/ProductionModal';

const Uretim = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await stockAPI.getAll();
      setItems(response.data);
    } catch (error) {
      setError('Ürün listesi yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleProduction = (item) => {
    setSelectedItem(item);
    setShowProductionModal(true);
  };

  const handleProductionSuccess = () => {
    fetchItems(); // Listeyi yenile
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Header />
          <Container fluid className="p-4">
            <div className="text-center">Yükleniyor...</div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col>
              <h2>Üretim Yönetimi</h2>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Üretim Yapılabilir Ürünler</h5>
                    <InputGroup style={{ width: '300px' }}>
                      <Form.Control
                        placeholder="Ürün ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Ürün Kodu</th>
                        <th>Ürün Adı</th>
                        <th>Mevcut Stok</th>
                        <th>Birim</th>
                        <th>Fiyat</th>
                        <th>Çap</th>
                        <th>Boy</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            Ürün bulunamadı
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map((item) => (
                          <tr key={item.id}>
                            <td>{item.itemCode}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.birim}</td>
                            <td>{item.price} ₺</td>
                            <td>{item.cap || '-'}</td>
                            <td>{item.boy || '-'}</td>
                            <td>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleProduction(item)}
                              >
                                🏭 Üretim Yap
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Üretim Modal */}
        <ProductionModal
          show={showProductionModal}
          onHide={() => setShowProductionModal(false)}
          itemCode={selectedItem?.itemCode}
          onSuccess={handleProductionSuccess}
        />
      </div>
    </div>
  );
};

export default Uretim; 