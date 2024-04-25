import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDescription from '../components/ProductDescription';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Product Name',
  price: 10,
  category: 'Category',
  description: 'Product Description',
  imageUrl: 'https://example.com/image.jpg',
};

jest.mock('../AuthTokenContext', () => ({
  useAuthToken: jest.fn(() => ({
    isAuthenticated: false,
    accessToken: 'fake-access-token',
  })),
}));

describe('ProductDescription Component Tests', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });
  });

  test('renders product details', async () => {
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDescription />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText('Product Name');

    // Assertions for product details
    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('Price: $10')).toBeInTheDocument();
    expect(screen.getByText('Category: Category')).toBeInTheDocument();
    expect(screen.getByText('Product Description')).toBeInTheDocument();
  });
});
