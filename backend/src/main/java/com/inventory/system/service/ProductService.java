package com.inventory.system.service;

import com.inventory.system.entity.Product;
import com.inventory.system.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Product getProductByBarcode(String barcode) {

        return repository.findByBarcode(barcode)
                .orElse(null);

    }

}