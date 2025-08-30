import React, { useState } from 'react';
import { Container, Button, Alert, Card } from 'react-bootstrap';
import { stockAPI } from '../services/api';

const TestAPI = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      console.log('API test başlıyor...');
      const response = await stockAPI.getAll();
      console.log('API response:', response);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('API test hatası:', error);
      setError(`Hata: ${error.message}`);
      if (error.response) {
        setError(`HTTP ${error.response.status}: ${error.response.statusText}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>API Bağlantı Testi</h2>
      
      <Card className="mb-3">
        <Card.Body>
          <Button 
            variant="primary" 
            onClick={testAPI}
            disabled={loading}
          >
            {loading ? 'Test Ediliyor...' : 'API Test Et'}
          </Button>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger">
          <h5>Hata:</h5>
          <pre>{error}</pre>
        </Alert>
      )}

      {result && (
        <Alert variant="success">
          <h5>Başarılı! API Response:</h5>
          <pre style={{ fontSize: '12px', maxHeight: '400px', overflow: 'auto' }}>
            {result}
          </pre>
        </Alert>
      )}
    </Container>
  );
};

export default TestAPI; 