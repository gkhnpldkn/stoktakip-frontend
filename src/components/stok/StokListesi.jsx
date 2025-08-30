import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, InputGroup, Form, Alert, ButtonGroup } from 'react-bootstrap';
import { stockAPI } from '../../services/api';
import ProductionModal from './ProductionModal';
import MovementHistoryModal from './MovementHistoryModal';
import * as XLSX from 'xlsx';

const StokListesi = ({ onEdit, onDelete, onRefresh }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('API çağrısı yapılıyor...');
      const response = await stockAPI.getAll();
      console.log('API response:', response);
      console.log('API data:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('API hatası:', error);
      setError('Ürün listesi yüklenirken hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems();
      return;
    }

    try {
      setLoading(true);
      const response = await stockAPI.getByItemCode(searchTerm);
      // Tek bir ürün döndüğü için array'e çeviriyoruz
      setItems([response.data]);
    } catch (error) {
      setError('Arama yapılırken hata oluştu');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getStokDurumu = (quantity, criticalAmount) => {
    if (quantity <= 0) return <Badge bg="danger">Tükendi</Badge>;
    if (quantity <= criticalAmount) return <Badge bg="warning">Kritik</Badge>;
    if (quantity <= criticalAmount * 2) return <Badge bg="info">Düşük</Badge>;
    return <Badge bg="success">Normal</Badge>;
  };

  const handleProduction = (item) => {
    setSelectedItem(item);
    setShowProductionModal(true);
  };

  const handleMovementHistory = (item) => {
    setSelectedItem(item);
    setShowMovementModal(true);
  };

  const handleProductionSuccess = () => {
    fetchItems(); // Listeyi yenile
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StokListesi");
    XLSX.writeFile(wb, "StokListesi.xlsx");
  };

  console.log('Items state:', items);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  if (loading) {
    return <div className="text-center p-4">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={fetchItems} className="mb-3">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Ürün Listesi</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={fetchItems}>
            🔄 Yenile
          </Button>
          <InputGroup style={{ width: '300px' }}>
            <Form.Control
              placeholder="Ürün kodu ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} nKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              Ara
            </Button>
          </InputGroup>
          <Button variant="outline-success" onClick={exportToExcel}>
            Excel İndir
          </Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Ürün Kodu</th>
            <th>Ürün Adı</th>
            <th>Miktar</th>
            <th>Birim</th>
            <th>Fiyat</th>
            <th>Kritik Miktar</th>
            <th>Çap</th>
            <th>Boy</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
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
                <td>{item.criticalAmount}</td>
                <td>{item.cap || '-'}</td>
                <td>{item.boy || '-'}</td>
                <td>{getStokDurumu(item.quantity, item.criticalAmount)}</td>
                <td>
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-primary"
                      onClick={() => onEdit(item)}
                      title="Düzenle"
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="outline-success" nClick={() => handleProduction(item)}
                      title="Üretim Yap"
                    >
                      🏭
                    </Button>
                    <Button
                      variant="outline-info"
                      onClick={() => handleMovementHistory(item)}
                      title="Hareket Geçmişi"
                    >
                      📊
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => onDelete(item.id)}
                      title="Sil"
                    >
                      🗑️
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Üretim Modal */}
      <ProductionModal
        show={showProductionModal}
        onHide={() => setShowProductionModal(false)}
        itemCode={selectedItem?.itemCode}
        onSuccess={handleProductionSuccess}
      />

      {/* Hareket Geçmişi Modal */}
      <MovementHistoryModal
        show={showMovementModal}
        onHide={() => setShowMovementModal(false)}
        itemCode={selectedItem?.itemCode}
        itemName={selectedItem?.name}
      />
    </div>
  );
};

export default StokListesi;
