import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Modal, Table, 
  Form, Alert, Badge, Accordion, ListGroup 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/lsyout/Header';
import Sidebar from '../components/lsyout/Sidebar';
import { stockAPI, itemTreeAPI } from '../services/api';

const UretimAgaci = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [components, setComponents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItemCode, setSelectedItemCode] = useState('');
  const [itemTree, setItemTree] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tüm ürünleri yükle
  const fetchItems = async () => {
    try {
      const response = await stockAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setError('Ürünler yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Bileşen ekle
  const addComponent = () => {
    setComponents([...components, { childItemCode: '', quantity: 1 }]);
  };

  // Bileşen kaldır
  const removeComponent = (index) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
  };

  // Bileşen güncelle
  const updateComponent = (index, field, value) => {
    const newComponents = [...components];
    newComponents[index][field] = value;
    setComponents(newComponents);
  };

  // Ürün ağacı oluştur
  const createItemTree = async () => {
    if (!selectedParent) {
      setError('Lütfen ana ürün seçin');
      return;
    }

    if (components.length === 0) {
      setError('En az bir bileşen ekleyin');
      return;
    }

    const invalidComponents = components.filter(comp => !comp.childItemCode || comp.quantity <= 0);
    if (invalidComponents.length > 0) {
      setError('Lütfen tüm bileşenleri doğru şekilde doldurun');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const treeData = {
        ParentItemCode: selectedParent,
        components: components
      };

      console.log('Ürün ağacı oluşturuluyor:', treeData);
      const response = await itemTreeAPI.createTreeBulk(treeData);
      console.log('Ürün ağacı oluşturuldu:', response.data);

      setSuccess('Ürün ağacı başarıyla oluşturuldu!');
      setShowCreateModal(false);
      setSelectedParent('');
      setComponents([]);
      
      // 2 saniye sonra başarı mesajını temizle
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Ürün ağacı oluşturulurken hata:', error);
      setError('Ürün ağacı oluşturulurken hata oluştu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Ürün ağacını görüntüle
  const viewItemTree = async (itemCode) => {
    try {
      setLoading(true);
      setError('');
      setSelectedItemCode(itemCode);

      // Ürün ağacını getir
      const treeResponse = await itemTreeAPI.getTreeByItemCode(itemCode);
      setItemTree(treeResponse.data);

      // Toplam maliyeti hesapla
      try {
        const costResponse = await itemTreeAPI.getTotalCost(itemCode);
        setTotalCost(costResponse.data || 0);
      } catch (costError) {
        console.log('Maliyet hesaplanamadı:', costError);
        setTotalCost(0);
      }

      setShowViewModal(true);
    } catch (error) {
      console.error('Ürün ağacı yüklenirken hata:', error);
      setError('Ürün ağacı yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Ürün ağacını sil
  const deleteItemTree = async (itemCode) => {
    if (window.confirm('Bu ürünün ağacını silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        await itemTreeAPI.deleteRelation(itemCode);
        setSuccess('Ürün ağacı başarıyla silindi!');
        
        // Modal'ı kapat
        setShowViewModal(false);
        
        // 2 saniye sonra başarı mesajını temizle
        setTimeout(() => setSuccess(''), 2000);
      } catch (error) {
        console.error('Ürün ağacı silinirken hata:', error);
        setError('Ürün ağacı silinirken hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  // Ürün adını getir
  const getItemName = (itemCode) => {
    const item = items.find(i => i.itemCode === itemCode);
    return item ? item.name : itemCode;
  };

  // Ürün fiyatını getir
  const getItemPrice = (itemCode) => {
    const item = items.find(i => i.itemCode === itemCode);
    return item ? item.price : 0;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container fluid className="p-4">
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Ürün Ağacı Yönetimi</h2>
                <Button 
                  variant="primary" 
                  onClick={() => setShowCreateModal(true)}
                >
                  ➕ Yeni Ürün Ağacı Oluştur
                </Button>
              </div>
            </Col>
          </Row>

          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h5>Mevcut Ürünler</h5>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Ürün Kodu</th>
                        <th>Ürün Adı</th>
                        <th>Miktar</th>
                        <th>Birim</th>
                        <th>Fiyat</th>
                        <th>Çap</th>
                        <th>Boy</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            Ürün bulunamadı
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
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
                                variant="outline-info" 
                                size="sm"
                                onClick={() => viewItemTree(item.itemCode)}
                                className="me-2"
                              >
                                👁️ Ağacı Gör
                              </Button>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setSelectedParent(item.itemCode);
                                  setComponents([]);
                                  setShowCreateModal(true);
                                }}
                              >
                                ➕ Ağaç Oluştur
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

        {/* Ürün Ağacı Oluşturma Modal */}
        <Modal 
          show={showCreateModal} 
          onHide={() => setShowCreateModal(false)} 
          size="lg"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Yeni Ürün Ağacı Oluştur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Ana Ürün</Form.Label>
                <Form.Select 
                  value={selectedParent} 
                  onChange={(e) => setSelectedParent(e.target.value)}
                >
                  <option value="">Ana ürün seçin...</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.itemCode}>
                      {item.itemCode} - {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="mb-0">Bileşenler</Form.Label>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={addComponent}
                  >
                    ➕ Bileşen Ekle
                  </Button>
                </div>

                {components.length === 0 ? (
                  <Alert variant="info">
                    Henüz bileşen eklenmedi. Bileşen eklemek için yukarıdaki butona tıklayın.
                  </Alert>
                ) : (
                  components.map((component, index) => (
                    <Card key={index} className="mb-2">
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Bileşen Ürün</Form.Label>
                              <Form.Select 
                                value={component.childItemCode} 
                                onChange={(e) => updateComponent(index, 'childItemCode', e.target.value)}
                              >
                                <option value="">Bileşen seçin...</option>
                                {items.map((item) => (
                                  <option key={item.id} value={item.itemCode}>
                                    {item.itemCode} - {item.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Miktar</Form.Label>
                              <Form.Control 
                                type="number" 
                                min="0.01" 
                                step="0.01"
                                value={component.quantity} 
                                onChange={(e) => updateComponent(index, 'quantity', parseFloat(e.target.value) || 0)}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={2} className="d-flex align-items-end">
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => removeComponent(index)}
                            >
                              🗑️
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              İptal
            </Button>
            <Button 
              variant="primary" 
              onClick={createItemTree}
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Ürün Ağacı Görüntüleme Modal */}
        <Modal 
          show={showViewModal} 
          onHide={() => setShowViewModal(false)} 
          size="lg"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Ürün Ağacı: {selectedItemCode} - {getItemName(selectedItemCode)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Yükleniyor...</span>
                </div>
                <p className="mt-2">Ürün ağacı yükleniyor...</p>
              </div>
            ) : (
              <>
                <Alert variant="info" className="mb-3">
                  <strong>Toplam Maliyet:</strong> {totalCost.toFixed(2)} ₺
                </Alert>

                {itemTree.length === 0 ? (
                  <Alert variant="warning">
                    Bu ürün için henüz ağaç tanımlanmamış.
                  </Alert>
                ) : (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Bileşen Kodu</th>
                        <th>Bileşen Adı</th>
                        <th>Miktar</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam Maliyet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemTree.map((treeItem) => (
                        <tr key={treeItem.id}>
                          <td>{treeItem.childItem?.itemCode}</td>
                          <td>{treeItem.childItem?.name}</td>
                          <td>{treeItem.quantity}</td>
                          <td>{treeItem.childItem?.price} ₺</td>
                          <td>{(treeItem.quantity * treeItem.childItem?.price).toFixed(2)} ₺</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="danger" 
              onClick={() => deleteItemTree(selectedItemCode)}
              disabled={loading || itemTree.length === 0}
            >
              🗑️ Ağacı Sil
            </Button>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Kapat
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UretimAgaci; 