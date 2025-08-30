import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import Header from '../components/lsyout/Header';
import Sidebar from '../components/lsyout/Sidebar';
import StokListesi from '../components/stok/StokListesi';
import StokFormu from '../components/stok/StokFormu';
import { stockAPI } from '../services/api';

const StokYönetimi = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await stockAPI.delete(id);
        setAlert({
          show: true,
          message: 'Ürün başarıyla silindi',
          variant: 'success'
        });
        // Listeyi yenilemek için bir callback eklenebilir
      } catch (error) {
        setAlert({
          show: true,
          message: 'Ürün silinirken hata oluştu',
          variant: 'danger'
        });
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        // Güncelleme için itemCode kullanıyoruz
        await stockAPI.update(editingItem.itemCode, formData);
        setAlert({
          show: true,
          message: 'Ürün başarıyla güncellendi',
          variant: 'success'
        });
      } else {
        await stockAPI.create(formData);
        setAlert({
          show: true,
          message: 'Ürün başarıyla eklendi',
          variant: 'success'
        });
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'İşlem sırasında hata oluştu');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <h2>Stok Yönetimi</h2>
                <Button variant="primary" onClick={handleAddNew}>
                  + Yeni Ürün Ekle
                </Button>
              </div>
            </Col>
          </Row>

          {alert.show && (
            <Alert
              variant={alert.variant}
              onClose={() => setAlert({ ...alert, show: false })}
              dismissible
              className="mb-3"
            >
              {alert.message}
            </Alert>
          )}

          <Row>
            <Col>
              <StokListesi
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          </Row>
        </Container>

        <Modal
          show={showForm}
          onHide={handleCancel}
          size="lg"
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StokFormu
              item={editingItem}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default StokYönetimi;
