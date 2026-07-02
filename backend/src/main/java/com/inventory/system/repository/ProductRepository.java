package com.inventory.system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.system.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByBarcode(String barcode);

    long countByQuantityLessThan(int quantity);

    boolean existsByBarcode(String barcode);

    boolean existsByName(String name);
}